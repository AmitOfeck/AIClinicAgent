import { Router } from 'express'
import { streamText, ToolCallPart, ToolResultPart } from 'ai'
import { google } from '@ai-sdk/google'
import { tools } from '../agent/tools/index.js'
import { SYSTEM_PROMPT } from '../agent/index.js'

const router = Router()

// Use gemini-2.5-flash (paid tier)
const model = google('gemini-2.5-flash')

// Step trace types for UI visibility
export interface AgentStep {
  stepNumber: number
  type: 'tool-call' | 'tool-result' | 'text'
  toolName?: string
  toolArgs?: Record<string, unknown>
  toolResult?: unknown
  text?: string
  timestamp: string
}

export interface AgentTrace {
  steps: AgentStep[]
  totalSteps: number
  toolsUsed: string[]
}

router.post('/', async (req, res) => {
  try {
    const { messages } = req.body

    console.log('Chat request received:', JSON.stringify(messages).slice(0, 200))

    // Accumulate steps for tracing
    const trace: AgentTrace = {
      steps: [],
      totalSteps: 0,
      toolsUsed: [],
    }

    const result = streamText({
      model,
      system: SYSTEM_PROMPT,
      messages,
      tools,
      maxSteps: 10,
      onStepFinish: ({ stepType, toolCalls, toolResults, text }) => {
        trace.totalSteps++
        const timestamp = new Date().toISOString()

        // Log tool calls
        if (toolCalls && toolCalls.length > 0) {
          for (const toolCall of toolCalls) {
            const step: AgentStep = {
              stepNumber: trace.totalSteps,
              type: 'tool-call',
              toolName: toolCall.toolName,
              toolArgs: toolCall.args as Record<string, unknown>,
              timestamp,
            }
            trace.steps.push(step)
            if (!trace.toolsUsed.includes(toolCall.toolName)) {
              trace.toolsUsed.push(toolCall.toolName)
            }
            console.log(`[Step ${trace.totalSteps}] Tool call: ${toolCall.toolName}`, JSON.stringify(toolCall.args).slice(0, 100))
          }
        }

        // Log tool results
        if (toolResults && toolResults.length > 0) {
          for (const toolResult of toolResults) {
            const step: AgentStep = {
              stepNumber: trace.totalSteps,
              type: 'tool-result',
              toolName: toolResult.toolName,
              toolResult: toolResult.result,
              timestamp,
            }
            trace.steps.push(step)
            const resultStr = JSON.stringify(toolResult.result)
            console.log(`[Step ${trace.totalSteps}] Tool result: ${toolResult.toolName}`, resultStr.slice(0, 150))
          }
        }

        // Log text generation
        if (text) {
          const step: AgentStep = {
            stepNumber: trace.totalSteps,
            type: 'text',
            text: text.slice(0, 200),
            timestamp,
          }
          trace.steps.push(step)
          console.log(`[Step ${trace.totalSteps}] Text generated: ${text.slice(0, 100)}...`)
        }
      },
      onFinish: ({ usage, finishReason }) => {
        console.log(`[Agent finished] Reason: ${finishReason}, Steps: ${trace.totalSteps}, Tools: [${trace.toolsUsed.join(', ')}]`)
        if (usage) {
          console.log(`[Token usage] Prompt: ${usage.promptTokens}, Completion: ${usage.completionTokens}`)
        }
        // Save trace for debugging endpoint
        lastTrace = trace
      },
      onError: (error) => {
        console.error('Stream error:', error)
      },
    })

    // Stream the response with step metadata
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
let lastTrace: AgentTrace | null = null

router.get('/trace', (req, res) => {
  if (lastTrace) {
    res.json(lastTrace)
  } else {
    res.json({ steps: [], totalSteps: 0, toolsUsed: [] })
  }
})

export default router
