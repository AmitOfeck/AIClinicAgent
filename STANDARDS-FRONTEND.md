# Frontend Code Standards & Conventions

> SmartClinic Agent - Dr. Ilan Ofeck Dental Clinic

---

## UI Component Best Practices

### Core Principles

| Principle | Description |
|-----------|-------------|
| **Single Responsibility** | Each component should have one clear purpose and do it well |
| **Reusability** | Design components to be reused across different contexts with configurable props |
| **Composability** | Build complex UIs by combining smaller, simpler components |
| **Clear Interface** | Define explicit, well-documented props with sensible defaults |
| **Encapsulation** | Keep internal implementation details private, expose only necessary APIs |
| **Consistent Naming** | Use clear, descriptive names that indicate the component's purpose |
| **State Management** | Keep state as local as possible; lift it up only when needed |
| **Minimal Props** | Keep props manageable; if many props needed, consider composition |
| **Documentation** | Document component usage, props, and provide examples |

---

## File Structure & Organization

### Folder Structure

```
client/src/
├── components/
│   ├── ui/                    # Reusable UI primitives
│   │   ├── Button/
│   │   │   ├── index.ts       # Re-exports
│   │   │   ├── Button.tsx     # Main component
│   │   │   ├── constants.ts   # Variants, styles
│   │   │   └── types.ts       # Props interface
│   │   ├── Card/
│   │   ├── Badge/
│   │   ├── Input/
│   │   └── Modal/
│   ├── chat/                  # Chat feature components
│   │   ├── ChatWidget/
│   │   │   ├── index.ts
│   │   │   ├── ChatWidget.tsx
│   │   │   ├── ChatHeader.tsx
│   │   │   ├── ChatMessages.tsx
│   │   │   ├── ChatInput.tsx
│   │   │   ├── constants.ts
│   │   │   └── types.ts
│   │   └── ToolIndicator/
│   ├── clinic/                # Clinic-specific components
│   │   ├── Navbar/
│   │   ├── Footer/
│   │   ├── ServiceCard/
│   │   ├── TeamMember/
│   │   └── StatsCard/
│   └── layout/                # Layout components
│       ├── PageLayout.tsx
│       ├── Section.tsx
│       └── Container.tsx
├── pages/
│   ├── Home/
│   │   ├── index.ts
│   │   ├── Home.tsx
│   │   ├── HeroSection.tsx
│   │   ├── FeaturesSection.tsx
│   │   ├── ServicesPreview.tsx
│   │   ├── VideoSection.tsx
│   │   ├── LocationSection.tsx
│   │   └── constants.ts
│   ├── Services/
│   └── About/
├── constants/                 # Shared constants
│   ├── clinic.ts              # Clinic info, hours, contact
│   ├── services.ts            # Services data
│   ├── team.ts                # Staff data
│   └── colors.ts              # Color mappings
├── types/                     # Shared TypeScript types
│   ├── clinic.ts
│   ├── chat.ts
│   └── api.ts
├── utils/                     # Utility functions
│   ├── cn.ts                  # Class name utility
│   ├── formatting.ts          # Date, phone, text
│   └── validation.ts          # Form validation
├── hooks/                     # Custom React hooks
│   ├── useChat.ts
│   └── useMediaQuery.ts
└── lib/                       # Third-party integrations
    └── api.ts
```

### Folder per Component Rules

| Scenario | Approach |
|----------|----------|
| Simple atomic component | Single file (`Button.tsx`) |
| Component with 2+ sub-components | Folder with separate files |
| Component with variants | Add `constants.ts` for CVA/variants |
| Component with complex types | Add `types.ts` |
| Component > 150 lines | Extract sub-components |

### Example Component Folder

```
Button/
├── index.ts           # Re-exports
├── constants.ts       # CVA variants, static data
├── types.ts           # Props interface
├── Button.tsx         # Main component
└── Button.test.tsx    # Tests (optional)
```

---

## Constants & Data Extraction

### constants.ts Pattern

```tsx
// constants/services.ts
import { Service } from '@/types/clinic';

export const SERVICES: Service[] = [
  {
    id: 'dental-hygiene',
    name: 'Dental Hygiene & Cleaning',
    nameHebrew: 'ניקוי שיניים',
    category: 'Preventive',
    duration: 45,
    description: 'Professional cleaning...',
    includes: ['Tartar removal', 'Polishing'],
    staff: ['Katy Fridman', 'Shir Formoza'],
  },
  // ...
];

export const CATEGORY_COLORS: Record<string, string> = {
  Preventive: 'bg-green-100 text-green-800',
  Aesthetic: 'bg-purple-100 text-purple-800',
  Restorative: 'bg-blue-100 text-blue-800',
  Endodontics: 'bg-orange-100 text-orange-800',
  Surgery: 'bg-red-100 text-red-800',
};
```

