# 🦷 SmartClinic Agent

An AI-powered dental clinic assistant that handles appointment scheduling with human-in-the-loop approval via Telegram.

## Project Overview

A patient-facing website for a dental clinic with an embedded AI chat agent. Patients can browse clinic info and chat with the agent to book appointments. The clinic owner receives real-time Telegram notifications for each new booking request and can approve or decline with a single tap.

This project demonstrates a **production-grade agentic workflow** that goes beyond simple chat — the agent **thinks** (plans multi-step actions), **acts** (calls external tools), and **self-corrects** (handles errors and retries with alternatives).

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        React Frontend                            │
│  ┌──────────────┐  ┌─────────────────────────────────────────┐  │
│  │  Clinic Info  │  │         Chat Widget (@ai-sdk/react)     │  │
│  │  Pages        │  │  useChat() ←→ /api/chat (streaming)     │  │
│  └──────────────┘  └──────────────────────────────────────────┘  │
└─────────────────────────────────────┬────────────────────────────┘
                                      │
                           ┌──────────▼──────────┐
                           │   Express Backend    │
                           │   ReAct Agent Loop   │
                           │   (Vercel AI SDK)    │
                           │                      │
                           │  LLM: Gemini 2.5     │
                           │  Flash (free tier)   │
                           └──────────┬───────────┘
                                      │
        ┌─────────────────────────────┼─────────────────────────────┐
        │                             │                             │
        ▼                             ▼                             ▼
┌───────────────┐           ┌───────────────┐           ┌───────────────┐
│    Google     │           │   Telegram    │           │    Resend     │
│   Calendar    │           │   Bot API     │           │    Email      │
│    (free)     │           │   (free)      │           │   (free)      │
└───────────────┘           └───────┬───────┘           └───────────────┘
                                    │
                             ┌──────▼──────┐
                             │   Clinic    │
                             │   Owner     │
                             │  (Approve/  │
                             │   Decline)  │
                             └─────────────┘
