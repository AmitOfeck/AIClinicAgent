import { google } from 'googleapis'

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

export async function checkCalendarAvailability(
  date: string,
  service?: string
): Promise<string[]> {
  const duration = service ? SERVICE_DURATIONS[service] || 30 : 30
  const dateObj = new Date(date)
  const dayOfWeek = dateObj.getDay()
  const hours = CLINIC_HOURS[dayOfWeek]

  if (!hours) {
    return [] // Clinic is closed
  }

  // If Google Calendar is not configured, return mock slots
  if (!process.env.GOOGLE_SERVICE_ACCOUNT_KEY || !process.env.GOOGLE_CALENDAR_ID) {
    console.log('Google Calendar not configured, returning mock slots')
    return generateMockSlots(date, hours, duration)
  }

  try {
    const calendar = getCalendarClient()
    const calendarId = process.env.GOOGLE_CALENDAR_ID

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
  } catch (error) {
    console.error('Google Calendar API error:', error)
    // Fallback to mock slots if API fails
    return generateMockSlots(date, hours, duration)
  }
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

export async function createCalendarEvent(
  summary: string,
  description: string,
  dateTime: string,
  duration: number = 30
): Promise<{ success: boolean; eventId?: string; error?: string }> {
  if (!process.env.GOOGLE_SERVICE_ACCOUNT_KEY || !process.env.GOOGLE_CALENDAR_ID) {
    console.log('Google Calendar not configured, skipping event creation')
    return { success: true, eventId: 'mock-event-id' }
  }

  try {
    const calendar = getCalendarClient()
    const calendarId = process.env.GOOGLE_CALENDAR_ID

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

    return { success: true, eventId: response.data.id || undefined }
  } catch (error) {
    console.error('Create calendar event error:', error)
    return { success: false, error: 'Failed to create calendar event' }
  }
}
