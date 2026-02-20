# SmartClinic Agent - Implementation Plan

## Project Overview

AI-powered dental clinic booking assistant for **Dr. Ilan Ofeck's Dental Clinic** in Tel Aviv. Uses agentic AI with ReAct pattern, human-in-the-loop approval via Telegram, and production-grade error handling.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         React Frontend                               │
│  ┌──────────────────┐  ┌─────────────────────────────────────────┐  │
│  │  Clinic Website  │  │         Chat Widget (@ai-sdk/react)     │  │
│  │  - Home          │  │  useChat() ←→ /api/chat (SSE streaming) │  │
│  │  - Services      │  │  Tool invocation visualization          │  │
│  │  - About         │  └─────────────────────────────────────────┘  │
│  └──────────────────┘                                                │
└─────────────────────────────────┬────────────────────────────────────┘
                                  │
                       ┌──────────▼──────────┐
                       │   Express Backend    │
                       │                      │
                       │  ┌────────────────┐  │
                       │  │  ReAct Agent   │  │
                       │  │  (Gemini 2.5)  │  │
                       │  │  maxSteps: 10  │  │
                       │  └───────┬────────┘  │
                       │          │           │
                       │  ┌───────▼────────┐  │
                       │  │  8 Agent Tools │  │
                       │  │  + Step Trace  │  │
                       │  └───────┬────────┘  │
                       │          │           │
                       │  ┌───────▼────────┐  │
                       │  │ Retry + Error  │  │
                       │  │   Handling     │  │
                       │  └────────────────┘  │
                       └──────────┬───────────┘
                                  │
        ┌─────────────────────────┼─────────────────────────────┐
        │                         │                             │
        ▼                         ▼                             ▼
┌───────────────┐       ┌───────────────┐           ┌───────────────┐
│    SQLite     │       │   Telegram    │           │    Resend     │
│   Database    │       │   Bot API     │           │    Email      │
│  (real data)  │       │  (real API)   │           │  (mocked)     │
└───────────────┘       └───────┬───────┘           └───────────────┘
                                │
                                ▼
                        ┌───────────────┐
                        │ Google        │
                        │ Calendar      │
                        │ (mocked)      │
                        └───────────────┘
