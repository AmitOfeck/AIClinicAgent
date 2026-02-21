import { useEffect, useState, useCallback } from 'react'
import { MessageCircle, X, Minimize2, RotateCcw } from 'lucide-react'
import ChatMessages from './ChatMessages'
import ChatInput from './ChatInput'
import { useChat, Message } from '@ai-sdk/react'
import { cn } from '../../lib/utils'
import { useChatContext } from '@/context/ChatContext'
import { API_ENDPOINTS, apiClient } from '@/api'
import { WELCOME_MESSAGE } from '@/constants'
import { useChatSession } from '@/hooks'

interface HistoryMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  createdAt: string
}

export default function ChatWidget() {
  const {
    isOpen,
    isMinimized,
    pendingMessage,
    open,
    close,
    toggleMinimize,
    clearPendingMessage,
  } = useChatContext()

  const { getSessionId, clearSession } = useChatSession()
  const [sessionId, setSessionId] = useState<string>(() => getSessionId())
  const [initialMessages, setInitialMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: WELCOME_MESSAGE,
    },
  ])
  // Fetch chat history on mount
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await apiClient.get<{ messages: HistoryMessage[] }>(
          `${API_ENDPOINTS.chatHistory}/${sessionId}`
        )
        if (response.data.messages && response.data.messages.length > 0) {
          const historyMessages: Message[] = response.data.messages.map((msg) => ({
            id: msg.id,
            role: msg.role,
            content: msg.content,
          }))
          setInitialMessages(historyMessages)
        }
      } catch (error) {
        console.error('Failed to fetch chat history:', error)
      }
    }

    fetchHistory()
  }, [sessionId])

  const { messages, input, handleInputChange, handleSubmit, isLoading, error, append, setMessages } = useChat({
    api: API_ENDPOINTS.chat,
    body: { sessionId },
    initialMessages,
  })

  // Handle new chat - clear session and reset messages
  const handleNewChat = useCallback(() => {
    clearSession()
    const newSessionId = getSessionId()
    setSessionId(newSessionId)
    setMessages([
      {
        id: 'welcome',
        role: 'assistant',
        content: WELCOME_MESSAGE,
      },
    ])
  }, [clearSession, getSessionId, setMessages])

  // Auto-send pending message when chat opens
  useEffect(() => {
    if (isOpen && pendingMessage && !isLoading) {
      append({
        role: 'user',
        content: pendingMessage,
      })
      clearPendingMessage()
    }
  }, [isOpen, pendingMessage, isLoading, append, clearPendingMessage])

  return (
    <>
      {/* Chat Button */}
      {!isOpen && (
        <button
          onClick={open}
          className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 w-14 h-14 bg-clinic-teal hover:bg-clinic-teal-dark text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-105 z-50"
          aria-label="Open chat"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div
          className={cn(
            'fixed bg-white shadow-2xl flex flex-col z-50 transition-all duration-200',
            // Mobile: full screen with keyboard support
            'inset-0 chat-widget-mobile',
            // Desktop: positioned bottom-right with fixed size
            'sm:inset-auto sm:bottom-6 sm:right-6 sm:w-[380px] sm:rounded-2xl sm:h-[600px] sm:max-h-[80vh]',
            // Minimized state
            isMinimized && 'h-14 sm:h-14'
          )}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-4 sm:py-3 bg-clinic-teal text-white sm:rounded-t-2xl flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                🦷
              </div>
              <div>
                <h3 className="font-semibold text-sm">SmartClinic Assistant</h3>
                <p className="text-xs text-white/80 flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                  Online
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={handleNewChat}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                aria-label="New chat"
                title="New chat"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={toggleMinimize}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                aria-label={isMinimized ? 'Expand chat' : 'Minimize chat'}
              >
                <Minimize2 className="w-4 h-4" />
              </button>
              <button
                onClick={close}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                aria-label="Close chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Chat Content */}
          {!isMinimized && (
            <>
              <ChatMessages messages={messages} isLoading={isLoading} />
              {error && (
                <div className="px-4 py-2 bg-red-50 text-red-600 text-sm">
                  Something went wrong. Please try again.
                </div>
              )}
              <ChatInput
                input={input}
                handleInputChange={handleInputChange}
                handleSubmit={handleSubmit}
                isLoading={isLoading}
              />
            </>
          )}
        </div>
      )}
    </>
  )
}
