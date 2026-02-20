import { useEffect } from 'react'
import { MessageCircle, X, Minimize2 } from 'lucide-react'
import ChatMessages from './ChatMessages'
import ChatInput from './ChatInput'
import { useChat } from '@ai-sdk/react'
import { cn } from '../../lib/utils'
import { useChatContext } from '@/context/ChatContext'
import { API_ENDPOINTS } from '@/api'
import { WELCOME_MESSAGE } from '@/constants'

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

  const { messages, input, handleInputChange, handleSubmit, isLoading, error, append } = useChat({
    api: API_ENDPOINTS.chat,
    initialMessages: [
      {
        id: 'welcome',
        role: 'assistant',
        content: WELCOME_MESSAGE,
      },
    ],
  })

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
          className="fixed bottom-6 right-6 w-14 h-14 bg-clinic-teal hover:bg-clinic-teal-dark text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-105 z-50"
          aria-label="Open chat"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div
          className={cn(
            'fixed bottom-6 right-6 w-[380px] bg-white rounded-2xl shadow-2xl flex flex-col z-50 transition-all duration-200',
            isMinimized ? 'h-14' : 'h-[600px] max-h-[80vh]'
          )}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-clinic-teal text-white rounded-t-2xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                🦷
              </div>
              <div>
                <h3 className="font-semibold text-sm">SmartClinic Assistant</h3>
                <p className="text-xs text-white/80">Online • Ready to help</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
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