### What Goes in constants.ts

| Include | Exclude |
|---------|---------|
| Static data arrays | Dynamic/computed values |
| CVA variants | Event handlers |
| Color mappings | State variables |
| Configuration objects | API calls |
| Icon mappings | Side effects |

---

## Helper Function Extraction (utils/)

### Extract Pure Functions

```tsx
// utils/formatting.ts

export const formatPhoneNumber = (phone: string): string => {
  return phone.replace(/(\d{2})(\d{3})(\d{4})/, '$1-$2-$3');
};

export const formatDuration = (minutes: number): string => {
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
};

export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-IL', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
};
```

### Extraction Criteria

| Extract to utils/ | Keep in component |
|-------------------|-------------------|
| Pure mapping functions | Event handlers |
| Formatting logic | Callbacks using state |
| Validation helpers | useMemo/useCallback wrappers |
| Config object builders | Anything with side effects |

---

## Function Standards

### Always Use Arrow Functions

```tsx
// ✅ Good - Arrow function component
const Button = ({ children, onClick }: ButtonProps) => {
  return <button onClick={onClick}>{children}</button>;
};

// ✅ Good - Arrow function handler
const handleClick = (e: React.MouseEvent) => {
  e.stopPropagation();
  onRemove();
};

// ❌ Bad - Function declaration
function handleClick(e: React.MouseEvent) {
  e.stopPropagation();
  onRemove();
}
```

### Extract Inline Handlers

```tsx
// ✅ Good - Extracted handler
const handleRemove = (e: React.MouseEvent) => {
  e.stopPropagation();
  onRemove();
};

return <button onClick={handleRemove}>Remove</button>;

// ❌ Bad - Inline handler
return (
  <button
    onClick={(e) => {
      e.stopPropagation();
      onRemove();
    }}
  >
    Remove
  </button>
);
```

### Exception: Simple Single-Expression Callbacks

```tsx
// ✅ Acceptable for simple cases
<button onClick={() => setOpen(true)}>Open</button>
{items.map((item) => <Item key={item.id} {...item} />)}
```

---

## Component Structure

### Standard Component Template

```tsx
// 1. Imports
import { useState, useCallback } from 'react';
import { cn } from '@/utils/cn';
import { BUTTON_VARIANTS } from './constants';
import type { ButtonProps } from './types';

// 2. Component
export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  onClick,
  className,
}: ButtonProps) => {
  // 2a. Hooks
  const [isLoading, setIsLoading] = useState(false);

  // 2b. Handlers (extracted, arrow functions)
  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      if (disabled || isLoading) return;
      onClick?.(e);
    },
    [disabled, isLoading, onClick]
  );

  // 2c. Render
  return (
    <button
      className={cn(BUTTON_VARIANTS[variant], BUTTON_VARIANTS[size], className)}
      onClick={handleClick}
      disabled={disabled || isLoading}
    >
      {children}
    </button>
  );
};

export default Button;
```

### Types File

```tsx
// types.ts
export interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
}
```

### Constants File

```tsx
// constants.ts
export const BUTTON_VARIANTS = {
  primary: 'bg-clinic-teal text-white hover:bg-clinic-teal-dark',
  secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200',
  outline: 'border border-clinic-teal text-clinic-teal hover:bg-clinic-teal/10',
  ghost: 'text-gray-600 hover:bg-gray-100',
} as const;

export const BUTTON_SIZES = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
} as const;
```

---

## Styling Best Practices

### Tailwind CSS Rules

```tsx
// ✅ Good - Semantic class ordering
<div className="flex items-center gap-4 p-4 w-full bg-white rounded-lg shadow-sm hover:shadow-md">

// Order:
// 1. Layout (flex, grid, position)
// 2. Spacing (p, m, gap)
// 3. Sizing (w, h)
// 4. Colors (bg, text, border)
// 5. Effects (shadow, rounded)
// 6. States (hover, focus)
```

### Avoid Inline Styles

