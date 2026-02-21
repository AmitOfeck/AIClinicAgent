# SmartClinic Agent - Implementation Plan

## Project Overview

AI-powered dental clinic booking assistant for **Dr. Ilan Ofeck's Dental Clinic** in Tel Aviv. Uses agentic AI with ReAct pattern, human-in-the-loop approval via Telegram, and production-grade error handling.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         React Frontend                               │
│  ┌──────────────────┐  ┌─────────────────────────────────────────┐  │
│  │  Landing Page    │  │         Chat Widget (@ai-sdk/react)     │  │
│  │  - Hero          │  │  useChat() ←→ /api/chat (SSE streaming) │  │
│  │  - Services      │  │  Tool invocation visualization          │  │
│  │  - Team/Contact  │  └─────────────────────────────────────────┘  │
│  └──────────────────┘                                                │
└─────────────────────────────────────┬────────────────────────────────┘
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
    │    SQLite     │       │   Telegram    │           │    Google     │
    │   Database    │       │   Bot API     │           │   Calendar    │
    │   (real)      │       │   (real)      │           │   (real)      │
    └───────────────┘       └───────────────┘           └───────────────┘
```

---

## Phase Progress

| Phase | Status | Description |
|-------|--------|-------------|
| Phase 0: Foundation | ✅ Complete | Project setup, DB, agent, tools |
| Phase 1: UI Updates | ✅ Complete | Clinic branding, staff, services |
| Phase 5: Robustness | ✅ Complete | Error types, retry, tracing |
| Phase 6: Frontend Refactor | ✅ Complete | Types, constants, components |
| Phase 6.5: Landing Page | ✅ Complete | Single page, mobile responsive |
| Phase 7: CVA & i18n | ✅ Complete | Component variants, translations |
| Phase 8: Google Calendar | ✅ Complete | Real calendar integration |
| Phase 9: Multi-Channel Agent | ✅ Complete | Agent service for Web + WhatsApp |
| Phase 10: E2E Testing | ⏳ Pending | Full booking flow testing |
| Phase 11: Email | ⏳ Skipped | Resend integration (optional) |
| Phase 12: Deployment | ⏳ Pending | Vercel + Railway |
| Phase 13: Demo | ⏳ Pending | Video recording |

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
- [x] `conversations` - Chat history persistence

### Agent Configuration
- [x] System prompt with clinic context (dynamic with date)
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

## Phase 5: Agent Robustness ✅

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

## Phase 6: Frontend Refactor ✅

### Foundation
- [x] Folder structure (types/, constants/, hooks/, config/, api/)
- [x] `types/clinic.ts` - Service, TeamMember, ClinicInfo, DayHours
- [x] `types/chat.ts` - ChatMessage, ToolInvocation, ToolIconMap
- [x] Constants extracted (clinic, services, team, features, chat)

### UI Component Library
- [x] `Button` component (variants, sizes, icons)
- [x] `Card` component (variants, padding, hover)
- [x] `Badge` component (colors, sizes)
- [x] `Section` component (backgrounds, padding)
- [x] `Container` component (max-widths)
- [x] `PageLayout` component (consistent page structure)

### Client Architecture
- [x] `config/env.ts` - Environment configuration
- [x] `api/apiClient.ts` - Generic API client with error handling
- [x] `api/endpoints.ts` - Centralized API endpoints
- [x] `hooks/useApi.ts` - Generic API state management
- [x] `hooks/useChatWidget.ts` - Chat UI state management
- [x] `hooks/useClinicHours.ts` - Clinic hours with "today" highlighting
- [x] `context/ChatContext.tsx` - Shared chat state

---

## Phase 6.5: Landing Page & Mobile ✅

### Single Landing Page
- [x] Consolidated Home, Services, About into single LandingPage
- [x] Section components (HeroSection, ServicesSection, TeamSection, etc.)
- [x] Scroll-to-section navigation
- [x] Service cards open chat with service name

### Mobile Responsiveness
- [x] Mobile hamburger menu in Navbar
- [x] ChatWidget full-screen on mobile
- [x] Responsive grids for all sections
- [x] Touch-friendly button sizes

### Code Cleanup
- [x] Removed unused pages (Home/, Services/, About.tsx)
- [x] Updated Footer with correct links
- [x] Clean component APIs with TypeScript interfaces

---

## Phase 7: CVA & i18n ✅

### CVA (class-variance-authority)
- [x] Installed `class-variance-authority` package
- [x] Button - converted to CVA variants/sizes
- [x] Card - converted to CVA variants/padding
- [x] Badge - converted to CVA variants/sizes

### i18n Preparation
- [x] Created `i18n/` folder structure
- [x] `i18n/types.ts` - Translation interface
- [x] `i18n/en.ts` - English translations
- [x] `i18n/he.ts` - Hebrew translations
- [x] `useTranslation` hook (simple, no library)

### Text Extraction
- [x] HeroSection - title, subtitle, badges
- [x] ServicesSection - heading, description
- [x] TeamSection - heading, description
- [x] ContactSection - all labels
- [x] CTASection - all text
- [x] WhyChooseUsSection - all text
- [x] VideoSection - all text

### Code Patterns
- [x] Array pattern for repeated components
- [x] Updated STANDARDS-FRONTEND.md with patterns

---

## Phase 8: Google Calendar Integration ✅

- [x] Integration code in `server/src/services/calendar.ts`
- [x] `checkCalendarAvailability()` - fetches busy slots from Google Calendar
- [x] `createCalendarEvent()` - creates events on approval
- [x] Retry logic with exponential backoff
- [x] Graceful fallback to mock slots when not configured
- [x] **Integrated into `checkAvailability` tool** - now checks both DB appointments AND Google Calendar

---

## Phase 9: Multi-Channel Agent Service ✅

Refactored agent logic into a reusable service layer to support multiple channels.

### Architecture

```
                    ┌─────────────────────────┐
                    │   services/agent.ts     │
                    │                         │
                    │  - model config         │
                    │  - tools                │
                    │  - system prompt        │
                    │                         │
                    │  streamChat()           │ → Web (SSE streaming)
                    │  generateChat()         │ → WhatsApp (text response)
                    └───────────┬─────────────┘
                                │
          ┌─────────────────────┼─────────────────────┐
          │                     │                     │
    routes/chat.ts      routes/whatsapp.ts     (future channels)
       (Web)              (Ready to add)
