import { Router } from 'express'
import { generateText } from 'ai'
import { google } from '@ai-sdk/google'
import { checkCalendarAvailability, createCalendarEvent } from '../services/calendar'

const router = Router()

const model = google('gemini-2.5-flash')

router.post('/', async (req, res) => {
  try {
    const { messages } = req.body

    console.log('Test chat request:', messages)

    const result = await generateText({
      model,
      messages,
    })

    console.log('Test chat result:', result.text)
    res.json({ text: result.text })
  } catch (error: any) {
    console.error('Test chat error:', error.message, error.cause || error)
    res.status(500).json({ error: error.message })
  }
})

// Test calendar availability
router.get('/calendar-test', async (req, res) => {
  try {
    // Find next Monday
    const nextMonday = new Date()
    const daysUntilMonday = (8 - nextMonday.getDay()) % 7 || 7
    nextMonday.setDate(nextMonday.getDate() + daysUntilMonday)
    const dateStr = nextMonday.toISOString().split('T')[0]

    console.log('Testing calendar for date:', dateStr)
    const slots = await checkCalendarAvailability(dateStr)

    res.json({
      success: true,
      date: dateStr,
      availableSlots: slots,
      message: 'Google Calendar API working!'
    })
  } catch (error: any) {
    console.error('Calendar test error:', error.message)
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
})

// Test creating calendar event
router.post('/calendar-create-test', async (req, res) => {
  try {
    const result = await createCalendarEvent(
      'TEST - Delete Me',
      'Test appointment - please delete',
      '2026-02-23T15:00:00',
      30
    )
    res.json(result)
  } catch (error: any) {
    console.error('Calendar create test error:', error.message)
    res.status(500).json({ success: false, error: error.message })
  }
})

export default router