```tsx
// ✅ Good - Tailwind class
<div className="mt-4">

// ❌ Bad - Inline style
<div style={{ marginTop: '16px' }}>
```

### Use cn() for Conditional Classes

```tsx
import { cn } from '@/utils/cn';

<div
  className={cn(
    'base-classes',
    isActive && 'active-classes',
    variant === 'primary' && 'primary-classes'
  )}
>
```

---

## Responsive Design

### Mobile-First Approach

```tsx
// ✅ Good - Mobile first, then enhance
<div className="p-4 md:p-6 lg:p-8">
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

// ❌ Bad - Desktop first, then reduce
<div className="p-8 sm:p-4">
```

### Standard Breakpoints

| Breakpoint | Width | Usage |
|------------|-------|-------|
| `sm` | 640px | Large phones |
| `md` | 768px | Tablets |
| `lg` | 1024px | Laptops |
| `xl` | 1280px | Desktops |
| `2xl` | 1536px | Large screens |

### Touch-Friendly Design

```tsx
// Minimum tap target: 44x44px
<button className="min-w-[44px] min-h-[44px] p-3">
```

---

## Type Safety

### Shared Types

```tsx
// types/clinic.ts
export interface Service {
  id: string;
  name: string;
  nameHebrew?: string;
  category: ServiceCategory;
  duration: number;
  description: string;
  includes: string[];
  staff: string[];
}

export type ServiceCategory =
  | 'Preventive'
  | 'Aesthetic'
  | 'Restorative'
  | 'Endodontics'
  | 'Surgery';

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  specialty?: string;
  bio: string;
  image: string;
  services: string[];
}
```

### Props Types

```tsx
// Always define explicit prop types
interface ServiceCardProps {
  service: Service;
  onBook?: (serviceId: string) => void;
  className?: string;
}
```

---

## Hook Best Practices

### Custom Hooks

```tsx
// hooks/useMediaQuery.ts
import { useState, useEffect } from 'react';

export const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    setMatches(media.matches);

    const listener = (e: MediaQueryListEvent) => setMatches(e.matches);
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, [query]);

  return matches;
};
```

### Hook Return Types

```tsx
// Export return type interface for complex hooks
export interface UseChatReturn {
  messages: Message[];
  sendMessage: (content: string) => Promise<void>;
  isLoading: boolean;
  error: Error | null;
  clearMessages: () => void;
}

export const useChat = (): UseChatReturn => {
  // ...
};
```

---

## Accessibility

### ARIA Labels

```tsx
<button aria-label="Open chat">
<nav aria-label="Main navigation">
<section aria-labelledby="services-heading">
  <h2 id="services-heading">Our Services</h2>
</section>
```

### Keyboard Navigation

```tsx
// Ensure focusable elements are keyboard accessible
<button onKeyDown={(e) => e.key === 'Enter' && handleClick()}>
```

### Screen Reader Text

```tsx
// Visually hidden but accessible
<span className="sr-only">Opens in new tab</span>
```

---

## Verification Checklist

Before committing frontend changes:

- [ ] `npm run lint` - No lint errors
- [ ] `npm run build` - Build succeeds
- [ ] `npx tsc --noEmit` - No TypeScript errors
- [ ] Test on mobile viewport (375px)
- [ ] Test on tablet viewport (768px)
- [ ] Test on desktop viewport (1280px)
- [ ] Check accessibility (keyboard nav, screen reader)
- [ ] Verify all handlers are extracted (no complex inline)
- [ ] Confirm constants are in separate files
- [ ] Ensure types are properly defined

---

## File Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Components | PascalCase | `ChatWidget.tsx` |
| Pages | PascalCase | `Home.tsx` |
| Hooks | camelCase with `use` prefix | `useMediaQuery.ts` |
| Utils | camelCase | `formatting.ts` |
| Constants | camelCase | `services.ts` |
| Types | camelCase | `clinic.ts` |
| Test files | `.test.tsx` suffix | `Button.test.tsx` |

---

## Import Order

```tsx
// 1. React and third-party
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// 2. Components
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

// 3. Hooks
import { useMediaQuery } from '@/hooks/useMediaQuery';

// 4. Utils
import { cn } from '@/utils/cn';
import { formatDate } from '@/utils/formatting';

// 5. Constants
import { SERVICES } from '@/constants/services';

// 6. Types
import type { Service } from '@/types/clinic';

// 7. Styles (if any)
import './styles.css';
```
