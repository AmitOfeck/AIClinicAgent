# Code Standards & Conventions

> SmartClinic Agent - Dr. Ilan Ofeck Dental Clinic

---

## Project Structure

```
AIClinicAgent/
├── server/                    # Express.js Backend
│   ├── src/
│   │   ├── index.ts          # App entry point
│   │   ├── agent/            # AI Agent logic
│   │   │   ├── index.ts      # System prompt
│   │   │   └── tools/        # Agent tools (Zod schemas)
│   │   ├── db/               # Database layer
│   │   │   ├── index.ts      # DB connection & init
│   │   │   ├── staff.ts      # Staff queries
│   │   │   ├── services.ts   # Services queries
│   │   │   ├── appointments.ts
│   │   │   └── patients.ts
│   │   ├── routes/           # API endpoints
│   │   │   ├── chat.ts       # AI chat + tracing
│   │   │   └── telegram.ts   # Webhook handler
│   │   ├── services/         # External integrations
│   │   │   ├── telegram.ts   # Telegram Bot
│   │   │   ├── calendar.ts   # Google Calendar
│   │   │   ├── email.ts      # Resend/Email
│   │   │   └── knowledge.ts  # RAG knowledge base
│   │   ├── utils/            # Utilities
│   │   │   └── retry.ts      # Exponential backoff
│   │   └── data/             # Static data (JSON)
│   └── data/                 # SQLite database file
│
├── client/                    # React Frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── chat/         # Chat widget
│   │   │   └── clinic/       # Clinic UI components
│   │   ├── pages/            # Route pages
│   │   ├── lib/              # Utilities
│   │   └── types/            # TypeScript types
│   └── public/
│       └── images/           # Static images
│           ├── staff/        # Staff photos
│           └── clinic/       # Clinic photos
│
├── TASKS.md                   # Project task tracker
├── STANDARDS.md               # This file
├── SPEC.md                    # Technical specification
├── PLAN.md                    # Implementation plan
└── README.md                  # Project overview
```

---

## Naming Conventions

### Files & Directories

| Type | Convention | Example |
|------|------------|---------|
| React Components | PascalCase | `ChatWidget.tsx` |
| Pages | PascalCase | `Services.tsx` |
| Utilities | camelCase | `retry.ts` |
| Types | camelCase | `types.ts` |
| API Routes | kebab-case | `telegram.ts` → `/api/telegram` |
| Database files | camelCase | `appointments.ts` |

### Code

| Type | Convention | Example |
|------|------------|---------|
| Variables | camelCase | `patientName` |
| Constants | UPPER_SNAKE | `SYSTEM_PROMPT` |
| Functions | camelCase | `createAppointment()` |
| React Components | PascalCase | `ChatMessage` |
| Interfaces/Types | PascalCase | `Appointment`, `Staff` |
| Database tables | snake_case | `staff_services` |
| API endpoints | kebab-case | `/api/chat`, `/api/telegram` |

---

## TypeScript Guidelines

### Types & Interfaces

```typescript
// Use interfaces for objects that can be extended
interface Staff {
  id: number
  name: string
  role: string
  specialty: string | null
  imageUrl: string | null
  bio: string | null
  workingHours: WorkingHours
  isActive: boolean
}

// Use types for unions, primitives, or computed types
type AppointmentStatus = 'PENDING' | 'APPROVED' | 'DECLINED' | 'CANCELLED'
type ErrorType = 'NOT_FOUND' | 'NO_SLOTS' | 'STAFF_NOT_WORKING' |
                 'VALIDATION_ERROR' | 'API_ERROR' | 'DATABASE_ERROR'

// Export types from a central location
// server/src/types/index.ts or define inline in tool files
```

### Null Handling

```typescript
// Prefer explicit null checks
if (staff !== null) { ... }

// Use optional chaining for nested access
const name = appointment?.patient?.name

// Use nullish coalescing for defaults
const phone = patient.phone ?? 'Not provided'
```

---

## Database Conventions

### Table Design

```sql
-- Use snake_case for table and column names
-- Always include: id, created_at, updated_at
-- Use INTEGER PRIMARY KEY AUTOINCREMENT for IDs

CREATE TABLE staff (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  specialty TEXT,
  image_url TEXT,
  bio TEXT,
  working_hours TEXT,  -- JSON string
  is_active INTEGER DEFAULT 1,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);
```

### Query Functions

```typescript
// Name pattern: verb + Entity + optional modifier
// Examples:
getStaffById(id: number)
getStaffBySpecialty(specialty: string)
getAllActiveStaff()
createAppointment(data: CreateAppointmentInput)
updateAppointmentStatus(id: number, status: AppointmentStatus)
getServiceById(id: number)
findServiceByKeywords(keywords: string)
```

---

## API Design

### Endpoints

```
GET    /api/health             # Health check
GET    /api/staff              # List all staff
GET    /api/staff/:id          # Get staff by ID
GET    /api/services           # List all services
GET    /api/services/:id       # Get service by ID
POST   /api/chat               # AI chat (streaming)
GET    /api/chat/trace         # Last agent trace
POST   /api/telegram/webhook   # Telegram callbacks
```

