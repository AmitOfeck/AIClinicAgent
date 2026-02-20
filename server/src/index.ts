import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import chatRouter from './routes/chat.js'
import telegramRouter from './routes/telegram.js'
import testChatRouter from './routes/test-chat.js'
import { initDatabase } from './db/index.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}))
app.use(express.json())

// Initialize database
initDatabase()

// Routes
app.use('/api/chat', chatRouter)
app.use('/api/telegram', telegramRouter)
app.use('/api/test-chat', testChatRouter)

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
