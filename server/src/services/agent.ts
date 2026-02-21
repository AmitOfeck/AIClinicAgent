import { streamText, generateText, CoreMessage } from 'ai'
import { google } from '@ai-sdk/google'
import { tools } from '../agent/tools/index.js'
import { getSystemPrompt } from '../agent/index.js'

// Model configuration - single source of truth
const model = google('gemini-2.5-flash')
const maxSteps = 10

// Step trace types for debugging and UI visibility
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
  finalResponse?: string
}

// Callback type for step tracing
export type OnStepCallback = (step: AgentStep) => void
export type OnFinishCallback = (trace: AgentTrace) => void

export interface StreamChatOptions {
  onStep?: OnStepCallback
  onFinish?: OnFinishCallback
}

export interface GenerateChatResult {
  text: string
  trace: AgentTrace
}

/**
 * Stream chat response - for Web (SSE streaming)
 *
 * Use this for the web chat widget where you want real-time streaming.
 * Returns a stream that can be piped to an HTTP response.
 *
 * @example
 * const result = await streamChat(messages, { onStep, onFinish })
 * result.pipeDataStreamToResponse(res)
 */
export async function streamChat(
  messages: CoreMessage[],
  options: StreamChatOptions = {}
) {
  const { onStep, onFinish } = options

  // Initialize trace
  const trace: AgentTrace = {
    steps: [],
    totalSteps: 0,
    toolsUsed: [],
  }

  const result = streamText({
    model,
    system: getSystemPrompt(),
    messages,
    tools,
    maxSteps,
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
          onStep?.(step)
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
          onStep?.(step)
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
        onStep?.(step)
        console.log(`[Step ${trace.totalSteps}] Text generated: ${text.slice(0, 100)}...`)
      }
    },
    onFinish: ({ usage, finishReason, text }) => {
      console.log(`[Agent finished] Reason: ${finishReason}, Steps: ${trace.totalSteps}, Tools: [${trace.toolsUsed.join(', ')}]`)
      if (usage) {
        console.log(`[Token usage] Prompt: ${usage.promptTokens}, Completion: ${usage.completionTokens}`)
      }
      trace.finalResponse = text
      onFinish?.(trace)
    },
    onError: (error) => {
      console.error('Stream error:', error)
    },
  })

  return result
}

/**
 * Generate chat response - for WhatsApp/Telegram/other channels (non-streaming)
 *
 * Use this for channels that don't support streaming and need a complete
 * text response. The agent will still use tools and multi-step reasoning.
 *
 * @example
 * const { text, trace } = await generateChat(messages)
 * await sendWhatsAppMessage(phoneNumber, text)
 */
export async function generateChat(
  messages: CoreMessage[]
): Promise<GenerateChatResult> {
  // Initialize trace
  const trace: AgentTrace = {
    steps: [],
    totalSteps: 0,
    toolsUsed: [],
  }

  const result = await generateText({
    model,
    system: getSystemPrompt(),
    messages,
    tools,
    maxSteps,
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
  })

  console.log(`[Agent finished] Steps: ${trace.totalSteps}, Tools: [${trace.toolsUsed.join(', ')}]`)

  return {
    text: result.text,
    trace,
  }
}
