import { Resend } from 'resend'

interface EmailOptions {
  to: string
  subject: string
  html: string
}

export async function sendEmail(options: EmailOptions): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY

  if (!apiKey) {
    console.log('Resend not configured, skipping email')
    console.log('Would send email:', options)
    return true
  }

  try {
    const resend = new Resend(apiKey)

    const { error } = await resend.emails.send({
      from: 'Dr. Opek\'s Dental Clinic <appointments@resend.dev>',
      to: options.to,
      subject: options.subject,
      html: options.html,
    })

    if (error) {
      console.error('Resend API error:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Email send error:', error)
    return false
  }
}
