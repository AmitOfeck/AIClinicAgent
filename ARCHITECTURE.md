# SmartClinic Agent - Architecture

Technical documentation for the AI-powered dental clinic booking system.

---

## System Overview

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
    └───────────────┘       └───────────────┘           └───────────────┘
```

---

## Agentic AI Pattern (ReAct)

```
User Message → LLM Reasoning → Tool Call → Tool Result → LLM Reasoning → Response
                    ↑                          │
                    └──────────────────────────┘
                         (up to 10 steps)
```

**Configuration:**
- `maxSteps: 10` - Up to 10 reasoning cycles per request
- `streamText` - SSE streaming for real-time response
- `onStepFinish` - Logs each tool call for debugging
- `onFinish` - Records final stats (tokens, finish reason)

---

## Agent Tools

| Tool | Purpose | Error Handling |
|------|---------|----------------|
| `getServices` | List all dental services | Returns structured error on DB failure |
| `getStaffForService` | Find specialists for treatment | Returns `NOT_FOUND` if service doesn't exist |
| `checkAvailability` | Check staff schedule + calendar | Returns `STAFF_NOT_WORKING` with valid days |
| `createAppointment` | Book pending appointment | Validates email, sends Telegram |
| `getClinicTeam` | Get team information | Returns all active staff |
| `searchKnowledgeBase` | RAG search clinic info | Keyword-based search with categories |
| `getPatientHistory` | Lookup returning patients | Returns appointments + preferences |
| `savePatientPreference` | Store patient preferences | Validates preference type |

---

## Booking Flow

```
1. Patient requests appointment via chat
2. AI identifies service needed
3. AI calls getStaffForService → finds qualified staff
4. AI calls checkAvailability → gets available slots
5. AI presents options to patient
6. AI collects patient info (email → name → phone)
7. AI calls getPatientHistory (if returning patient)
8. AI calls createAppointment
9. Telegram notification sent to clinic owner
10. Owner approves/declines via inline buttons
11. Patient receives email confirmation
12. Calendar event created (on approval)
```

---

## Database Schema

### Tables

```sql
staff (
  id, name, role, specialty, image_url, bio,
  working_hours JSON, is_active, created_at, updated_at
)

services (
  id, name, name_hebrew, description, duration_minutes,
  price, category, is_active, created_at, updated_at
)

staff_services (
  staff_id, service_id -- Many-to-many
)

appointments (
  id, patient_name, patient_email, patient_phone, patient_telegram_id,
  service_id, service, staff_id, date_time, status, notes,
  created_at, updated_at
)

patient_preferences (
  id, email, preference_type, preference_value, created_at
)

conversations (
  id, session_id, messages JSON, created_at, updated_at
)
```

### Appointment Status Flow

```
PENDING → APPROVED → (completed)
       ↘ DECLINED
       ↘ CANCELLED
```

---

## Error Handling

### Structured Error Types

```typescript
interface ToolError {
  errorType: 'NOT_FOUND' | 'NO_SLOTS' | 'STAFF_NOT_WORKING' |
             'VALIDATION_ERROR' | 'API_ERROR' | 'DATABASE_ERROR'
  message: string
  suggestion?: string
  retryable: boolean
}
```

### Error Behaviors

| Error Type | AI Behavior |
|------------|-------------|
| `NOT_FOUND` | Ask patient to clarify or show available options |
| `NO_SLOTS` | Suggest alternative dates or staff members |
| `STAFF_NOT_WORKING` | Use `workingDays` to suggest valid days |
| `VALIDATION_ERROR` | Ask for correct information |
| `API_ERROR` | Retry if `retryable: true`, else apologize |
| `DATABASE_ERROR` | Retry once, else suggest calling clinic |

### Retry Logic

```typescript
withRetry(fn, {
  maxRetries: 3,
  delayMs: 1000,
  backoffMultiplier: 2,
  retryableStatusCodes: [408, 429, 500, 502, 503, 504]
})
```

---

## Multi-Channel Agent

```
                    ┌─────────────────────────┐
                    │   services/agent.ts     │
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

---

## API Endpoints

### Chat

```
POST /api/chat
Content-Type: application/json
Body: { messages: Message[] }
Response: SSE stream (Vercel AI SDK format)

GET /api/chat/trace
Response: { steps: AgentStep[], totalSteps: number, toolsUsed: string[] }
```

### Telegram Webhook

```
POST /api/telegram/webhook
Body: Telegram Update object
Response: 200 OK

Handles:
- callback_query: approve:ID or decline:ID
- Updates appointment status
- Sends confirmation/decline email
- Creates calendar event (on approve)
```

### Health Check

```
GET /api/health
Response: { status: "ok", timestamp: "..." }
```

---

## Agent Step Tracing

### Trace Interface

