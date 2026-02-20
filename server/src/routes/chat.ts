import { Router } from 'express'
import { streamText } from 'ai'
import { google } from '@ai-sdk/google'
import { tools } from '../agent/tools/index.js'
import { SYSTEM_PROMPT } from '../agent/index.js'

const router = Router()

// Use gemini-2.5-flash (paid tier)
const model = google('gemini-2.5-flash')

router.post('/', async (req, res) => {
  try {
    const { messages } = req.body

    console.log('Chat request received:', JSON.stringify(messages).slice(0, 200))

    const result = streamText({
      model,
      system: SYSTEM_PROMPT,
      messages,
      tools,
      maxSteps: 10,
      onError: (error) => {
        console.error('Stream error:', error)
      },
    })

    // Stream the response
    result.pipeDataStreamToResponse(res)
  } catch (error) {
    console.error('Chat error:', error)
    res.status(500).json({ error: 'Failed to process chat request' })
  }
})

export default router
