# SmartClinic Agent - Technical Specification

## Overview

AI-powered dental clinic booking assistant for **Dr. Ilan Ofeck's Dental Clinic** in Tel Aviv, Israel. The system uses an agentic AI approach (ReAct pattern) to help patients book appointments with the right specialist based on their treatment needs.

---

## Clinic Information

| Field | Value |
|-------|-------|
| **Name** | Dr. Ilan Ofeck Dental Clinic |
| **Address** | Basel 35, Tel Aviv, Israel |
| **Phone** | 03-5467032 |
| **Website** | dr-ofeck.co.il |
| **Hours** | Sun-Thu 8:00-18:00, Fri 8:00-13:00, Sat Closed |

---

## Tech Stack

### Frontend (`client/`)
| Component | Technology |
|-----------|------------|
| Framework | React 18 + TypeScript |
| Build | Vite |
| Styling | Tailwind CSS |
| Routing | React Router v6 |
| Icons | Lucide React |
| AI Chat | @ai-sdk/react (`useChat`) |

### Backend (`server/`)
| Component | Technology |
|-----------|------------|
| Runtime | Node.js + TypeScript |
| Framework | Express.js |
| Database | SQLite (better-sqlite3) |
| AI SDK | Vercel AI SDK v4 |
| LLM | Google Gemini 2.5 Flash |
| Notifications | Telegram Bot API |
| Email | Resend (mocked) |
| Calendar | Google Calendar API (mocked) |

---

## Architecture

### Agentic AI Pattern (ReAct)

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

### Tool System

| Tool | Purpose | Error Handling |
|------|---------|----------------|
| `getServices` | List all dental services | Returns structured error on DB failure |
| `getStaffForService` | Find specialists for treatment | Returns `NOT_FOUND` if service doesn't exist |
| `checkAvailability` | Check staff schedule for date | Returns `STAFF_NOT_WORKING` with valid days |
| `createAppointment` | Book pending appointment | Validates email, sends Telegram |
| `getClinicTeam` | Get team information | Returns all active staff |
| `searchKnowledgeBase` | RAG search clinic info | Keyword-based search with categories |
| `getPatientHistory` | Lookup returning patients | Returns appointments + preferences |
| `savePatientPreference` | Store patient preferences | Validates preference type |

### Booking Flow

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

## Error Handling System

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

### Trace Endpoint

```
GET /api/chat/trace
→ { steps: [...], totalSteps: 5, toolsUsed: ["checkAvailability", "createAppointment"] }
```

### Console Output

```
[Step 1] Tool call: getStaffForService {"serviceName":"teeth cleaning"}
[Step 1] Tool result: getStaffForService [{"id":2,"name":"Katy Fridman"...}]
[Step 2] Tool call: checkAvailability {"staffId":2,"date":"2025-02-25"}
[Agent finished] Reason: end_turn, Steps: 4, Tools: [getStaffForService, checkAvailability]
```

---

## Proactive Patient Recognition

### System Prompt Behavior

When patient provides email:
1. **Immediately** call `getPatientHistory`
2. If returning: Greet by name, acknowledge history
3. If new: Welcome warmly
4. Use preferences for personalization

### Example

```
Patient: "My email is david@example.com"
Agent: [calls getPatientHistory]
→ "Welcome back, David! I see you had a cleaning with Katy last month.
   You mentioned preferring morning appointments - shall I look for morning slots?"
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

### Search Behavior

```
Patient: "What are your prices?"
Agent: [calls searchKnowledgeBase {"query": "prices"}]
→ Returns pricing info from clinic-knowledge.json
→ Agent formats response for patient
```

---

## Integration Status

| Component | Status | Implementation |
|-----------|--------|----------------|
| SQLite Database | ✅ Real | Local file storage |
| Gemini AI | ✅ Real | Paid API (gemini-2.5-flash) |
| Telegram Bot | ✅ Real | @DRIlanOfeckClinic_bot |
| Google Calendar | ✅ Real | Availability + event creation |
| Email (Resend) | ✅ Real | Confirmation + decline emails |

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

## Environment Variables

```env
# Required
GOOGLE_GENERATIVE_AI_API_KEY=xxx    # Gemini API

# Required for notifications
TELEGRAM_BOT_TOKEN=xxx              # From @BotFather
TELEGRAM_OWNER_CHAT_ID=xxx          # Clinic owner's chat ID

# Optional (falls back to mock)
GOOGLE_SERVICE_ACCOUNT_KEY={}       # Service account JSON
GOOGLE_CALENDAR_ID=xxx              # Calendar to check
RESEND_API_KEY=xxx                  # Email service

# Server config
PORT=3001
CLIENT_URL=http://localhost:5173
APP_URL=http://localhost:3001
```

---

## Cost Optimization

| Rule | Implementation |
|------|----------------|
| Model | gemini-2.5-flash (~$0.075/M input tokens) |
| Max Steps | 10 (prevents runaway loops) |
| Retry | Max 1 retry on failure |
| Caching | Tool results not cached (real-time data) |
| Token Budget | System prompt ~2000 tokens |

---

## Deployment Architecture

```
┌─────────────────┐     ┌──────────────────┐
│     Vercel      │────▶│    Railway       │
│  (React SPA)    │     │   (Express)      │
│                 │     │                  │
│  - Static files │     │  - AI Agent      │
│  - API proxy    │     │  - SQLite DB     │
└─────────────────┘     │  - Webhooks      │
                        └────────┬─────────┘
                                 │
              ┌──────────────────┼──────────────────┐
              ▼                  ▼                  ▼
      ┌───────────┐      ┌───────────┐      ┌───────────┐
      │  Gemini   │      │ Telegram  │      │  Resend   │
      │   API     │      │   Bot     │      │  Email    │
      └───────────┘      └───────────┘      └───────────┘
```
