# SmartClinic Agent - Project Tasks

## Current Status: Frontend Standards Upgrade - CVA & i18n Prep

---

## Connection Status

| Component | Status | Notes |
|-----------|--------|-------|
| SQLite DB | ✅ Real | Staff, services, appointments, patients |
| Gemini AI | ✅ Real | Paid API (gemini-2.5-flash) |
| Telegram Bot | ✅ Real | Notifications + approve/decline |
| Google Calendar | ✅ Real | Credentials configured in server/.env |
| Email (Resend) | 🔶 Mocked | Logs to console (with retry) |

---

## Completed Tasks

### Phase 6: Frontend Refactor & Architecture ✅

#### 6.1 Foundation ✅
- [x] Create folder structure (types/, constants/, hooks/, config/, api/)
- [x] Create `types/clinic.ts` - Service, TeamMember, ClinicInfo, DayHours
- [x] Create `types/chat.ts` - ChatMessage, ToolInvocation, ToolIconMap
- [x] Create `constants/clinic.ts` - Clinic info, hours, location
- [x] Create `constants/services.ts` - Services array, category colors
- [x] Create `constants/team.ts` - Team members, stats
- [x] Create `constants/features.ts` - Homepage features
- [x] Create `constants/chat.ts` - Tool icons, welcome message

#### 6.2 UI Component Library ✅
- [x] Create `Button` component (variants, sizes, icons)
- [x] Create `Card` component (variants, padding, hover)
- [x] Create `Badge` component (colors, sizes)
- [x] Create `Section` component (backgrounds, padding)
- [x] Create `Container` component (max-widths)
- [x] Create `PageLayout` component (consistent page structure)

#### 6.3 Client Architecture ✅
- [x] Create `config/env.ts` - Environment configuration (VITE_API_BASE_URL)
- [x] Create `.env.example` - Environment template
- [x] Create `api/apiClient.ts` - Generic API client with error handling
- [x] Create `api/endpoints.ts` - Centralized API endpoints
- [x] Create `hooks/useApi.ts` - Generic API state management
- [x] Create `hooks/useChatWidget.ts` - Chat UI state management
- [x] Create `hooks/useClinicHours.ts` - Clinic hours with "today" highlighting
- [x] Refactor ChatWidget to use `useChatWidget` hook
- [x] Refactor ChatMessages to use `TOOL_ICONS` from constants
- [x] Refactor About page to use `useClinicHours` hook

#### 6.4 Home & Services Pages ✅
- [x] Redesign Home page with hero, features, video, location sections
- [x] Redesign Services page with categories and filtering
- [x] Add proper TypeScript types throughout

---

### Phase 6.5: Landing Page & Mobile ✅ (Latest)

#### 6.5.1 Single Landing Page ✅
- [x] Consolidate Home, Services, About into single LandingPage
- [x] Create section components (HeroSection, ServicesSection, TeamSection, etc.)
- [x] Implement scroll-to-section navigation
- [x] Add ChatContext for shared chat state
- [x] Service cards open chat with service name

#### 6.5.2 Mobile Responsiveness ✅
- [x] Add mobile hamburger menu to Navbar
- [x] ChatWidget full-screen on mobile
- [x] Responsive grids for all sections
- [x] Touch-friendly button sizes

#### 6.5.3 Code Cleanup ✅
- [x] Remove unused pages (Home/, Services/, About.tsx)
- [x] Update Footer with correct links
- [x] Clean component APIs with TypeScript interfaces

---

### Phase 8: Google Calendar Integration ✅
- [x] Integration code in `server/src/services/calendar.ts`
- [x] `checkCalendarAvailability()` - fetches busy slots from Google Calendar
- [x] `createCalendarEvent()` - creates events on approval
- [x] Retry logic with exponential backoff
- [x] Graceful fallback to mock slots when not configured
- [x] Set up Google Cloud project with Calendar API enabled
- [x] Create service account and download JSON key
- [x] Share clinic calendar with service account email
- [x] Add `GOOGLE_SERVICE_ACCOUNT_KEY` to env
- [x] Add `GOOGLE_CALENDAR_ID` to env
- [x] **Integrated calendar check into `checkAvailability` tool** - now checks both DB appointments AND Google Calendar busy slots when offering times

---

### Phase 5: Agent Robustness Upgrade ✅

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

### Phase 7: Frontend Standards - CVA & i18n ✅

#### 7.1 Install & Configure CVA ✅
- [x] Install `class-variance-authority` package
- [x] Update `cn()` utility to work with CVA

#### 7.2 Refactor UI Components to CVA ✅
- [x] Button - convert variants/sizes to CVA
- [x] Card - convert variants/padding to CVA
- [x] Badge - convert variants/sizes to CVA