```

## Core Requirements Coverage

### ✅ 1. Agentic Logic (ReAct Pattern)

The agent uses **Vercel AI SDK's `streamText` with `maxSteps`** to implement a reasoning loop:

1. Patient: "I want to book a cleaning for next Tuesday"
2. Agent **thinks**: "I need to check availability for Tuesday"
3. Agent **acts**: Calls `checkAvailability` tool
4. Agent **thinks**: "I see 3 available slots, I should present them"
5. Agent **acts**: Responds with options
6. After patient picks: Agent calls `createAppointment` → `notifyClinicOwner`

### ✅ 2. Tool Use (5 External Tools)

| Tool | Purpose | API |
|------|---------|-----|
| `checkAvailability` | Check available appointment slots | Google Calendar API |
| `createAppointment` | Create pending appointment in DB | SQLite |
| `searchKnowledgeBase` | Search clinic info (services, pricing, hours) | Local JSON |
| `getPatientHistory` | Retrieve patient preferences & history | SQLite |
| `savePatientPreference` | Store patient preferences for future | SQLite |

Plus external services:
- **Telegram Bot** - Owner notifications with approve/decline buttons
- **Resend Email** - Patient confirmation/rejection emails

### ✅ 3. Self-Correction

The agent handles errors gracefully:
- **Slot taken**: Retries with alternative slots
- **Invalid date**: Asks for clarification
- **API failure**: Falls back gracefully with explanation
- **Missing info**: Asks for required fields before proceeding

## Nice-to-Have Features

### 🧠 Long-Term Memory
- Stores patient preferences in SQLite
- Retrieves history for returning patients
- Examples: "David prefers morning appointments"

### 🔍 Agentic RAG
- Knowledge base with clinic info (services, pricing, hours, team)
- Agent **decides** when to query knowledge base vs. answer from context
- Uses `searchKnowledgeBase` tool with keyword matching

### 🎨 Polished UI
- Modern clinic website with hero, services, team pages
- Floating chat widget with tool invocation visualization
- Responsive design, works on mobile

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18 + TypeScript + Vite |
| **Styling** | Tailwind CSS |
| **AI Chat** | @ai-sdk/react (useChat) |
| **Backend** | Node.js + Express + TypeScript |
| **AI SDK** | Vercel AI SDK v4 |
| **LLM** | Google Gemini 2.5 Flash |
| **Database** | SQLite (better-sqlite3) |
| **Calendar** | Google Calendar API |
| **Notifications** | Telegram Bot API |
| **Email** | Resend |

## Project Structure

```
smart-clinic-agent/
├── server/
│   ├── src/
│   │   ├── index.ts              # Express entry point
│   │   ├── routes/
│   │   │   ├── chat.ts           # AI chat endpoint (streaming)
│   │   │   └── telegram.ts       # Telegram webhook handler
│   │   ├── agent/
│   │   │   ├── index.ts          # System prompt
│   │   │   └── tools/index.ts    # Tool definitions
│   │   ├── services/
│   │   │   ├── calendar.ts       # Google Calendar integration
│   │   │   ├── telegram.ts       # Telegram Bot service
│   │   │   ├── email.ts          # Resend email service
│   │   │   └── knowledge.ts      # Knowledge base search
│   │   └── db/
│   │       ├── index.ts          # SQLite connection
│   │       ├── appointments.ts   # Appointment CRUD
│   │       └── patients.ts       # Patient preferences
│   └── data/
│       └── clinic-knowledge.json # Clinic information
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
│   └── index.html
│
└── README.md
```

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd smart-clinic-agent

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

# Optional: Google Calendar (falls back to mock data if not set)
GOOGLE_CALENDAR_ID=your_calendar_id
GOOGLE_SERVICE_ACCOUNT_KEY={"type":"service_account",...}

# Optional: Telegram (logs to console if not set)
TELEGRAM_BOT_TOKEN=your_bot_token
TELEGRAM_OWNER_CHAT_ID=your_chat_id

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

## Appointment Flow

### Happy Path

```
Patient (Chat)                Agent                    Owner (Telegram)
      │                         │                           │
      │  "Book a cleaning       │                           │
      │   for next Tuesday"     │                           │
      │────────────────────────▶│                           │
      │                         │──▶ checkAvailability()    │
      │                         │◀── [9:00, 10:30, 14:00]   │
      │  "I have 3 slots..."    │                           │
      │◀────────────────────────│                           │
      │  "10:30, I'm David,     │                           │
      │   david@email.com"      │                           │
      │────────────────────────▶│                           │
      │                         │──▶ createAppointment()    │
      │                         │──▶ notifyOwner() ────────▶│
      │  "Pending approval!"    │                           │ [Approve] [Decline]
      │◀────────────────────────│                           │
      │                         │      Owner taps Approve   │
      │                         │◀─────────────────────────│
      │                         │──▶ confirmAppointment()   │
      │                         │──▶ sendEmail() ──────────▶│ Patient gets email
```

### Self-Correction Example

```
Patient: "Book me for Tuesday at 10:30"
Agent: [checkAvailability(tuesday, 10:30)]
Tool: ERROR — slot already taken

Agent: [checkAvailability(tuesday, all)]
Tool: [9:00, 14:00, 15:30]

Agent: "Sorry, 10:30 is no longer available.
        I have 9:00 AM, 2:00 PM, or 3:30 PM.
        Would any of these work?"
```

## External Service Setup

### Google Gemini (Required)

1. Go to [Google AI Studio](https://aistudio.google.com/)
2. Create an API key
3. Add to `.env`: `GOOGLE_GENERATIVE_AI_API_KEY=your_key`

### Telegram Bot (Optional)

1. Message [@BotFather](https://t.me/botfather) on Telegram
2. Create a new bot with `/newbot`
3. Copy the token to `.env`: `TELEGRAM_BOT_TOKEN=your_token`
4. Get your chat ID by messaging [@userinfobot](https://t.me/userinfobot)
5. Add to `.env`: `TELEGRAM_OWNER_CHAT_ID=your_chat_id`
6. Set webhook (for production): `https://api.telegram.org/bot<TOKEN>/setWebhook?url=<YOUR_URL>/api/telegram/webhook`

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

## Demo Video

[Link to demo video - to be added]

Demonstrates:
1. Booking flow with slot selection
2. Owner approval via Telegram
3. Self-correction when slot is taken
4. Knowledge base queries (pricing, hours)
5. Tool invocation visualization in chat

## License

MIT
