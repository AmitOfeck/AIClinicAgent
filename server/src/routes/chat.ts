import { Router } from 'express'
import { streamChat, AgentTrace } from '../services/agent.js'
import {
  getOrCreateSession,
  getSessionMessages,
  addMessage,
} from '../db/conversations.js'

const router = Router()

// Store last trace for debugging endpoint
let lastTrace: AgentTrace | null = null

router.post('/', async (req, res) => {
  try {
    const { messages, sessionId } = req.body

    console.log('Chat request received:', JSON.stringify(messages).slice(0, 200))

    // Save the latest user message if sessionId is provided
    if (sessionId && messages.length > 0) {
      const latestMessage = messages[messages.length - 1]
      if (latestMessage.role === 'user') {
        getOrCreateSession(sessionId)
        addMessage(sessionId, 'user', latestMessage.content)
      }
    }

    // Use the agent service for streaming
    const result = await streamChat(messages, {
      onFinish: (trace) => {
        lastTrace = trace

        // Save the assistant response if sessionId is provided
        if (sessionId && trace.finalResponse) {
          addMessage(sessionId, 'assistant', trace.finalResponse)
        }
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

// Endpoint to get chat history for a session
router.get('/history/:sessionId', (req, res) => {
  try {
    const { sessionId } = req.params

    // Ensure session exists (creates welcome message for new sessions)
    getOrCreateSession(sessionId)

    const messages = getSessionMessages(sessionId)

    // Transform to the format expected by the frontend
    const formattedMessages = messages.map((msg) => ({
      id: `msg-${msg.id}`,
      role: msg.role,
      content: msg.content,
      createdAt: msg.created_at,
    }))

    res.json({ messages: formattedMessages })
  } catch (error) {
    console.error('Error fetching chat history:', error)
    res.status(500).json({ error: 'Failed to fetch chat history' })
  }
})

export default router
