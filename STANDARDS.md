# Code Standards & Conventions

> SmartClinic Agent - Dr. Ilan Ofeck Dental Clinic

---

## Project Structure

```
AIClinicAgent/
├── server/                    # Express.js Backend
│   ├── src/
│   │   ├── agent/            # AI Agent logic
│   │   │   ├── index.ts      # System prompt
│   │   │   └── tools/        # Agent tools (Zod schemas)
│   │   ├── db/               # Database layer
│   │   │   ├── index.ts      # DB connection & init
│   │   │   ├── staff.ts      # Staff queries
│   │   │   ├── services.ts   # Services queries
│   │   │   └── appointments.ts
│   │   ├── routes/           # API endpoints
│   │   ├── services/         # External integrations
│   │   │   ├── telegram.ts   # Telegram Bot
│   │   │   ├── calendar.ts   # Google Calendar
│   │   │   └── email.ts      # Resend/Email
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
└── README.md                  # Project overview
```

---

## Naming Conventions

### Files & Directories

| Type | Convention | Example |
|------|------------|---------|
| React Components | PascalCase | `ChatWidget.tsx` |
| Pages | PascalCase | `Services.tsx` |
| Utilities | camelCase | `utils.ts` |
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

// Export types from a central location
// client/src/types/index.ts or server/src/types/index.ts
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
```

---

## API Design

### Endpoints

```
GET    /api/staff              # List all staff
GET    /api/staff/:id          # Get staff by ID
GET    /api/services           # List all services
GET    /api/services/:id       # Get service by ID
POST   /api/chat               # AI chat (streaming)
POST   /api/telegram/webhook   # Telegram callbacks
GET    /api/appointments       # List appointments
```

### Response Format

```typescript
// Success
{ success: true, data: { ... } }

// Error
{ success: false, error: 'Error message' }

// Streaming (AI chat)
// Uses Vercel AI SDK data stream format
```

---

## Agent Tools

### Tool Definition Pattern

```typescript
import { tool } from 'ai'
import { z } from 'zod'

export const myTool = tool({
  description: 'Clear description of what this tool does',
  parameters: z.object({
    param1: z.string().describe('Description for AI'),
    param2: z.number().optional().describe('Optional param'),
  }),
  execute: async ({ param1, param2 }) => {
    try {
      // Tool logic here
      return { success: true, data: result }
    } catch (error) {
      console.error('Tool error:', error)
      return { success: false, error: 'User-friendly error message' }
    }
  },
})
```

### Tool Naming

| Tool | Purpose |
|------|---------|
| `checkAvailability` | Check staff calendar slots |
| `createAppointment` | Book pending appointment |
| `searchKnowledgeBase` | RAG - search clinic info |
| `getPatientHistory` | Long-term memory lookup |
| `getStaffForService` | Find which staff does a service |

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
```

### Branch Names

```
feature/staff-scheduling
fix/telegram-webhook
refactor/database-schema
```

---

## Environment Variables

```bash
# Server (.env)
PORT=3001
GOOGLE_GENERATIVE_AI_API_KEY=xxx
TELEGRAM_BOT_TOKEN=xxx
TELEGRAM_OWNER_CHAT_ID=xxx
RESEND_API_KEY=xxx
GOOGLE_CALENDAR_CREDENTIALS=xxx

# Client (.env)
VITE_API_URL=http://localhost:3001
```

---

## Error Handling

### Server-side

```typescript
// Always wrap async operations in try-catch
// Log errors with context
// Return user-friendly messages

try {
  const result = await someOperation()
  return { success: true, data: result }
} catch (error) {
  console.error('Operation failed:', { error, context: { userId, action } })
  return { success: false, error: 'Something went wrong. Please try again.' }
}
```

### Agent Tools

```typescript
// Tools should NEVER throw - always return error objects
// This allows the AI to self-correct

execute: async (params) => {
  try {
    // ... logic
  } catch (error) {
    return {
      success: false,
      error: 'Unable to complete. Please call the clinic at 03-5467032.'
    }
  }
}
```

---

## Testing Checklist

Before committing:

- [ ] Server compiles: `cd server && npx tsc --noEmit`
- [ ] Client compiles: `cd client && npx tsc --noEmit`
- [ ] Server runs: `cd server && npm run dev`
- [ ] Client runs: `cd client && npm run dev`
- [ ] Chat works: Test basic conversation
- [ ] Booking works: Test appointment creation
- [ ] Telegram works: Verify notifications arrive
- [ ] DB updated: Check SQLite for new records
