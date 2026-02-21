# SmartClinic Agent

AI-powered dental clinic assistant that handles appointment scheduling with human-in-the-loop approval via Telegram.

[![Demo Video](https://img.shields.io/badge/Demo-Watch%20Video-red?style=for-the-badge&logo=google-drive)](https://drive.google.com/file/d/1QWU9e2aGP2vp3V4n_lAqCb3uF-LBUiof/view?usp=sharing)

## Overview

A patient-facing website for **Dr. Ilan Ofeck's Dental Clinic** in Tel Aviv with an embedded AI chat agent. Patients can browse clinic info and chat with the agent to book appointments. The clinic owner receives real-time Telegram notifications and can approve or decline with a single tap.

This project demonstrates a **production-grade agentic workflow**:
- **Thinks** - Plans multi-step actions using ReAct pattern
- **Acts** - Calls external tools (8 available)
- **Self-corrects** - Handles errors with structured responses
- **Remembers** - Recognizes returning patients
- **Searches** - Uses RAG for pricing/policy questions

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         React Frontend                               │
│  ┌──────────────────┐  ┌─────────────────────────────────────────┐  │
│  │  Landing Page    │  │         Chat Widget (@ai-sdk/react)     │  │
│  │  - Hero          │  │  useChat() ←→ /api/chat (SSE streaming) │  │
│  │  - Services      │  │  Tool invocation visualization          │  │
│  │  - Team          │  └─────────────────────────────────────────┘  │
│  │  - Contact       │                                                │
│  └──────────────────┘                                                │
└─────────────────────────────────┬────────────────────────────────────┘
                                  │
                       ┌──────────▼──────────┐
                       │   Express Backend    │
                       │   ReAct Agent Loop   │
                       │   (Vercel AI SDK)    │
                       │                      │
                       │  LLM: Gemini 2.5     │
                       │  Flash (paid tier)   │
                       └──────────┬───────────┘
                                  │
        ┌─────────────────────────┼─────────────────────────────┐
        │                         │                             │
        ▼                         ▼                             ▼
┌───────────────┐       ┌───────────────┐           ┌───────────────┐
│    SQLite     │       │   Telegram    │           │    Google     │
│   Database    │       │   Bot API     │           │   Calendar    │
└───────────────┘       └───────┬───────┘           └───────────────┘
                                │
                         ┌──────▼──────┐
                         │   Clinic    │
                         │   Owner     │
                         │  (Approve/  │
                         │   Decline)  │
                         └─────────────┘
```


---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18 + TypeScript + Vite |
| **Styling** | Tailwind CSS + CVA (class-variance-authority) |
| **AI Chat** | @ai-sdk/react (useChat) |
| **i18n** | Custom hook (English + Hebrew ready) |
| **Backend** | Node.js + Express + TypeScript |
| **AI SDK** | Vercel AI SDK v4 |
| **LLM** | Google Gemini 2.5 Flash |
| **Database** | SQLite (better-sqlite3) |
| **Notifications** | Telegram Bot API |
| **Calendar** | Google Calendar API |
| **Email** | Resend (optional) |

---

## Project Structure

```
AIClinicAgent/
├── server/
│   ├── src/
│   │   ├── index.ts              # Express entry point
│   │   ├── routes/
│   │   │   ├── chat.ts           # AI chat (streaming + tracing)
│   │   │   └── telegram.ts       # Webhook handler
│   │   ├── agent/
│   │   │   ├── index.ts          # System prompt (dynamic)
│   │   │   └── tools/index.ts    # 8 agent tools
│   │   ├── services/
│   │   │   ├── calendar.ts       # Google Calendar (with retry)
│   │   │   ├── telegram.ts       # Bot + notifications
│   │   │   ├── email.ts          # Resend (with retry)
│   │   │   └── knowledge.ts      # RAG knowledge base
│   │   ├── db/
│   │   │   ├── index.ts          # SQLite setup + seed
│   │   │   ├── staff.ts          # Staff queries
│   │   │   ├── services.ts       # Service queries
│   │   │   ├── appointments.ts   # Appointment CRUD
│   │   │   ├── patients.ts       # Patient preferences
│   │   │   └── conversations.ts  # Chat persistence
│   │   └── utils/
│   │       └── retry.ts          # Exponential backoff
│   └── data/
│       └── clinic-knowledge.json
│
├── client/
│   ├── src/
│   │   ├── App.tsx
│   │   ├── config/
│   │   │   └── env.ts            # Environment config
│   │   ├── api/
│   │   │   ├── apiClient.ts      # Fetch wrapper
│   │   │   └── endpoints.ts      # API endpoints
│   │   ├── hooks/
│   │   │   ├── useApi.ts         # API state management
│   │   │   ├── useChatWidget.ts  # Chat UI state
│   │   │   └── useClinicHours.ts # Hours with "today" check
│   │   ├── context/
│   │   │   └── ChatContext.tsx   # Shared chat state
│   │   ├── types/
│   │   │   ├── clinic.ts         # Service, TeamMember, etc.
│   │   │   └── chat.ts           # ToolInvocation, etc.
│   │   ├── constants/
│   │   │   ├── clinic.ts         # CLINIC_INFO, NAV_LINKS
│   │   │   ├── services.ts       # SERVICES array
│   │   │   ├── team.ts           # TEAM, STATS
│   │   │   ├── features.ts       # FEATURES
│   │   │   └── chat.ts           # TOOL_ICONS
│   │   ├── i18n/
│   │   │   ├── index.ts          # useTranslation hook
│   │   │   ├── types.ts          # Translation interface
│   │   │   ├── en.ts             # English translations
│   │   │   └── he.ts             # Hebrew translations
│   │   ├── components/
│   │   │   ├── ui/               # Button/, Card/, Badge/ (CVA)
│   │   │   ├── layout/           # Container, Section
│   │   │   ├── chat/             # ChatWidget, ChatMessages
│   │   │   └── clinic/           # Navbar, Footer
│   │   └── pages/
│   │       ├── LandingPage.tsx   # Main landing page
│   │       └── Landing/          # Section components
│   │           ├── HeroSection.tsx
│   │           ├── ServicesSection.tsx
│   │           ├── TeamSection.tsx
│   │           ├── WhyChooseUsSection.tsx
│   │           ├── VideoSection.tsx
│   │           ├── ContactSection.tsx
│   │           └── CTASection.tsx
│   └── public/images/staff/
│
├── PLAN.md          # Implementation plan
├── SPEC.md          # Technical specification
├── TASKS.md         # Task tracker
├── STANDARDS.md     # Backend code conventions
├── STANDARDS-FRONTEND.md  # Frontend code conventions
└── README.md        # This file
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd AIClinicAgent

# Install all dependencies
npm run install:all
```

### Environment Setup

Copy the example environment file:
```bash
cp server/.env.example server/.env
```

Configure the following variables in `server/.env`:

```env
# Required: Google Gemini API Key
GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_api_key

# Required: Telegram notifications
TELEGRAM_BOT_TOKEN=your_bot_token
TELEGRAM_OWNER_CHAT_ID=your_chat_id

# Optional: Google Calendar (falls back to mock data)
GOOGLE_CALENDAR_ID=your_calendar_id
GOOGLE_SERVICE_ACCOUNT_KEY={"type":"service_account",...}

# Optional: Email (logs to console if not set)
RESEND_API_KEY=your_resend_api_key
```

### Running the Application

```bash
# Start both server and client
npm run dev

# Or start individually:
npm run dev:server  # Backend on http://localhost:3001
npm run dev:client  # Frontend on http://localhost:5173
```

### Testing the Chat

1. Open http://localhost:5173 in your browser
2. Click the chat bubble in the bottom-right corner
3. Try: "I'd like to book a teeth cleaning for next Tuesday"

---

## Booking Flow

### Happy Path

```
Patient (Chat)                Agent                    Owner (Telegram)
      │                         │                           │
      │  "Book a cleaning       │                           │
      │   for next Tuesday"     │                           │
      │────────────────────────▶│                           │
      │                         │──▶ getStaffForService()   │
      │                         │──▶ checkAvailability()    │
      │                         │    (checks DB + Calendar) │
      │                         │◀── [9:00, 10:30, 14:00]   │
      │  "I have 3 slots..."    │                           │
      │◀────────────────────────│                           │
      │  "10:30, my email is    │                           │
      │   david@email.com"      │                           │
      │────────────────────────▶│                           │
      │                         │──▶ getPatientHistory()    │
      │                         │──▶ createAppointment()    │
      │                         │──▶ sendTelegramNotif() ──▶│
      │  "Pending approval!"    │                           │ [Approve] [Decline]
      │◀────────────────────────│                           │
      │                         │      Owner taps Approve   │
      │                         │◀─────────────────────────│
      │                         │──▶ sendEmail()            │
      │                         │──▶ createCalendarEvent()  │
```

### Self-Correction Example

```
Patient: "Book me for Tuesday at 10:30"
Agent: [checkAvailability(staffId, tuesday)]
Tool: { errorType: "NO_SLOTS", suggestion: "Try 9:00, 14:00, or 15:30" }

Agent: "Sorry, 10:30 is no longer available.
        I have 9:00 AM, 2:00 PM, or 3:30 PM.
        Would any of these work?"
```

---

## Agent Tools

| Tool | Purpose |
|------|---------|
| `getServices` | List all dental services with categories |
| `getStaffForService` | Find specialists for a treatment |
| `checkAvailability` | Check staff schedule + Google Calendar |
| `createAppointment` | Book pending appointment + notify owner |
| `getClinicTeam` | Get team member information |
| `searchKnowledgeBase` | RAG search for pricing/policies |
| `getPatientHistory` | Lookup returning patients |
| `savePatientPreference` | Store patient preferences |

---

## Error Handling

All tools return structured errors for AI self-correction:

```typescript
interface ToolError {
  errorType: 'NOT_FOUND' | 'NO_SLOTS' | 'STAFF_NOT_WORKING' |
             'VALIDATION_ERROR' | 'API_ERROR' | 'DATABASE_ERROR'
  message: string
  suggestion?: string
  retryable: boolean
}
```

The AI uses these to provide helpful alternatives instead of generic errors.

---

## External Service Setup

### Google Gemini (Required)

1. Go to [Google AI Studio](https://aistudio.google.com/)
2. Create an API key
3. Add to `.env`: `GOOGLE_GENERATIVE_AI_API_KEY=your_key`

### Telegram Bot (Required for notifications)

1. Message [@BotFather](https://t.me/botfather) on Telegram
2. Create a new bot with `/newbot`
3. Copy the token to `.env`: `TELEGRAM_BOT_TOKEN=your_token`
4. Get your chat ID by messaging [@userinfobot](https://t.me/userinfobot)
5. Add to `.env`: `TELEGRAM_OWNER_CHAT_ID=your_chat_id`
6. Set webhook (for production):
   ```
   https://api.telegram.org/bot<TOKEN>/setWebhook?url=<YOUR_URL>/api/telegram/webhook
   ```

### Google Calendar (Optional)

1. Create a Google Cloud project
2. Enable Calendar API
3. Create a service account
4. Download the JSON key
5. Share your calendar with the service account email
6. Add to `.env`

### Resend Email (Optional)

1. Sign up at [resend.com](https://resend.com)
2. Create an API key
3. Add to `.env`: `RESEND_API_KEY=your_key`

---

## Development

### Build

```bash
cd server && npm run build
cd client && npm run build
```

### Type Check

```bash
cd server && npx tsc --noEmit
cd client && npx tsc --noEmit
```

### Debug Agent Steps

Check console for step-by-step logging:
```
[Step 1] Tool call: getStaffForService {"serviceName":"cleaning"}
[Step 1] Tool result: getStaffForService [{"id":2,"name":"Katy Fridman"...}]
[Agent finished] Reason: end_turn, Steps: 4, Tools: [getStaffForService, checkAvailability]
```

Or call the trace endpoint:
```
GET /api/chat/trace
```

---

## Integration Status

| Component | Status | Notes |
|-----------|--------|-------|
| SQLite DB | ✅ Real | Staff, services, appointments, patients |
| Gemini AI | ✅ Real | Paid API (gemini-2.5-flash) |
| Telegram Bot | ✅ Real | Notifications + approve/decline |
| Google Calendar | ✅ Real | Integrated into checkAvailability |
| Email (Resend) | ✅ Real | Confirmation + decline emails |

---

## Documentation

| File | Description |
|------|-------------|
| [TASKS.md](./TASKS.md) | Task tracker (completed/pending) |
| [ARCHITECTURE.md](./ARCHITECTURE.md) | Technical architecture, API, database schema |
| [STANDARDS.md](./STANDARDS.md) | Code conventions (backend + frontend) |

---

## License

MIT