#### 7.3 i18n Preparation ✅
- [x] Create `i18n/` folder structure
- [x] Create `i18n/en.ts` - English translations
- [x] Create `i18n/he.ts` - Hebrew translations
- [x] Create `useTranslation` hook (simple, no library)
- [x] Create `types.ts` with Translations interface

#### 7.4 Text Extraction ✅
- [x] HeroSection - title, subtitle, badges
- [x] ServicesSection - heading, description
- [x] TeamSection - heading, description
- [x] ContactSection - all labels
- [x] CTASection - all text
- [x] WhyChooseUsSection - all text
- [x] VideoSection - all text

#### 7.5 Code Patterns ✅
- [x] Array pattern for repeated components (ContactSection, HeroSection)
- [x] Updated STANDARDS-FRONTEND.md with patterns

---

## Pending Tasks

### Phase 9: End-to-End Testing
- [ ] Test chat without API key (graceful error)
- [ ] Test complete booking flow in browser
- [ ] Test self-correction (book taken slot → suggest alternatives)
- [ ] Test knowledge base queries ("What are your prices?")
- [ ] Test patient memory ("I prefer morning appointments")
- [ ] Test Telegram approve flow → email + calendar event
- [ ] Test Telegram decline flow → rejection email
- [ ] Verify staff images display correctly
- [ ] Test different services route to correct specialist

### Phase 10: Email Integration
- [ ] Set up Resend account
- [ ] Verify domain for sending
- [ ] Add RESEND_API_KEY to environment
- [ ] Test confirmation emails
- [ ] Test decline emails

### Phase 11: Deployment
- [ ] Deploy client to Vercel
- [ ] Deploy server to Railway/Render
- [ ] Configure production environment variables
- [ ] Set Telegram webhook to production URL
- [ ] Update CORS for production domain
- [ ] Final production testing

### Phase 12: Demo & Documentation
- [ ] Record demo video showing:
  - Website tour (home, services, about)
  - Booking flow with tool visualization
  - Telegram approve/decline
  - Self-correction behavior
  - Knowledge base queries
- [ ] Add demo link to README

---

## Technical Debt

| Item | Priority | Notes |
|------|----------|-------|
| Add unit tests | Medium | Vitest for client, Jest for server |
| Accessibility audit | Medium | ARIA labels, keyboard nav |
| Performance audit | Low | Lighthouse, bundle analysis |
| API documentation | Low | OpenAPI spec for endpoints |

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

### Client Architecture
```
client/src/
├── config/
│   └── env.ts                 # Environment config (VITE_API_BASE_URL)
├── api/
│   ├── apiClient.ts           # Generic fetch wrapper with error handling
│   └── endpoints.ts           # Centralized API endpoints
├── hooks/
│   ├── useApi.ts              # Generic API state management
│   ├── useChatWidget.ts       # Chat UI state (open/minimize)
│   └── useClinicHours.ts      # Clinic hours with "today" check
├── context/
│   └── ChatContext.tsx        # Shared chat state (open/close/message)
├── types/
│   ├── clinic.ts              # Service, TeamMember, DayHours, etc.
│   └── chat.ts                # ToolInvocation, ToolIconMap, etc.
├── constants/
│   ├── clinic.ts              # CLINIC_INFO, NAV_LINKS
│   ├── services.ts            # SERVICES array
│   ├── team.ts                # TEAM, STATS
│   ├── features.ts            # FEATURES, WHY_CHOOSE_US
│   └── chat.ts                # TOOL_ICONS, WELCOME_MESSAGE
├── i18n/                      # (Planned) Internationalization
│   ├── index.ts               # Hook and exports
│   ├── en.ts                  # English translations
│   └── he.ts                  # Hebrew translations
├── components/
│   ├── ui/                    # Button/, Card/, Badge/
│   ├── layout/                # Container, Section, PageLayout
│   ├── chat/                  # ChatWidget, ChatMessages, ChatInput
│   └── clinic/                # Navbar, Footer
└── pages/
    ├── LandingPage.tsx        # Main landing page
    └── Landing/               # Section components
        ├── HeroSection.tsx
        ├── ServicesSection.tsx
        ├── TeamSection.tsx
        ├── WhyChooseUsSection.tsx
        ├── VideoSection.tsx
        ├── ContactSection.tsx
        └── CTASection.tsx
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

### Server (`server/.env`)
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

### Client (`client/.env`)
```env
# API Configuration
VITE_API_BASE_URL=http://localhost:3001

# Feature Flags (optional)
VITE_ENABLE_ANALYTICS=false
```
