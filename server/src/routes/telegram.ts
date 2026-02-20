import { Router } from 'express'
import { handleTelegramWebhook } from '../services/telegram.js'

const router = Router()

// Telegram webhook endpoint
router.post('/webhook', async (req, res) => {
  try {
    await handleTelegramWebhook(req.body)
    res.json({ ok: true })
  } catch (error) {
    console.error('Telegram webhook error:', error)
    res.status(500).json({ error: 'Failed to process webhook' })
  }
})

export default router
