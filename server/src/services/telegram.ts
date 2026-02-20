import { withRetry, checkServiceConfig } from '../utils/retry.js'

const TELEGRAM_API = 'https://api.telegram.org/bot'

interface AppointmentNotification {
  appointmentId: number
  patientName: string
  patientEmail: string
  service: string
  dateTime: string
  staffName?: string
}

export interface TelegramResult {
  success: boolean
  sent: boolean  // Whether notification was actually sent (false if not configured)
  error?: string
  retryAttempts?: number
}

export async function sendOwnerNotification(data: AppointmentNotification): Promise<TelegramResult> {
  const config = checkServiceConfig(['TELEGRAM_BOT_TOKEN', 'TELEGRAM_OWNER_CHAT_ID'])

  if (!config.configured) {
    console.log('Telegram not configured, skipping notification')
    console.log('Missing:', config.missingKeys?.join(', '))
    console.log('Would send notification:', data)
    // Return sent: false to indicate notification wasn't actually sent
    return { success: true, sent: false, error: 'Telegram not configured' }
  }

  const botToken = process.env.TELEGRAM_BOT_TOKEN!
  const ownerChatId = process.env.TELEGRAM_OWNER_CHAT_ID!

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

  const result = await withRetry(async () => {
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

    const json = await response.json()
    if (!json.ok) {
      const error = new Error(`Telegram API error: ${json.description}`) as any
      error.status = json.error_code
      throw error
    }

    return json
  })

  if (!result.success) {
    console.error('Telegram notification failed after retries:', result.error)
    return {
      success: false,
      sent: false,
      error: result.error,
      retryAttempts: result.attempts,
    }
  }

  return { success: true, sent: true, retryAttempts: result.attempts }
}

export async function sendPatientNotification(
  chatId: string,
  message: string
): Promise<TelegramResult> {
  const config = checkServiceConfig(['TELEGRAM_BOT_TOKEN'])

  if (!config.configured) {
    console.log('Telegram not configured, skipping patient notification')
    return { success: true, sent: false, error: 'Telegram not configured' }
  }

  const botToken = process.env.TELEGRAM_BOT_TOKEN!

  const result = await withRetry(async () => {
    const response = await fetch(`${TELEGRAM_API}${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'Markdown',
      }),
    })

    const json = await response.json()
    if (!json.ok) {
      const error = new Error(`Telegram API error: ${json.description}`) as any
      error.status = json.error_code
      throw error
    }

    return json
  })

  if (!result.success) {
    console.error('Telegram patient notification failed:', result.error)
    return {
      success: false,
      sent: false,
      error: result.error,
      retryAttempts: result.attempts,
    }
  }

  return { success: true, sent: true, retryAttempts: result.attempts }
}

export async function editMessage(
  chatId: string,
  messageId: number,
  newText: string
): Promise<TelegramResult> {
  const config = checkServiceConfig(['TELEGRAM_BOT_TOKEN'])

  if (!config.configured) {
    return { success: true, sent: false, error: 'Telegram not configured' }
  }

  const botToken = process.env.TELEGRAM_BOT_TOKEN!

  const result = await withRetry(async () => {
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

    const json = await response.json()
    if (!json.ok) {
      const error = new Error(`Telegram API error: ${json.description}`) as any
      error.status = json.error_code
      throw error
    }

    return json
  })

  if (!result.success) {
    console.error('Telegram edit message failed:', result.error)
    return {
      success: false,
      sent: false,
      error: result.error,
      retryAttempts: result.attempts,
    }
  }

  return { success: true, sent: true, retryAttempts: result.attempts }
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
    const { getServiceById, getServiceByName } = await import('../db/services.js')
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

      // Get service duration from database
      let durationMinutes = 30 // Default fallback
      if (appointment.service_id) {
        const service = getServiceById(appointment.service_id)
        if (service) {
          durationMinutes = service.duration_minutes
        }
      } else {
        // Try to look up by service name if service_id is not set
        const service = getServiceByName(appointment.service)
        if (service) {
          durationMinutes = service.duration_minutes
        }
      }

      // Create calendar event with correct duration
      await createCalendarEvent(
        `${appointment.service} - ${appointment.patient_name}`,
        `Patient: ${appointment.patient_name}\nEmail: ${appointment.patient_email}\nPhone: ${appointment.patient_phone || 'N/A'}`,
        appointment.date_time,
        durationMinutes
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
