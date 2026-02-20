const TELEGRAM_API = 'https://api.telegram.org/bot'

interface AppointmentNotification {
  appointmentId: number
  patientName: string
  patientEmail: string
  service: string
  dateTime: string
  staffName?: string
}

export async function sendOwnerNotification(data: AppointmentNotification): Promise<boolean> {
  const botToken = process.env.TELEGRAM_BOT_TOKEN
  const ownerChatId = process.env.TELEGRAM_OWNER_CHAT_ID

  if (!botToken || !ownerChatId) {
    console.log('Telegram not configured, skipping notification')
    console.log('Would send notification:', data)
    return true
  }

  const dateObj = new Date(data.dateTime)
  const formattedDate = dateObj.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
  const formattedTime = dateObj.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  })

  const message = `
🦷 *New Appointment Request*

*Patient:* ${data.patientName}
*Email:* ${data.patientEmail}
*Service:* ${data.service}
*Staff:* ${data.staffName || 'Not specified'}
*Date:* ${formattedDate}
*Time:* ${formattedTime}

Please approve or decline this appointment.
`

  const inlineKeyboard = {
    inline_keyboard: [
      [
        { text: '✅ Approve', callback_data: `approve:${data.appointmentId}` },
        { text: '❌ Decline', callback_data: `decline:${data.appointmentId}` },
      ],
    ],
  }

  try {
    const response = await fetch(`${TELEGRAM_API}${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: ownerChatId,
        text: message,
        parse_mode: 'Markdown',
        reply_markup: inlineKeyboard,
      }),
    })

    const result = await response.json()
    if (!result.ok) {
      console.error('Telegram API error:', result)
      return false
    }

    return true
  } catch (error) {
    console.error('Telegram notification error:', error)
    return false
  }
}

export async function sendPatientNotification(
  chatId: string,
  message: string
): Promise<boolean> {
  const botToken = process.env.TELEGRAM_BOT_TOKEN

  if (!botToken) {
    console.log('Telegram not configured, skipping patient notification')
    return true
  }

  try {
    const response = await fetch(`${TELEGRAM_API}${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'Markdown',
      }),
    })

    const result = await response.json()
    return result.ok
  } catch (error) {
    console.error('Telegram patient notification error:', error)
    return false
  }
}

export async function editMessage(
  chatId: string,
  messageId: number,
  newText: string
): Promise<boolean> {
  const botToken = process.env.TELEGRAM_BOT_TOKEN

  if (!botToken) {
    return true
  }

  try {
    const response = await fetch(`${TELEGRAM_API}${botToken}/editMessageText`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        message_id: messageId,
        text: newText,
        parse_mode: 'Markdown',
      }),
    })

    const result = await response.json()
    return result.ok
  } catch (error) {
    console.error('Telegram edit message error:', error)
    return false
  }
}

export async function handleTelegramWebhook(update: any): Promise<void> {
  // Handle callback queries (button clicks)
  if (update.callback_query) {
    const callbackData = update.callback_query.data
    const [action, appointmentId] = callbackData.split(':')
    const chatId = update.callback_query.message.chat.id
    const messageId = update.callback_query.message.message_id

    // Import here to avoid circular dependency
    const { updateAppointmentStatus, getAppointmentById } = await import('../db/appointments.js')
    const { sendEmail } = await import('./email.js')
    const { createCalendarEvent } = await import('./calendar.js')

    const appointment = getAppointmentById(parseInt(appointmentId))
    if (!appointment) {
      console.error('Appointment not found:', appointmentId)
      return
    }

    if (action === 'approve') {
      // Update status
      updateAppointmentStatus(parseInt(appointmentId), 'APPROVED')

      // Create calendar event
      await createCalendarEvent(
        `${appointment.service} - ${appointment.patient_name}`,
        `Patient: ${appointment.patient_name}\nEmail: ${appointment.patient_email}\nPhone: ${appointment.patient_phone || 'N/A'}`,
        appointment.date_time
      )

      // Send confirmation email
      await sendEmail({
        to: appointment.patient_email,
        subject: '✅ Your appointment at Dr. Ilan Ofeck\'s Dental Clinic is confirmed!',
        html: `
          <h2>Appointment Confirmed!</h2>
          <p>Dear ${appointment.patient_name},</p>
          <p>Your appointment has been approved.</p>
          <p><strong>Service:</strong> ${appointment.service}</p>
          <p><strong>Date & Time:</strong> ${new Date(appointment.date_time).toLocaleString()}</p>
          <p>We look forward to seeing you!</p>
          <p>Best regards,<br>Dr. Ilan Ofeck's Dental Clinic</p>
        `,
      })

      // Update Telegram message
      await editMessage(chatId, messageId, `✅ *Approved*\n\nAppointment for ${appointment.patient_name} has been confirmed.`)
    } else if (action === 'decline') {
      // Update status
      updateAppointmentStatus(parseInt(appointmentId), 'DECLINED')

      // Send decline email
      await sendEmail({
        to: appointment.patient_email,
        subject: 'Regarding your appointment request at Dr. Ilan Ofeck\'s Dental Clinic',
        html: `
          <h2>Appointment Update</h2>
          <p>Dear ${appointment.patient_name},</p>
          <p>Unfortunately, we are unable to accommodate your requested appointment time.</p>
          <p><strong>Requested Service:</strong> ${appointment.service}</p>
          <p><strong>Requested Time:</strong> ${new Date(appointment.date_time).toLocaleString()}</p>
          <p>Please visit our website to book a different time, or call us at (555) 123-4567.</p>
          <p>We apologize for any inconvenience.</p>
          <p>Best regards,<br>Dr. Ilan Ofeck's Dental Clinic</p>
        `,
      })

      // Update Telegram message
      await editMessage(chatId, messageId, `❌ *Declined*\n\nAppointment for ${appointment.patient_name} has been declined.`)
    }

    // Answer callback query to remove loading state
    const botToken = process.env.TELEGRAM_BOT_TOKEN
    if (botToken) {
      await fetch(`${TELEGRAM_API}${botToken}/answerCallbackQuery`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          callback_query_id: update.callback_query.id,
        }),
      })
    }
  }
}
