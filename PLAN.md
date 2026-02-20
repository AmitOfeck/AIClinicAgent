# SmartClinic Agent - Implementation Plan

## Timeline: 1.5 Days

---

## Phase 1: Foundation (COMPLETED ✅)

### 1.1 Project Setup
- [x] Initialize monorepo structure (`server/` + `client/`)
- [x] Configure TypeScript for both packages
- [x] Set up Express backend with routing
- [x] Set up React + Vite + Tailwind frontend
- [x] Create root package.json with dev scripts
- [x] Create .env.example with all required variables

### 1.2 Database Layer
- [x] SQLite connection with better-sqlite3
- [x] Appointments table (id, patient info, service, datetime, status)
- [x] Patient preferences table (for long-term memory)
- [x] CRUD operations for appointments
- [x] CRUD operations for patient preferences

### 1.3 Basic Infrastructure
- [x] Health check endpoint (`/api/health`)
- [x] CORS configuration
- [x] Vite proxy to backend (`/api` → `localhost:3001`)

---

## Phase 2: AI Agent Core (COMPLETED ✅)

### 2.1 Agent Configuration
- [x] System prompt with clinic context, rules, and services
- [x] Gemini 2.5 Flash model configuration via `@ai-sdk/google`
- [x] `maxSteps: 10` for multi-step reasoning (ReAct pattern)

### 2.2 Tool Definitions
- [x] `checkAvailability` - Query available slots for a date
- [x] `createAppointment` - Create pending appointment + notify owner
- [x] `searchKnowledgeBase` - Search clinic info (Agentic RAG)
- [x] `getPatientHistory` - Retrieve returning patient data (Long-term Memory)
- [x] `savePatientPreference` - Store patient preferences

### 2.3 Chat API
- [x] POST `/api/chat` route with streaming response
- [x] Integration with Vercel AI SDK `streamText`
- [x] Error handling and fallbacks

---

## Phase 3: External Integrations (COMPLETED ✅)

### 3.1 Google Calendar Service
- [x] Calendar client initialization with service account
- [x] `checkCalendarAvailability()` - Get free slots
- [x] `createCalendarEvent()` - Create event on approval
- [x] Mock fallback when not configured
- [x] Clinic hours logic (Sun-Thu 8-5, Fri 8-1, Sat closed)

### 3.2 Telegram Bot Service
- [x] `sendOwnerNotification()` - Send appointment request with inline buttons
- [x] `handleTelegramWebhook()` - Process approve/decline callbacks
- [x] `editMessage()` - Update message after action
- [x] Webhook route (`/api/telegram/webhook`)
- [x] Console fallback when not configured

### 3.3 Email Service (Resend)
- [x] `sendEmail()` - Generic email sending
- [x] Approval email template
- [x] Decline email template
- [x] Console fallback when not configured

### 3.4 Knowledge Base
- [x] `clinic-knowledge.json` with services, pricing, hours, team, FAQs
- [x] `searchKnowledge()` - Keyword-based search
- [x] Default fallback data

---

## Phase 4: Frontend (COMPLETED ✅)

### 4.1 Layout Components
- [x] Navbar with logo and navigation
- [x] Footer with contact info and hours

### 4.2 Pages
- [x] Home - Hero, features, services preview, CTA
- [x] Services - Full service list with pricing
- [x] About - Team bios, stats, contact info

### 4.3 Chat Widget
- [x] Floating chat bubble (bottom-right)
- [x] Chat window with minimize/close
- [x] Message list with user/assistant distinction
- [x] Tool invocation visualization (shows "Checking availability...")
- [x] Input field with send button
- [x] Loading indicator (typing dots)
- [x] `useChat` hook integration

---

## Phase 5: Testing & Polish (IN PROGRESS 🔄)

### 5.1 End-to-End Testing
- [ ] Test chat without API key (should show error gracefully)
- [ ] Test chat with Gemini API key
- [ ] Test appointment booking flow
- [ ] Test self-correction (try booking a taken slot)
- [ ] Test knowledge base queries ("What are your prices?")
- [ ] Test patient memory ("I prefer morning appointments")

### 5.2 Telegram Integration Testing
- [ ] Create Telegram bot via @BotFather
- [ ] Configure webhook URL (use ngrok for local dev)
- [ ] Test owner notification
- [ ] Test approve/decline flow
- [ ] Verify email sending on approval

### 5.3 UI Polish
- [ ] Fix any styling issues
- [ ] Test responsive design (mobile)
- [ ] Add loading states where needed
- [ ] Improve error messages

### 5.4 Edge Cases & Error Handling
- [ ] Handle API rate limits gracefully
- [ ] Handle network errors
- [ ] Validate user inputs (email format, date validity)
- [ ] Handle calendar conflicts

---