### Response Format

```typescript
// Success (tools)
{ success: true, data: { ... } }

// Error (tools) - STRUCTURED for AI self-correction
{
  success: false,
  errorType: 'NO_SLOTS',
  message: 'No available slots on this date',
  suggestion: 'Try Monday or Wednesday when this staff member works',
  retryable: false
}

// Success (services with status flags)
{
  success: true,
  sent: true,           // Email was actually sent
  created: true,        // Calendar event was actually created
  fromCalendar: true    // Slots came from real calendar
}

// Streaming (AI chat)
// Uses Vercel AI SDK SSE format
```

---

## Agent Tools

### Tool Definition Pattern

```typescript
import { tool } from 'ai'
import { z } from 'zod'

// Tool error type for AI self-correction
interface ToolError {
  success: false
  errorType: 'NOT_FOUND' | 'NO_SLOTS' | 'STAFF_NOT_WORKING' |
             'VALIDATION_ERROR' | 'API_ERROR' | 'DATABASE_ERROR'
  message: string
  suggestion?: string
  retryable: boolean
}

export const myTool = tool({
  description: 'Clear description of what this tool does',
  parameters: z.object({
    param1: z.string().describe('Description for AI'),
    param2: z.number().optional().describe('Optional param'),
  }),
  execute: async ({ param1, param2 }) => {
    try {
      // Validate inputs
      if (!param1) {
        return {
          success: false,
          errorType: 'VALIDATION_ERROR',
          message: 'param1 is required',
          retryable: false
        }
      }

      // Tool logic here
      const result = await someOperation()

      return {
        success: true,
        data: result
      }
    } catch (error) {
      console.error('Tool error:', error)
      return {
        success: false,
        errorType: 'DATABASE_ERROR',
        message: 'Failed to complete operation',
        suggestion: 'Please try again or call the clinic',
        retryable: true
      }
    }
  },
})
```

### Tool Naming

| Tool | Purpose |
|------|---------|
| `getServices` | List all dental services |
| `getStaffForService` | Find specialists for treatment |
| `checkAvailability` | Check staff schedule for date |
| `createAppointment` | Book pending appointment |
| `getClinicTeam` | Get team information |
| `searchKnowledgeBase` | RAG search clinic info |
| `getPatientHistory` | Lookup returning patients |
| `savePatientPreference` | Store patient preferences |

---

## Error Handling

### Structured Error Types

```typescript
// Define all error types
type ErrorType =
  | 'NOT_FOUND'          // Resource doesn't exist
  | 'NO_SLOTS'           // No availability
  | 'STAFF_NOT_WORKING'  // Staff not working that day
  | 'VALIDATION_ERROR'   // Invalid input
  | 'API_ERROR'          // External API failed
  | 'DATABASE_ERROR'     // DB operation failed

// Error response interface
interface ToolError {
  success: false
  errorType: ErrorType
  message: string
  suggestion?: string      // Help AI self-correct
  retryable: boolean       // Can AI retry?
  workingDays?: number[]   // For STAFF_NOT_WORKING
}
```

### Error Handling in Tools

```typescript
// Tools should NEVER throw - always return error objects
// This allows the AI to self-correct

execute: async (params) => {
  try {
    const staff = getStaffById(params.staffId)

    if (!staff) {
      return {
        success: false,
        errorType: 'NOT_FOUND',
        message: `Staff member with ID ${params.staffId} not found`,
        suggestion: 'Use getClinicTeam to see available staff',
        retryable: false
      }
    }

    // Check if staff works on requested day
    const dayOfWeek = new Date(params.date).getDay()
    if (!staff.workingHours[dayOfWeek]) {
      return {
        success: false,
        errorType: 'STAFF_NOT_WORKING',
        message: `${staff.name} doesn't work on this day`,
        workingDays: Object.keys(staff.workingHours).map(Number),
        suggestion: `Try ${formatWorkingDays(staff.workingHours)}`,
        retryable: false
      }
    }

    // ... rest of logic
  } catch (error) {
    return {
      success: false,
      errorType: 'DATABASE_ERROR',
      message: 'Unable to complete. Please call 03-5467032.',
      retryable: true
    }
  }
}
```

---

## Retry Logic

### Utility Function

```typescript
// utils/retry.ts

interface RetryOptions {
  maxRetries?: number          // Default: 3
  delayMs?: number             // Default: 1000
  backoffMultiplier?: number   // Default: 2
  retryableStatusCodes?: number[]
}

async function withRetry<T>(
  fn: () => Promise<T>,
  options?: RetryOptions
): Promise<{ success: boolean; data?: T; error?: string; attempts: number }>

function checkServiceConfig(requiredKeys: string[]): {
  configured: boolean
  missingKeys?: string[]
}
```

### Usage in Services

```typescript
// services/calendar.ts

