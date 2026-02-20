import { Router } from 'express'
import { streamChat, AgentTrace } from '../services/agent.js'

const router = Router()

// Store last trace for debugging endpoint
let lastTrace: AgentTrace | null = null

router.post('/', async (req, res) => {
  try {
    const { messages } = req.body

    console.log('Chat request received:', JSON.stringify(messages).slice(0, 200))

    // Use the agent service for streaming
    const result = await streamChat(messages, {
      onFinish: (trace) => {
        lastTrace = trace
      },
    })

    // Stream the response to the client
    result.pipeDataStreamToResponse(res, {
      getErrorMessage: (error) => {
        console.error('Stream error:', error)
        return 'An error occurred while processing your request'
      },
    })
  } catch (error) {
    console.error('Chat error:', error)
    res.status(500).json({ error: 'Failed to process chat request' })
  }
})

// Endpoint to get the last trace (for debugging/UI)
router.get('/trace', (req, res) => {
  if (lastTrace) {
    res.json(lastTrace)
  } else {
    res.json({ steps: [], totalSteps: 0, toolsUsed: [] })
  }
})

export default router