```typescript
interface AgentStep {
  stepNumber: number
  type: 'tool-call' | 'tool-result' | 'text'
  toolName?: string
  toolArgs?: Record<string, unknown>
  toolResult?: unknown
  text?: string
  timestamp: string
}

interface AgentTrace {
  steps: AgentStep[]
  totalSteps: number
  toolsUsed: string[]
}
```

### Console Output

```
[Step 1] Tool call: getStaffForService {"serviceName":"teeth cleaning"}
[Step 1] Tool result: getStaffForService [{"id":2,"name":"Katy Fridman"...}]
[Step 2] Tool call: checkAvailability {"staffId":2,"date":"2025-02-25"}
[Agent finished] Reason: end_turn, Steps: 4, Tools: [getStaffForService, checkAvailability]
```

---

## RAG Knowledge Base

### Trigger Phrases

| Category | Phrases |
|----------|---------|
| Pricing | "How much", "Price of", "Payment plans" |
| Insurance | "Do you accept", "Is this covered" |
| Emergency | "I have pain", "Urgent", "Emergency" |
| Preparation | "How do I prepare", "What should I do before" |
| Policies | "Cancellation", "Late policy", "First visit" |
| Location | "Where are you", "Parking", "Directions" |

---

## Staff & Services

### Team (6 members)

| Name | Role | Services | Working Days |
|------|------|----------|--------------|
| Dr. Ilan Ofeck | Chief Dentist | Restorations, Veneers, Crowns, Botox | Sun-Thu, Fri AM |
| Katy Fridman | Hygienist | Hygiene, Whitening | Sun, Tue, Thu |
| Shir Formoza | Hygienist | Hygiene, Whitening | Mon, Wed, Fri AM |
| Dr. Maayan Granit | Endodontist | Root Canal | Mon, Wed, Fri AM |
| Dr. Sahar Nadel | Oral Surgeon | Implants, Periodontal Surgery | Mon, Wed PM |
| Dr. Dan Zitoni | Dentist | Restorations | Sun, Tue, Thu PM |

### Services (10 treatments)

| Category | Service | Duration |
|----------|---------|----------|
| Preventive | Dental Hygiene & Cleaning | 45 min |
| Aesthetic | Teeth Whitening | 60 min |
| Aesthetic | Composite Veneers | 60 min |
| Aesthetic | Porcelain Veneers | 60 min |
| Aesthetic | Botox Treatment | 30 min |
| Restorative | Composite Restorations | 45 min |
| Restorative | Porcelain Crowns | 60 min |
| Endodontics | Root Canal Treatment | 90 min |
| Surgery | Periodontal Surgery | 90 min |
| Surgery | Dental Implants | 120 min |

---

## File Structure

```
server/src/
├── index.ts                 # Express entry point
├── routes/
│   ├── chat.ts              # AI chat + tracing
│   └── telegram.ts          # Webhook handler
├── agent/
│   ├── index.ts             # System prompt (dynamic)
│   └── tools/index.ts       # 8 tools with Zod schemas
├── services/
│   ├── agent.ts             # Multi-channel agent service
│   ├── calendar.ts          # Google Calendar (retry)
│   ├── telegram.ts          # Bot + notifications
│   ├── email.ts             # Resend (retry)
│   └── knowledge.ts         # RAG search
├── db/
│   ├── index.ts             # SQLite setup + seed
│   ├── staff.ts             # Staff queries
│   ├── services.ts          # Service queries
│   ├── appointments.ts      # Appointment CRUD
│   └── patients.ts          # Patient preferences
└── utils/
    └── retry.ts             # Exponential backoff

client/src/
├── config/env.ts            # Environment config
├── api/                     # API client + endpoints
├── hooks/                   # Custom hooks
├── context/                 # ChatContext
├── types/                   # TypeScript types
├── constants/               # Extracted data
├── i18n/                    # Translations (en, he)
├── components/
│   ├── ui/                  # Button/, Card/, Badge/ (CVA)
│   ├── layout/              # Section, Container
│   ├── chat/                # ChatWidget, ChatMessages
│   └── clinic/              # Navbar, Footer
└── pages/
    ├── LandingPage.tsx      # Main page
    └── Landing/             # Section components
```

---

## Environment Variables

```env
# Required for AI chat
GOOGLE_GENERATIVE_AI_API_KEY=xxx

# Required for Telegram notifications
TELEGRAM_BOT_TOKEN=xxx
TELEGRAM_OWNER_CHAT_ID=xxx

# Optional - falls back to mock
GOOGLE_CALENDAR_ID=xxx
GOOGLE_SERVICE_ACCOUNT_KEY={"type":"service_account",...}
RESEND_API_KEY=xxx

# Server config
PORT=3001
CLIENT_URL=http://localhost:5173
APP_URL=http://localhost:3001
```
