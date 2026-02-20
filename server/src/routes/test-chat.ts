import { Router } from 'express'
import { generateText } from 'ai'
import { google } from '@ai-sdk/google'

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

export default router
