# SmartClinic Agent - Code Standards

> Dr. Ilan Ofeck Dental Clinic

---

## Table of Contents

1. [Naming Conventions](#naming-conventions)
2. [TypeScript Guidelines](#typescript-guidelines)
3. [Backend Standards](#backend-standards)
4. [Frontend Standards](#frontend-standards)
5. [Git Conventions](#git-conventions)

---

## Naming Conventions

### Files & Directories

| Type | Convention | Example |
|------|------------|---------|
| React Components | PascalCase | `ChatWidget.tsx` |
| Pages | PascalCase | `LandingPage.tsx` |
| Utilities | camelCase | `retry.ts` |
| Hooks | camelCase with `use` | `useMediaQuery.ts` |
| Constants | camelCase | `services.ts` |
| Types | camelCase | `clinic.ts` |
| API Routes | kebab-case | `telegram.ts` → `/api/telegram` |

### Code

| Type | Convention | Example |
|------|------------|---------|
| Variables | camelCase | `patientName` |
| Constants | UPPER_SNAKE | `SYSTEM_PROMPT` |
| Functions | camelCase | `createAppointment()` |
| React Components | PascalCase | `ChatMessage` |
| Interfaces/Types | PascalCase | `Appointment` |
| Database tables | snake_case | `staff_services` |

---

## TypeScript Guidelines

### Types & Interfaces

```typescript
// Use interfaces for extensible objects
interface Staff {
  id: number
  name: string
  role: string
  specialty: string | null
}

// Use types for unions
type AppointmentStatus = 'PENDING' | 'APPROVED' | 'DECLINED' | 'CANCELLED'
type ErrorType = 'NOT_FOUND' | 'NO_SLOTS' | 'STAFF_NOT_WORKING'
```

### Null Handling

```typescript
// Explicit null checks
if (staff !== null) { ... }

// Optional chaining
const name = appointment?.patient?.name

// Nullish coalescing
const phone = patient.phone ?? 'Not provided'
```

---

## Backend Standards

### Database Queries

```typescript
// Name pattern: verb + Entity + modifier
getStaffById(id: number)
getStaffBySpecialty(specialty: string)
getAllActiveStaff()
createAppointment(data: CreateAppointmentInput)
updateAppointmentStatus(id: number, status: AppointmentStatus)
```

### Agent Tools Pattern

```typescript
import { tool } from 'ai'
import { z } from 'zod'

export const myTool = tool({
  description: 'Clear description for AI',
  parameters: z.object({
    param: z.string().describe('Description for AI'),
  }),
  execute: async ({ param }) => {
    try {
      // Tool logic
      return { success: true, data: result }
    } catch (error) {
      return {
        success: false,
        errorType: 'DATABASE_ERROR',
        message: 'Failed to complete',
        suggestion: 'Try again or call the clinic',
        retryable: true
      }
    }
  },
})
```

### Structured Error Types

```typescript
interface ToolError {
  success: false
  errorType: 'NOT_FOUND' | 'NO_SLOTS' | 'STAFF_NOT_WORKING' |
             'VALIDATION_ERROR' | 'API_ERROR' | 'DATABASE_ERROR'
  message: string
  suggestion?: string
  retryable: boolean
}
```

### Service Result Patterns

```typescript
// Calendar
interface CalendarResult {
  slots: string[]
  fromCalendar: boolean  // true = real API, false = mock
  error?: string
}

// Email
interface EmailResult {
  success: boolean
  sent: boolean  // true = actually sent
  error?: string
}

// Telegram
interface TelegramResult {
  success: boolean
  sent: boolean  // true = actually sent
  error?: string
}
```

### Retry Logic

```typescript
import { withRetry, checkServiceConfig } from '../utils/retry.js'

const config = checkServiceConfig(['GOOGLE_CALENDAR_ID'])
if (!config.configured) {
  return { slots: mockSlots, fromCalendar: false }
}

const result = await withRetry(async () => {
  // API call
}, { maxRetries: 3, delayMs: 1000 })
```

---

## Frontend Standards

### Component Structure

```tsx
// 1. Imports
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { buttonVariants } from './constants'
import type { ButtonProps } from './types'

// 2. Component
export const Button = ({ children, variant, className }: ButtonProps) => {
  // 2a. Hooks
  const [loading, setLoading] = useState(false)

  // 2b. Handlers (arrow functions)
  const handleClick = () => { ... }

  // 2c. Render
  return (
    <button className={cn(buttonVariants({ variant }), className)}>
      {children}
    </button>
  )
}
```

### CVA Pattern (class-variance-authority)

```tsx
// constants.ts
import { cva } from 'class-variance-authority'

export const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-lg font-medium transition-all',
  {
    variants: {
      variant: {
        primary: 'bg-clinic-teal text-white hover:bg-clinic-teal-dark',
        secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200',
        outline: 'border-2 border-clinic-teal text-clinic-teal',
      },
      size: {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2 text-sm',
        lg: 'px-6 py-3 text-base',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
)
```

### Array Pattern for Repeated Components

```tsx
// Good - Array pattern
const items = [
  { icon: MapPin, label: 'Address', value: address },
  { icon: Phone, label: 'Phone', value: phone },
]

return items.map((item) => (
  <ContactItem key={item.label} {...item} />
))

// Bad - Repetitive
return (
  <>
    <ContactItem icon={MapPin} label="Address">{address}</ContactItem>
    <ContactItem icon={Phone} label="Phone">{phone}</ContactItem>
  </>
)
```

### Tailwind Class Order

```tsx
// Order: Layout → Spacing → Sizing → Colors → Effects → States
<div className="flex items-center gap-4 p-4 w-full bg-white rounded-lg shadow-sm hover:shadow-md">
```

### Mobile-First Responsive

```tsx
// Good - Mobile first
<div className="p-4 md:p-6 lg:p-8">
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">

// Bad - Desktop first
<div className="p-8 sm:p-4">
```

### i18n Pattern

```tsx
// i18n/en.ts
export const en = {
  hero: {
    title: 'Your Smile,',
    titleHighlight: 'Our Priority',
    cta: 'Book Now',
  },
}

// Component
import { useTranslation } from '@/i18n'

const { t } = useTranslation()
return <h1>{t.hero.title}</h1>
```

### Import Order

```tsx
// 1. React and third-party
import { useState } from 'react'

// 2. Components
import { Button } from '@/components/ui/Button'

// 3. Hooks
import { useMediaQuery } from '@/hooks/useMediaQuery'

// 4. Utils
import { cn } from '@/lib/utils'

// 5. Constants
import { SERVICES } from '@/constants/services'

// 6. Types
import type { Service } from '@/types/clinic'
```

---

## Git Conventions

### Commit Messages

```
feat: Add staff-based booking system
fix: Resolve Telegram notification delay
refactor: Extract calendar service
docs: Update TASKS.md
style: Format code with prettier
test: Add appointment creation tests
chore: Update dependencies
```

### Branch Names

```
feature/staff-scheduling
fix/telegram-webhook
refactor/database-schema
```

---

## Verification Checklist

Before committing:

```bash
# Backend
cd server && npx tsc --noEmit
cd server && npm run build

# Frontend
cd client && npx tsc --noEmit
cd client && npm run build

# Test
cd server && npx tsx src/test-tools.ts
```
