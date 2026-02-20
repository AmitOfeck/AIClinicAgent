import { createContext, useContext, useState, useCallback, ReactNode } from 'react'

interface ChatContextType {
  isOpen: boolean
  isMinimized: boolean
  pendingMessage: string | null
  open: () => void
  openWithMessage: (message: string) => void
  close: () => void
  toggle: () => void
  minimize: () => void
  expand: () => void
  toggleMinimize: () => void
  clearPendingMessage: () => void
}

const ChatContext = createContext<ChatContextType | null>(null)

export function ChatProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [pendingMessage, setPendingMessage] = useState<string | null>(null)

  const open = useCallback(() => {
    setIsOpen(true)
    setIsMinimized(false)
  }, [])

  const openWithMessage = useCallback((message: string) => {
    setPendingMessage(message)
    setIsOpen(true)
    setIsMinimized(false)
  }, [])

  const close = useCallback(() => {
    setIsOpen(false)
    setIsMinimized(false)
  }, [])

  const toggle = useCallback(() => {
    setIsOpen((prev) => !prev)
    if (!isOpen) {
      setIsMinimized(false)
    }
  }, [isOpen])

  const minimize = useCallback(() => {
    setIsMinimized(true)
  }, [])

  const expand = useCallback(() => {
    setIsMinimized(false)
  }, [])

  const toggleMinimize = useCallback(() => {
    setIsMinimized((prev) => !prev)
  }, [])

  const clearPendingMessage = useCallback(() => {
    setPendingMessage(null)
  }, [])

  return (
    <ChatContext.Provider
      value={{
        isOpen,
        isMinimized,
        pendingMessage,
        open,
        openWithMessage,
        close,
        toggle,
        minimize,
        expand,
        toggleMinimize,
        clearPendingMessage,
      }}
    >
      {children}
    </ChatContext.Provider>
  )
}

export function useChatContext() {
  const context = useContext(ChatContext)
  if (!context) {
    throw new Error('useChatContext must be used within a ChatProvider')
  }
  return context
}
