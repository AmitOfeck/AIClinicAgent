import { google } from 'googleapis'
import { withRetry, checkServiceConfig } from '../utils/retry.js'

// Service durations in minutes
const SERVICE_DURATIONS: Record<string, number> = {
  'Routine Checkup & Cleaning': 30,
  'Teeth Whitening': 60,
  'Dental Implant Consultation': 45,
  'Root Canal Treatment': 90,
  'Orthodontic Consultation': 45,
  'Emergency Dental Care': 60,
}

// Clinic hours
const CLINIC_HOURS: Record<number, { open: number; close: number } | null> = {
  0: { open: 8, close: 17 },  // Sunday
  1: { open: 8, close: 17 },  // Monday
  2: { open: 8, close: 17 },  // Tuesday
  3: { open: 8, close: 17 },  // Wednesday
  4: { open: 8, close: 17 },  // Thursday
  5: { open: 8, close: 13 },  // Friday
  6: null,                      // Saturday - closed
}

function getCalendarClient() {
  const credentials = process.env.GOOGLE_SERVICE_ACCOUNT_KEY
  if (!credentials) {
    throw new Error('Google service account key not configured')
  }

  const auth = new google.auth.GoogleAuth({
    credentials: JSON.parse(credentials),
    scopes: ['https://www.googleapis.com/auth/calendar'],
  })

  return google.calendar({ version: 'v3', auth })
}

export interface CalendarAvailabilityResult {
  slots: string[]
  fromCalendar: boolean  // True if fetched from Google Calendar, false if mock
  error?: string
}

export async function checkCalendarAvailability(
  date: string,
  service?: string
): Promise<CalendarAvailabilityResult> {
  const duration = service ? SERVICE_DURATIONS[service] || 30 : 30
  const dateObj = new Date(date)
  const dayOfWeek = dateObj.getDay()
  const hours = CLINIC_HOURS[dayOfWeek]

  if (!hours) {
    return { slots: [], fromCalendar: false, error: 'Clinic is closed on this day' }
  }

  const config = checkServiceConfig(['GOOGLE_SERVICE_ACCOUNT_KEY', 'GOOGLE_CALENDAR_ID'])

  if (!config.configured) {
    console.log('Google Calendar not configured, returning mock slots')
    console.log('Missing:', config.missingKeys?.join(', '))
    const mockSlots = generateMockSlots(date, hours, duration)
    return { slots: mockSlots, fromCalendar: false, error: 'Google Calendar not configured' }
  }

  const result = await withRetry(async () => {
    const calendar = getCalendarClient()
    const calendarId = process.env.GOOGLE_CALENDAR_ID!

    const timeMin = new Date(date)
    timeMin.setHours(hours.open, 0, 0, 0)

    const timeMax = new Date(date)
    timeMax.setHours(hours.close, 0, 0, 0)

    const response = await calendar.events.list({
      calendarId,
      timeMin: timeMin.toISOString(),
      timeMax: timeMax.toISOString(),
      singleEvents: true,
      orderBy: 'startTime',
    })

    const busySlots = (response.data.items || []).map((event) => ({
      start: new Date(event.start?.dateTime || event.start?.date || ''),
      end: new Date(event.end?.dateTime || event.end?.date || ''),
    }))

    return findAvailableSlots(date, hours, duration, busySlots)
  })

  if (!result.success) {
    console.error('Google Calendar API failed after retries:', result.error)
    // Fallback to mock slots
    const mockSlots = generateMockSlots(date, hours, duration)
    return { slots: mockSlots, fromCalendar: false, error: result.error }
  }

  return { slots: result.data!, fromCalendar: true }
}

function generateMockSlots(
  date: string,
  hours: { open: number; close: number },
  duration: number
): string[] {
  const slots: string[] = []
  const slotInterval = 30 // minutes

  for (let hour = hours.open; hour < hours.close; hour++) {
    for (let minute = 0; minute < 60; minute += slotInterval) {
      // Make sure there's enough time for the appointment
      const endMinutes = hour * 60 + minute + duration
      if (endMinutes <= hours.close * 60) {
        const timeStr = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
        slots.push(timeStr)
      }
    }
  }

  // Randomly remove some slots to simulate bookings (for demo purposes)
  const availableSlots = slots.filter(() => Math.random() > 0.3)
  return availableSlots.slice(0, 6) // Return max 6 slots
}

function findAvailableSlots(
  date: string,
  hours: { open: number; close: number },
  duration: number,
  busySlots: { start: Date; end: Date }[]
): string[] {
  const slots: string[] = []
  const slotInterval = 30

  for (let hour = hours.open; hour < hours.close; hour++) {
    for (let minute = 0; minute < 60; minute += slotInterval) {
      const slotStart = new Date(date)
      slotStart.setHours(hour, minute, 0, 0)

      const slotEnd = new Date(slotStart)
      slotEnd.setMinutes(slotEnd.getMinutes() + duration)

      // Check if slot ends before clinic closes
      if (slotEnd.getHours() > hours.close ||
          (slotEnd.getHours() === hours.close && slotEnd.getMinutes() > 0)) {
        continue
      }

      // Check if slot conflicts with any busy slot
      const hasConflict = busySlots.some(
        (busy) => slotStart < busy.end && slotEnd > busy.start
      )

      if (!hasConflict) {
        const timeStr = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
        slots.push(timeStr)
      }
    }
  }

  return slots.slice(0, 6)
}

export interface CalendarEventResult {
  success: boolean
  created: boolean  // True if event was actually created in Google Calendar
  eventId?: string
  error?: string
  retryAttempts?: number
}

export async function createCalendarEvent(
  summary: string,
  description: string,
  dateTime: string,
  duration: number = 30
): Promise<CalendarEventResult> {
  const config = checkServiceConfig(['GOOGLE_SERVICE_ACCOUNT_KEY', 'GOOGLE_CALENDAR_ID'])

  if (!config.configured) {
    console.log('Google Calendar not configured, skipping event creation')
    console.log('Missing:', config.missingKeys?.join(', '))
    // Return created: false to indicate event wasn't actually created
    return { success: true, created: false, eventId: 'mock-event-id', error: 'Google Calendar not configured' }
  }

  const result = await withRetry(async () => {
    const calendar = getCalendarClient()
    const calendarId = process.env.GOOGLE_CALENDAR_ID!

    const startTime = new Date(dateTime)
    const endTime = new Date(startTime)
    endTime.setMinutes(endTime.getMinutes() + duration)

    const response = await calendar.events.insert({
      calendarId,
      requestBody: {
        summary,
        description,
        start: { dateTime: startTime.toISOString() },
        end: { dateTime: endTime.toISOString() },
      },
    })

    return response.data.id
  })

  if (!result.success) {
    console.error('Create calendar event failed after retries:', result.error)
    return {
      success: false,
      created: false,
      error: result.error,
      retryAttempts: result.attempts,
    }
  }

  return {
    success: true,
    created: true,
    eventId: result.data || undefined,
    retryAttempts: result.attempts,
  }
}
