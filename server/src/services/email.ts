import { Resend } from 'resend'
import { withRetry, checkServiceConfig } from '../utils/retry.js'

interface EmailOptions {
  to: string
  subject: string
  html: string
}

export interface EmailResult {
  success: boolean
  sent: boolean  // Whether email was actually sent (false if not configured)
  error?: string
  retryAttempts?: number
}

export async function sendEmail(options: EmailOptions): Promise<EmailResult> {
  const config = checkServiceConfig(['RESEND_API_KEY'])

  if (!config.configured) {
    console.log('Resend not configured, skipping email')
    console.log('Would send email:', options)
    // Return sent: false to indicate email wasn't actually sent
    return { success: true, sent: false, error: 'Resend not configured' }
  }

  const apiKey = process.env.RESEND_API_KEY!
  const resend = new Resend(apiKey)

  const result = await withRetry(async () => {
    const { data, error } = await resend.emails.send({
      from: 'Dr. Ilan Ofeck Dental Clinic <appointments@resend.dev>',
      to: options.to,
      subject: options.subject,
      html: options.html,
    })

    if (error) {
      const err = new Error(`Resend API error: ${error.message}`) as any
      // Check if it's a rate limit or server error
      if (error.name === 'rate_limit_exceeded') {
        err.status = 429
      } else if (error.name === 'internal_server_error') {
        err.status = 500
      }
      throw err
    }

    return data
  })

  if (!result.success) {
    console.error('Email send failed after retries:', result.error)
    return {
      success: false,
      sent: false,
      error: result.error,
      retryAttempts: result.attempts,
    }
  }

  return { success: true, sent: true, retryAttempts: result.attempts }
}