```

### Implementation
- [x] Create `services/agent.ts` - Core agent service
- [x] `streamChat(messages)` - Returns stream for web SSE
- [x] `generateChat(messages)` - Returns text for WhatsApp/other
- [x] Update `routes/chat.ts` to use service
- [x] Preserve step tracing functionality

### Benefits
- **Web chat**: Works exactly the same (streaming)
- **WhatsApp ready**: Just import `generateChat()` when needed
- **Single source of truth**: Model, tools, prompt in one place
- **Easy to extend**: Add Telegram, SMS, or other channels

---

## Phase 10: End-to-End Testing (Pending)

### Test Scenarios
- [ ] Server builds successfully
- [ ] Client builds successfully
- [ ] Chat endpoint responds
- [ ] Database operations work
- [ ] Tool invocations execute correctly
- [ ] Knowledge base queries return results
- [ ] Patient history lookup works

---

## Phase 11: Email Integration (Skipped)

Resend integration is optional - email logs to console when not configured.

- [ ] Set up Resend account
- [ ] Verify domain for sending
- [ ] Add RESEND_API_KEY to environment
- [ ] Test confirmation emails
- [ ] Test decline emails

---

## Phase 12: Deployment (Pending)

- [ ] Deploy client to Vercel
- [ ] Deploy server to Railway/Render
- [ ] Configure production environment variables
- [ ] Set Telegram webhook to production URL
- [ ] Update CORS for production domain
- [ ] Final production testing

---

## Phase 13: Demo (Pending)

- [ ] Record demo video showing:
  - Website tour (landing page sections)
  - Booking flow with tool visualization
  - Telegram approve/decline
  - Self-correction behavior
  - Knowledge base queries
- [ ] Add demo link to README

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
│   │   │   ├── index.ts             # System prompt (dynamic)
│   │   │   └── tools/index.ts       # 8 tools
│   │   ├── services/
│   │   │   ├── agent.ts             # Multi-channel agent service
│   │   │   ├── calendar.ts          # Google Calendar (retry)
│   │   │   ├── telegram.ts          # Bot + notifications
│   │   │   ├── email.ts             # Resend (retry)
│   │   │   └── knowledge.ts         # RAG search
│   │   ├── db/
│   │   │   ├── index.ts             # SQLite setup + seed
│   │   │   ├── staff.ts             # Staff queries
│   │   │   ├── services.ts          # Service queries
│   │   │   ├── appointments.ts      # Appointment CRUD
│   │   │   ├── patients.ts          # Patient preferences
│   │   │   └── conversations.ts     # Chat persistence
│   │   └── utils/
│   │       └── retry.ts             # Exponential backoff
│   ├── data/                        # SQLite DB file
│   └── .env
│
├── client/
│   ├── src/
│   │   ├── App.tsx
│   │   ├── config/env.ts            # Environment config
│   │   ├── api/                     # API client + endpoints
│   │   ├── hooks/                   # Custom hooks
│   │   ├── context/                 # ChatContext
│   │   ├── types/                   # TypeScript types
│   │   ├── constants/               # Extracted data
│   │   ├── i18n/                    # Translations (en, he)
│   │   ├── components/
│   │   │   ├── ui/                  # Button/, Card/, Badge/ (CVA)
│   │   │   ├── layout/              # Section, Container
│   │   │   ├── chat/                # ChatWidget, ChatMessages
│   │   │   └── clinic/              # Navbar, Footer
│   │   └── pages/
│   │       ├── LandingPage.tsx      # Main page
│   │       └── Landing/             # Section components
│   └── public/images/staff/
│
├── PLAN.md          # This file
├── SPEC.md          # Technical specification
├── TASKS.md         # Task tracker
├── STANDARDS.md     # Backend conventions
├── STANDARDS-FRONTEND.md  # Frontend conventions
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
| `checkAvailability` | Check staff schedule + calendar | Slots[] or error |
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
- [x] Google Calendar integrated into availability check
- [x] Frontend responsive on mobile
- [x] CVA component variants working
- [x] i18n translations ready (en + he)
- [ ] Full booking flow completes (testing)
- [ ] Deployed to production
