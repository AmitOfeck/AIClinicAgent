# SmartClinic Agent - Project Tasks

## Current Status: Agent Robustness Complete - Ready for E2E Testing

---

## Connection Status

| Component | Status | Notes |
|-----------|--------|-------|
| SQLite DB | ✅ Real | Staff, services, appointments, patients |
| Gemini AI | ✅ Real | Paid API (gemini-2.5-flash) |
| Telegram Bot | ✅ Real | Notifications + approve/decline |
| Google Calendar | 🔶 Mocked | Returns mock slots (with retry) |
| Email (Resend) | 🔶 Mocked | Logs to console (with retry) |

---

## Completed Tasks

### Phase 5: Agent Robustness Upgrade ✅ (Latest)

#### Task 1: Structured Error Types ✅
- [x] Added `ToolError` interface with `errorType`, `message`, `suggestion`, `retryable`
- [x] All tools return structured errors for AI self-correction
- [x] Error types: `NOT_FOUND`, `NO_SLOTS`, `STAFF_NOT_WORKING`, `VALIDATION_ERROR`, `API_ERROR`, `DATABASE_ERROR`

#### Task 2: Retry Logic for External APIs ✅
- [x] Created `utils/retry.ts` with exponential backoff
- [x] `withRetry()` - configurable retries with delay
- [x] `checkServiceConfig()` - validates env vars before API calls
- [x] Applied to: Google Calendar, Resend Email, Telegram

#### Task 3: Silent Success Fixes ✅
- [x] Calendar: Returns `{ slots, fromCalendar: boolean, error? }`
- [x] Email: Returns `{ success, sent: boolean, error? }`
- [x] Calendar Event: Returns `{ success, created: boolean, eventId?, error? }`
- [x] Agent now knows when services are mocked vs real

#### Task 4: Proactive Patient Recognition ✅
- [x] System prompt updated with "Proactive Patient Recognition" section
- [x] Agent calls `getPatientHistory` immediately when email is provided
- [x] Returning patients get personalized greetings
- [x] Booking flow updated: collect email first, then check history

#### Task 5: RAG Decision Triggers ✅
- [x] Added "Knowledge Base Usage (RAG Triggers)" section to system prompt
- [x] Agent searches knowledge base for: pricing, insurance, emergency, preparation, policies, location
- [x] Rule: "Search FIRST, then answer"

#### Task 6: Agent Step Tracing ✅
- [x] Added `AgentStep` and `AgentTrace` interfaces
- [x] `onStepFinish` callback logs tool calls/results/text
- [x] `onFinish` callback logs completion stats
- [x] Console shows: `[Step N] Tool call: toolName`

#### Task 7: Step Metadata Endpoint ✅
- [x] `GET /api/chat/trace` returns last agent trace
- [x] Returns: `{ steps, totalSteps, toolsUsed }`
- [x] Useful for debugging and UI visualization

#### Task 8: Calendar Duration Fix ✅
- [x] Fixed calendar events to use service duration from DB
- [x] Root Canal now blocks 90 min (not default 30)
- [x] Lookup via `service_id` or fallback to `service` name

---

### Phase 1: UI Updates ✅
- [x] Update Services.tsx with 10 real services + categories
- [x] Update About.tsx with 6 real staff members
- [x] Update Home.tsx with clinic branding and info
- [x] Fix all "Opek" → "Ofeck" throughout codebase
- [x] Update phone (03-5467032) and address (Basel 35, Tel Aviv)
- [x] Create SPEC.md project specification
- [x] Update Navbar, Footer, ChatWidget with correct names

### Phase 0: Foundation ✅
- [x] Project setup (monorepo: server + client)
- [x] Staff-based booking logic
- [x] Database schema with staff/services relationships
- [x] 8 agent tools with Zod schemas
- [x] System prompt with clinic info
- [x] Telegram notifications with approve/decline buttons
- [x] Chat endpoint with streaming

---

## Pending Tasks

### Phase 6: End-to-End Testing (Next)
- [ ] Test chat without API key (graceful error)
- [ ] Test complete booking flow in browser
- [ ] Test self-correction (book taken slot → suggest alternatives)
- [ ] Test knowledge base queries ("What are your prices?")
- [ ] Test patient memory ("I prefer morning appointments")
- [ ] Test Telegram approve flow → email + calendar event
- [ ] Test Telegram decline flow → rejection email
- [ ] Verify staff images display correctly
- [ ] Test different services route to correct specialist

### Phase 7: Google Calendar Integration
- [ ] Set up Google Cloud project
- [ ] Create service account with Calendar API access
- [ ] Share clinic calendar with service account email
- [ ] Add credentials to environment variables
- [ ] Test real availability checking
- [ ] Test calendar event creation on approval

### Phase 8: Email Integration
- [ ] Set up Resend account
- [ ] Verify domain for sending
- [ ] Add RESEND_API_KEY to environment
- [ ] Test confirmation emails
- [ ] Test decline emails

### Phase 9: Deployment
- [ ] Deploy client to Vercel
- [ ] Deploy server to Railway/Render
- [ ] Configure production environment variables
- [ ] Set Telegram webhook to production URL
- [ ] Update CORS for production domain
- [ ] Final production testing

### Phase 10: Demo & Documentation
- [ ] Record demo video showing:
  - Website tour (home, services, about)
  - Booking flow with tool visualization
  - Telegram approve/decline
  - Self-correction behavior
  - Knowledge base queries
- [ ] Add demo link to README

---

## Key Files Reference

### Agent Core
```
server/src/agent/index.ts          # System prompt (with RAG triggers)
server/src/agent/tools/index.ts    # 8 tools with structured errors
```

### Database
```
server/src/db/index.ts             # Schema + seed data
server/src/db/staff.ts             # Staff queries
server/src/db/services.ts          # Services queries (with duration)
server/src/db/appointments.ts      # Appointment CRUD
server/src/db/patients.ts          # Patient preferences
```

### Services (with retry logic)
```
server/src/services/telegram.ts    # Notifications + webhook handler
server/src/services/calendar.ts    # Availability + event creation
server/src/services/email.ts       # Confirmation/decline emails
server/src/services/knowledge.ts   # RAG knowledge base
server/src/utils/retry.ts          # Exponential backoff utility
```

### Routes
```
server/src/routes/chat.ts          # AI chat (streaming + tracing)
server/src/routes/telegram.ts      # Webhook endpoint
```

### Client Images
```
client/public/images/staff/
├── dr-ilan-ofeck.jpg
├── katy-fridman.jpg
├── dr-sahar-nadel.jpg
├── dr-maayan-granit.jpg
├── dr-dan-zitoni.jpg
└── shir-formoza.jpg
```

---

## Quick Commands

```bash
# Run locally
cd server && npm run dev    # Backend on :3001
cd client && npm run dev    # Frontend on :5173

# Build
cd server && npm run build
cd client && npm run build

# Type check
cd server && npx tsc --noEmit
cd client && npx tsc --noEmit
```

---

## Environment Variables

```env
# Required
GOOGLE_GENERATIVE_AI_API_KEY=xxx

# Telegram (required for notifications)
TELEGRAM_BOT_TOKEN=xxx
TELEGRAM_OWNER_CHAT_ID=xxx

# Optional (falls back to mock)
GOOGLE_SERVICE_ACCOUNT_KEY={"type":"service_account",...}
GOOGLE_CALENDAR_ID=xxx
RESEND_API_KEY=xxx

# App config
PORT=3001
CLIENT_URL=http://localhost:5173
APP_URL=http://localhost:3001
```