```

---

## Phase Progress

| Phase | Status | Description |
|-------|--------|-------------|
| Phase 0: Foundation | ✅ Complete | Project setup, DB, agent, tools |
| Phase 1: UI Updates | ✅ Complete | Clinic branding, staff, services |
| Phase 5: Robustness | ✅ Complete | Error types, retry, tracing |
| Phase 6: E2E Testing | 🔄 Next | Full booking flow testing |
| Phase 7: Calendar | ⏳ Pending | Real Google Calendar |
| Phase 8: Email | ⏳ Pending | Real Resend integration |
| Phase 9: Deployment | ⏳ Pending | Vercel + Railway |
| Phase 10: Demo | ⏳ Pending | Video recording |

---

## Phase 0: Foundation ✅

### Project Setup
- [x] Monorepo structure (`server/` + `client/`)
- [x] TypeScript configuration
- [x] Express backend with routing
- [x] React + Vite + Tailwind frontend
- [x] Root package.json with dev scripts

### Database Layer (SQLite)
- [x] `staff` - 6 team members with working hours
- [x] `services` - 10 treatments with durations
- [x] `staff_services` - Many-to-many relationship
- [x] `appointments` - Bookings with status
- [x] `patient_preferences` - Long-term memory
- [x] `conversations` - Chat history

### Agent Configuration
- [x] System prompt with clinic context
- [x] Gemini 2.5 Flash model
- [x] `maxSteps: 10` for multi-step reasoning
- [x] 8 tools with Zod schemas

---

## Phase 1: UI Updates ✅

### Frontend Pages
- [x] Home - Hero, features, services preview
- [x] Services - 10 treatments by category
- [x] About - 6 staff members with bios
- [x] Navbar + Footer with contact info

### Chat Widget
- [x] Floating bubble (bottom-right)
- [x] Message list with user/assistant styling
- [x] Tool invocation visualization
- [x] Loading indicator (typing dots)
- [x] `useChat` hook integration

---

## Phase 5: Agent Robustness ✅ (Latest)

### Structured Error Types
- [x] `ToolError` interface: `{ errorType, message, suggestion, retryable }`
- [x] Error types: `NOT_FOUND`, `NO_SLOTS`, `STAFF_NOT_WORKING`, `VALIDATION_ERROR`, `API_ERROR`, `DATABASE_ERROR`
- [x] All 8 tools return structured errors

### Retry Logic
- [x] `utils/retry.ts` with exponential backoff
- [x] `withRetry(fn, options)` - configurable max retries
- [x] `checkServiceConfig(keys)` - validates env vars
- [x] Applied to: Calendar, Email, Telegram

### Silent Success Fixes
- [x] Calendar: `{ slots, fromCalendar: boolean }`
- [x] Email: `{ success, sent: boolean }`
- [x] Calendar Event: `{ success, created: boolean }`

### Proactive Patient Recognition
- [x] System prompt section added
- [x] Agent calls `getPatientHistory` on email receipt
- [x] Returning patients get personalized greetings

### RAG Decision Triggers
- [x] Knowledge base triggers for pricing, insurance, policies
- [x] Rule: "Search FIRST, then answer"

### Agent Step Tracing
- [x] `AgentStep` interface for logging
- [x] `onStepFinish` callback in streamText
- [x] `GET /api/chat/trace` endpoint
- [x] Console logging: `[Step N] Tool call: name`

### Calendar Duration Fix
- [x] Lookup service duration from DB
- [x] Pass correct duration to `createCalendarEvent`

---

## Phase 6: E2E Testing (Next)

### Test Scenarios
- [ ] Chat without API key → graceful error
- [ ] Complete booking flow → pending appointment
- [ ] Self-correction → alternative slots
- [ ] Knowledge queries → RAG response
- [ ] Patient memory → preference storage
- [ ] Telegram approve → email + calendar
- [ ] Telegram decline → rejection email
- [ ] Service routing → correct specialist

---

## Phase 7-10: Future Phases

### Phase 7: Google Calendar
- [ ] Google Cloud project setup
- [ ] Service account creation
- [ ] Calendar sharing
- [ ] Real availability checking

### Phase 8: Email (Resend)
- [ ] Account setup
- [ ] Domain verification
- [ ] Real email sending

### Phase 9: Deployment
- [ ] Frontend → Vercel
- [ ] Backend → Railway/Render
- [ ] Environment configuration
- [ ] Telegram webhook URL

### Phase 10: Demo
- [ ] Screen recording
- [ ] Voiceover/captions
- [ ] README link

---

## File Structure

```
AIClinicAgent/
├── server/
│   ├── src/
│   │   ├── index.ts                 # Express entry point
│   │   ├── routes/
│   │   │   ├── chat.ts              # AI chat + tracing
│   │   │   └── telegram.ts          # Webhook handler
│   │   ├── agent/
│   │   │   ├── index.ts             # System prompt
│   │   │   └── tools/index.ts       # 8 tools
│   │   ├── services/
│   │   │   ├── calendar.ts          # Google Calendar (retry)
│   │   │   ├── telegram.ts          # Bot + notifications
│   │   │   ├── email.ts             # Resend (retry)
│   │   │   └── knowledge.ts         # RAG search
│   │   ├── db/
│   │   │   ├── index.ts             # SQLite setup + seed
│   │   │   ├── staff.ts             # Staff queries
│   │   │   ├── services.ts          # Service queries
│   │   │   ├── appointments.ts      # Appointment CRUD
│   │   │   └── patients.ts          # Patient preferences
│   │   ├── utils/
│   │   │   └── retry.ts             # Exponential backoff
│   │   └── data/
│   │       └── clinic-knowledge.json
│   ├── data/                        # SQLite DB file
│   └── .env
│
├── client/
│   ├── src/
│   │   ├── App.tsx
│   │   ├── pages/
│   │   │   ├── Home.tsx
│   │   │   ├── Services.tsx
│   │   │   └── About.tsx
│   │   └── components/
│   │       ├── chat/
│   │       │   ├── ChatWidget.tsx
│   │       │   ├── ChatMessages.tsx
│   │       │   └── ChatInput.tsx
│   │       └── clinic/
│   │           ├── Navbar.tsx
│   │           └── Footer.tsx
│   └── public/images/staff/
│
├── PLAN.md          # This file
├── SPEC.md          # Technical specification
├── TASKS.md         # Task tracker
├── STANDARDS.md     # Code conventions
└── README.md        # Project overview
```

---

## Environment Variables

```env
# Required for AI chat
GOOGLE_GENERATIVE_AI_API_KEY=your_key

# Required for Telegram notifications
TELEGRAM_BOT_TOKEN=your_token
TELEGRAM_OWNER_CHAT_ID=your_chat_id

# Optional - falls back to mock
GOOGLE_CALENDAR_ID=your_calendar
GOOGLE_SERVICE_ACCOUNT_KEY={"type":"service_account",...}
RESEND_API_KEY=your_key

# Server config
PORT=3001
CLIENT_URL=http://localhost:5173
APP_URL=http://localhost:3001
```

---

## Agent Tools Summary

| Tool | Purpose | Returns |
|------|---------|---------|
| `getServices` | List all dental services | Service[] |
| `getStaffForService` | Find specialists for treatment | Staff[] + schedules |
| `checkAvailability` | Check staff schedule for date | Slots[] or error |
| `createAppointment` | Book pending appointment | Appointment + Telegram |
| `getClinicTeam` | Get team information | Staff[] |
| `searchKnowledgeBase` | RAG search clinic info | Results[] |
| `getPatientHistory` | Lookup returning patients | Appointments + prefs |
| `savePatientPreference` | Store patient preferences | Confirmation |

---

## Success Metrics

- [x] Agent uses tools correctly (not hallucinating data)
- [x] Self-corrects on errors (suggests alternatives)
- [x] Recognizes returning patients
- [x] Uses RAG for pricing/policy questions
- [x] Step tracing works in console
- [ ] Full booking flow completes
- [ ] Telegram approve creates calendar event
- [ ] Email confirmations send correctly
