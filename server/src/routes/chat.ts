import { Router } from 'express'
import { streamText } from 'ai'
import { google } from '@ai-sdk/google'
import { tools } from '../agent/tools/index.js'
import { SYSTEM_PROMPT } from '../agent/index.js'

const router = Router()

const model = google('gemini-2.5-flash-preview-05-20')

router.post('/', async (req, res) => {
  try {
    const { messages } = req.body

    const result = streamText({
      model,
      system: SYSTEM_PROMPT,
      messages,
      tools,
      maxSteps: 10,
    })

    // Stream the response
    result.pipeDataStreamToResponse(res)
  } catch (error) {
    console.error('Chat error:', error)
    res.status(500).json({ error: 'Failed to process chat request' })
  }
})

export default router