## Phase 6: Deployment (PENDING ⏳)

### 6.1 Backend Deployment (Railway/Render)
- [ ] Create account and project
- [ ] Configure environment variables
- [ ] Deploy server
- [ ] Verify health check

### 6.2 Frontend Deployment (Vercel)
- [ ] Create Vercel project
- [ ] Configure API proxy to backend
- [ ] Deploy client
- [ ] Verify all pages load

### 6.3 Production Configuration
- [ ] Set Telegram webhook to production URL
- [ ] Update CORS for production domain
- [ ] Test full flow in production

---

## Phase 7: Demo Recording (PENDING ⏳)

### 7.1 Demo Script
1. Show clinic website (homepage, services, about)
2. Open chat widget
3. Ask about services/pricing → Agent uses `searchKnowledgeBase`
4. Request appointment → Agent uses `checkAvailability`
5. Select slot and provide details → Agent uses `createAppointment`
6. Show Telegram notification arriving
7. Tap Approve in Telegram
8. Show confirmation (email + updated chat)
9. Demonstrate self-correction (try taken slot)
10. Show tool invocations in chat UI

### 7.2 Recording
- [ ] Set up screen recording
- [ ] Record demo walkthrough
- [ ] Add voiceover/captions if needed
- [ ] Upload and link in README

---

## Current Status Summary

| Phase | Status | Progress |
|-------|--------|----------|
| Phase 1: Foundation | ✅ Complete | 100% |
| Phase 2: AI Agent Core | ✅ Complete | 100% |
| Phase 3: External Integrations | ✅ Complete | 100% |
| Phase 4: Frontend | ✅ Complete | 100% |
| Phase 5: Testing & Polish | 🔄 In Progress | 20% |
| Phase 6: Deployment | ⏳ Pending | 0% |
| Phase 7: Demo Recording | ⏳ Pending | 0% |

---

## Immediate Next Steps

1. **Add Gemini API Key** → Required to test chat
2. **Test Chat Flow** → Verify booking works end-to-end
3. **Set Up Telegram Bot** → For owner approval flow
4. **Fix Any Bugs** → Address issues found during testing
5. **Deploy** → Get it live
6. **Record Demo** → Final deliverable

---

## Environment Variables Checklist

```env
# ✅ Required for chat to work
GOOGLE_GENERATIVE_AI_API_KEY=

# 📅 Optional - falls back to mock slots
GOOGLE_CALENDAR_ID=
GOOGLE_SERVICE_ACCOUNT_KEY=

# 📱 Optional - logs to console if not set
TELEGRAM_BOT_TOKEN=
TELEGRAM_OWNER_CHAT_ID=

# 📧 Optional - logs to console if not set
RESEND_API_KEY=

# 🔧 App config
PORT=3001
CLIENT_URL=http://localhost:5173
APP_URL=http://localhost:3001
```

---

## File Structure Reference

```
AIClinicAgent/
├── server/
│   ├── src/
│   │   ├── index.ts                 # Express app entry
│   │   ├── routes/
│   │   │   ├── chat.ts              # AI chat endpoint
│   │   │   └── telegram.ts          # Telegram webhook
│   │   ├── agent/
│   │   │   ├── index.ts             # System prompt
│   │   │   └── tools/index.ts       # 5 agent tools
│   │   ├── services/
│   │   │   ├── calendar.ts          # Google Calendar
│   │   │   ├── telegram.ts          # Telegram Bot
│   │   │   ├── email.ts             # Resend
│   │   │   └── knowledge.ts         # Knowledge base
│   │   ├── db/
│   │   │   ├── index.ts             # SQLite setup
│   │   │   ├── appointments.ts      # Appointment CRUD
│   │   │   └── patients.ts          # Patient CRUD
│   │   └── data/
│   │       └── clinic-knowledge.json
│   ├── data/                        # SQLite DB location
│   ├── .env                         # Environment variables
│   └── package.json
│
├── client/
│   ├── src/
│   │   ├── App.tsx                  # Router setup
│   │   ├── main.tsx                 # Entry point
│   │   ├── pages/
│   │   │   ├── Home.tsx
│   │   │   ├── Services.tsx
│   │   │   └── About.tsx
│   │   ├── components/
│   │   │   ├── chat/
│   │   │   │   ├── ChatWidget.tsx   # Main widget
│   │   │   │   ├── ChatMessages.tsx # Message list
│   │   │   │   └── ChatInput.tsx    # Input field
│   │   │   └── clinic/
│   │   │       ├── Navbar.tsx
│   │   │       └── Footer.tsx
│   │   └── lib/utils.ts             # Utilities (cn)
│   ├── index.html
│   └── package.json
│
├── package.json                     # Root scripts
├── README.md                        # Documentation
└── PLAN.md                          # This file
```
