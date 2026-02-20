import { useEffect, useRef } from 'react'
import { Message } from '@ai-sdk/react'
import { cn } from '../../lib/utils'
import { Bot, User, Loader2, Brain } from 'lucide-react'
import { TOOL_ICONS } from '@/constants'
import type { ToolName } from '@/types/chat'

interface ChatMessagesProps {
  messages: Message[]
  isLoading: boolean
}

export default function ChatMessages({ messages, isLoading }: ChatMessagesProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message) => (
        <div key={message.id}>
          {/* Tool invocations */}
          {message.toolInvocations?.map((tool, index) => {
            const toolName = tool.toolName as ToolName
            const toolConfig = TOOL_ICONS[toolName]
            const Icon = toolConfig?.icon || Brain
            const label = toolConfig?.label || `Using ${tool.toolName}`
            const displayLabel = tool.state === 'result' ? label : `${label}...`

            return (
              <div
                key={`${message.id}-tool-${index}`}
                className="flex items-center gap-2 text-xs text-gray-500 mb-2 ml-12"
              >
                <Icon className="w-3 h-3" />
                <span>{displayLabel}</span>
                {tool.state !== 'result' && (
                  <Loader2 className="w-3 h-3 animate-spin" />
                )}
              </div>
            )
          })}

          {/* Message content */}
          {message.content && (
            <div
              className={cn(
                'flex gap-3',
                message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
              )}
            >
              {/* Avatar */}
              <div
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0',
                  message.role === 'user'
                    ? 'bg-primary-100 text-primary-600'
                    : 'bg-clinic-teal/10 text-clinic-teal'
                )}
              >
                {message.role === 'user' ? (
                  <User className="w-4 h-4" />
                ) : (
                  <Bot className="w-4 h-4" />
                )}
              </div>

              {/* Message bubble */}
              <div
                className={cn(
                  'max-w-[80%] rounded-2xl px-4 py-2.5 text-sm',
                  message.role === 'user'
                    ? 'bg-primary-500 text-white rounded-tr-sm'
                    : 'bg-gray-100 text-gray-800 rounded-tl-sm'
                )}
              >
                <p className="whitespace-pre-wrap">{message.content}</p>
              </div>
            </div>
          )}
        </div>
      ))}

      {/* Loading indicator */}
      {isLoading && (
        <div className="flex gap-3">
          <div className="w-8 h-8 rounded-full bg-clinic-teal/10 text-clinic-teal flex items-center justify-center flex-shrink-0">
            <Bot className="w-4 h-4" />
          </div>
          <div className="bg-gray-100 rounded-2xl rounded-tl-sm px-4 py-3">
            <div className="flex gap-1">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  )
}