export async function checkCalendarAvailability(
  date: string,
  service?: string
): Promise<CalendarAvailabilityResult> {
  // Check if configured
  const config = checkServiceConfig(['GOOGLE_SERVICE_ACCOUNT_KEY', 'GOOGLE_CALENDAR_ID'])

  if (!config.configured) {
    console.log('Google Calendar not configured, returning mock slots')
    const mockSlots = generateMockSlots(date)
    return { slots: mockSlots, fromCalendar: false, error: 'Not configured' }
  }

  // Use retry wrapper
  const result = await withRetry(async () => {
    const calendar = getCalendarClient()
    // ... API call
  })

  if (!result.success) {
    // Fallback to mock
    return { slots: generateMockSlots(date), fromCalendar: false, error: result.error }
  }

  return { slots: result.data!, fromCalendar: true }
}
```

---

## Step Tracing

### Trace Interface

```typescript
// routes/chat.ts

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

### Usage in Chat Route

```typescript
const result = streamText({
  model,
  system: SYSTEM_PROMPT,
  messages,
  tools,
  maxSteps: 10,
  onStepFinish: ({ stepType, toolCalls, toolResults, text }) => {
    trace.totalSteps++
    const timestamp = new Date().toISOString()

    if (toolCalls && toolCalls.length > 0) {
      for (const toolCall of toolCalls) {
        trace.steps.push({
          stepNumber: trace.totalSteps,
          type: 'tool-call',
          toolName: toolCall.toolName,
          toolArgs: toolCall.args,
          timestamp,
        })
        console.log(`[Step ${trace.totalSteps}] Tool call: ${toolCall.toolName}`)
      }
    }
    // ... similar for toolResults and text
  },
  onFinish: ({ usage, finishReason }) => {
    console.log(`[Agent finished] Reason: ${finishReason}, Steps: ${trace.totalSteps}`)
    lastTrace = trace  // Store for /trace endpoint
  },
})
```

---

## React Components

### Component Structure

```tsx
// 1. Imports
import { useState } from 'react'
import { SomeIcon } from 'lucide-react'

// 2. Types (if component-specific)
interface Props {
  title: string
  onAction: () => void
}

// 3. Component
export default function MyComponent({ title, onAction }: Props) {
  // 3a. Hooks
  const [state, setState] = useState(false)

  // 3b. Handlers
  const handleClick = () => {
    onAction()
  }

  // 3c. Render
  return (
    <div className="...">
      {title}
    </div>
  )
}
```

### Styling (Tailwind)

```tsx
// Use semantic class ordering:
// 1. Layout (flex, grid, position)
// 2. Spacing (p, m, gap)
// 3. Sizing (w, h)
// 4. Colors (bg, text, border)
// 5. Effects (shadow, rounded)
// 6. States (hover, focus)

<div className="flex items-center gap-4 p-4 w-full bg-white rounded-lg shadow-sm hover:shadow-md">
```

---

## Git Conventions

### Commit Messages

```
feat: Add staff-based booking system
fix: Resolve Telegram notification delay
refactor: Extract calendar service
docs: Update TASKS.md with new plan
style: Format code with prettier
test: Add appointment creation tests
chore: Update dependencies
```

### Branch Names

```
feature/staff-scheduling
fix/telegram-webhook
refactor/database-schema
docs/update-readme
```

---

## Environment Variables

```bash
# Server (.env)

# Required
GOOGLE_GENERATIVE_AI_API_KEY=xxx
TELEGRAM_BOT_TOKEN=xxx
TELEGRAM_OWNER_CHAT_ID=xxx

# Optional (falls back to mock)
GOOGLE_SERVICE_ACCOUNT_KEY={}
GOOGLE_CALENDAR_ID=xxx
RESEND_API_KEY=xxx

# Server config
PORT=3001
CLIENT_URL=http://localhost:5173
APP_URL=http://localhost:3001

# Client (.env)
VITE_API_URL=http://localhost:3001
```

---

## Testing Checklist

Before committing:

- [ ] Server compiles: `cd server && npx tsc --noEmit`
- [ ] Client compiles: `cd client && npx tsc --noEmit`
- [ ] Server builds: `cd server && npm run build`
- [ ] Client builds: `cd client && npm run build`
- [ ] Server runs: `cd server && npm run dev`
- [ ] Client runs: `cd client && npm run dev`
- [ ] Chat works: Test basic conversation
- [ ] Booking works: Test appointment creation
- [ ] Telegram works: Verify notifications arrive
- [ ] DB updated: Check SQLite for new records
- [ ] Step tracing: Verify console logs tool calls
- [ ] Error handling: Test with invalid inputs

---

## Service Result Patterns

### Calendar Service

```typescript
interface CalendarAvailabilityResult {
  slots: string[]
  fromCalendar: boolean  // true = real API, false = mock
  error?: string
}

interface CalendarEventResult {
  success: boolean
  created: boolean       // true = actually created in Google
  eventId?: string
  error?: string
  retryAttempts?: number
}
```

### Email Service

```typescript
interface EmailResult {
  success: boolean
  sent: boolean          // true = actually sent via Resend
  error?: string
  retryAttempts?: number
}
```

### Telegram Service

```typescript
interface TelegramResult {
  success: boolean
  sent: boolean          // true = actually sent via Telegram
  error?: string
}
```

This ensures the AI agent knows the true status of external operations.
