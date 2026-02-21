import { db } from './index.js'

export const WELCOME_MESSAGE = `Hello! Welcome to Dr. Ilan Ofeck's Dental Clinic. I'm here to help you book appointments, answer questions about our services, or provide information about our clinic. How can I assist you today?`

export interface ChatSession {
  id: number
  session_id: string
  patient_email?: string
  created_at: string
  updated_at: string
}

export interface ChatMessage {
  id: number
  session_id: string
  role: string
  content: string
  created_at: string
}

export function getOrCreateSession(sessionId: string): ChatSession {
  // Try to get existing session
  const existingSession = db
    .prepare('SELECT * FROM chat_sessions WHERE session_id = ?')
    .get(sessionId) as ChatSession | undefined

  if (existingSession) {
    // Update the updated_at timestamp
    db.prepare(
      'UPDATE chat_sessions SET updated_at = CURRENT_TIMESTAMP WHERE session_id = ?'
    ).run(sessionId)
    return existingSession
  }

  // Create new session
  db.prepare('INSERT INTO chat_sessions (session_id) VALUES (?)').run(sessionId)

  // Add welcome message for new sessions
  db.prepare(
    'INSERT INTO chat_messages (session_id, role, content) VALUES (?, ?, ?)'
  ).run(sessionId, 'assistant', WELCOME_MESSAGE)

  return db
    .prepare('SELECT * FROM chat_sessions WHERE session_id = ?')
    .get(sessionId) as ChatSession
}

export function getSessionMessages(sessionId: string): ChatMessage[] {
  return db
    .prepare(
      'SELECT * FROM chat_messages WHERE session_id = ? ORDER BY created_at ASC'
    )
    .all(sessionId) as ChatMessage[]
}

export function addMessage(
  sessionId: string,
  role: string,
  content: string
): ChatMessage {
  // Ensure session exists
  getOrCreateSession(sessionId)

  const result = db
    .prepare(
      'INSERT INTO chat_messages (session_id, role, content) VALUES (?, ?, ?)'
    )
    .run(sessionId, role, content)

  return db
    .prepare('SELECT * FROM chat_messages WHERE id = ?')
    .get(result.lastInsertRowid) as ChatMessage
}

export function linkSessionToPatient(
  sessionId: string,
  email: string
): void {
  db.prepare(
    'UPDATE chat_sessions SET patient_email = ?, updated_at = CURRENT_TIMESTAMP WHERE session_id = ?'
  ).run(email, sessionId)
}

export function getSessionByPatientEmail(email: string): ChatSession | undefined {
  return db
    .prepare(
      'SELECT * FROM chat_sessions WHERE patient_email = ? ORDER BY updated_at DESC LIMIT 1'
    )
    .get(email) as ChatSession | undefined
}
