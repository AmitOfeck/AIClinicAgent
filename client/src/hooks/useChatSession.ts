const SESSION_STORAGE_KEY = 'clinic_chat_session_id'

export function useChatSession() {
  const getSessionId = (): string => {
    let id = localStorage.getItem(SESSION_STORAGE_KEY)
    if (!id) {
      id = crypto.randomUUID()
      localStorage.setItem(SESSION_STORAGE_KEY, id)
    }
    return id
  }

  const clearSession = (): void => {
    localStorage.removeItem(SESSION_STORAGE_KEY)
  }

  return { getSessionId, clearSession }
}
