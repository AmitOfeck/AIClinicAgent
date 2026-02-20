# SmartClinic Agent - Project Specification

## Overview
AI-powered dental clinic booking assistant for **Dr. Ilan Ofeck's Dental Clinic** in Tel Aviv, Israel. The system uses an agentic AI approach to help patients book appointments with the right specialist based on their treatment needs.

## Clinic Information
- **Name:** Dr. Ilan Ofeck Dental Clinic
- **Address:** Basel 35, Tel Aviv, Israel
- **Phone:** 03-5467032
- **Website:** dr-ofeck.co.il
- **Hours:** Sun-Thu 8:00-18:00, Fri 8:00-13:00, Sat Closed

---

## Tech Stack

### Frontend (client/)
- **Framework:** React 18 + TypeScript
- **Build:** Vite
- **Styling:** Tailwind CSS
- **Routing:** React Router v6
- **Icons:** Lucide React

### Backend (server/)
- **Runtime:** Node.js + TypeScript
- **Framework:** Express.js
- **Database:** SQLite (better-sqlite3)
- **AI:** Vercel AI SDK + Google Gemini 2.5 Flash
- **Notifications:** Telegram Bot API

---

## Architecture

### Agentic AI Pattern
The system uses ReAct (Reasoning + Acting) pattern with:
- **maxSteps: 10** - Up to 10 reasoning cycles per request
- **Tool Use** - AI calls tools to fetch data and perform actions
- **Self-Correction** - AI handles errors and suggests alternatives

### Tools Available to AI
| Tool | Purpose |
|------|---------|
| `getServices` | List all dental services |
| `getStaffForService` | Find specialists for a treatment |
| `checkAvailability` | Check staff schedule for a date |
| `createAppointment` | Book pending appointment |
| `getClinicTeam` | Get team information |
| `searchKnowledgeBase` | Search clinic FAQ |
| `getPatientHistory` | Lookup returning patients |
| `savePatientPreference` | Store patient preferences |

### Booking Flow
1. Patient requests appointment via chat
2. AI identifies the service needed
3. AI finds qualified staff using `getStaffForService`
4. AI checks staff availability using `checkAvailability`
5. AI collects patient info (name, email)
6. AI creates pending appointment using `createAppointment`
7. Telegram notification sent to clinic owner
8. Owner approves/declines via Telegram buttons
9. Patient receives email confirmation

---

## Staff & Services

### Team (6 members)
| Name | Role | Services |
|------|------|----------|
| Dr. Ilan Ofeck | Chief Dentist | Restorations, Veneers, Crowns, Botox |
| Katy Fridman | Hygienist | Hygiene, Whitening |
| Shir Formoza | Hygienist | Hygiene, Whitening |
| Dr. Maayan Granit | Endodontist | Root Canal |
| Dr. Sahar Nadel | Oral Surgeon | Implants, Periodontal Surgery |
| Dr. Dan Zitoni | Dentist | Restorations |

### Services (10 treatments)
| Category | Services |
|----------|----------|
| Preventive | Dental Hygiene & Cleaning |
| Aesthetic | Teeth Whitening, Composite Veneers, Porcelain Veneers, Botox |
| Restorative | Composite Restorations, Porcelain Crowns |
| Endodontics | Root Canal Treatment |
| Surgery | Periodontal Surgery, Dental Implants |

---

## Data Model

### Database Tables
```
staff           - Team members with working_hours JSON
services        - Treatments with duration, category
staff_services  - Many-to-many relationship
appointments    - Bookings with status (PENDING/APPROVED/DECLINED/CANCELLED)
patient_preferences - Long-term memory for returning patients
conversations   - Chat history storage
```

---

## Integration Status

| Component | Status | Implementation |
|-----------|--------|----------------|
| SQLite Database | ✅ Real | Local file storage |
| Gemini AI | ✅ Real | Paid API (gemini-2.5-flash) |
| Telegram Bot | ✅ Real | @DRIlanOfeckClinic_bot |
| Google Calendar | 🔶 Mocked | Returns mock availability |
| Email (Resend) | 🔶 Mocked | Logs to console |

---

## Cost Optimization Rules
1. Use gemini-2.5-flash (paid tier) - ~$0.075/M input tokens
2. No speculative API calls
3. Max 1 retry on failure
4. System prompt ~1900 tokens per request

---

## File Structure
```
AIClinicAgent/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── chat/       # ChatWidget, Messages, Input
│   │   │   └── clinic/     # Navbar, Footer
│   │   └── pages/          # Home, Services, About
│   └── public/
│       └── images/staff/   # Staff photos
├── server/                 # Express backend
│   ├── src/
│   │   ├── agent/          # AI system prompt + tools
│   │   ├── db/             # SQLite models
│   │   ├── routes/         # API endpoints
│   │   └── services/       # Telegram, Email, Calendar
│   └── data/               # SQLite database file
├── TASKS.md                # Project task tracking
└── SPEC.md                 # This file
```

---

## Environment Variables
```env
# Server (.env)
GOOGLE_GENERATIVE_AI_API_KEY=   # Gemini API key
TELEGRAM_BOT_TOKEN=             # Telegram bot token
TELEGRAM_OWNER_CHAT_ID=         # Clinic owner's Telegram ID
GOOGLE_SERVICE_ACCOUNT_KEY=     # (Optional) Calendar integration
GOOGLE_CALENDAR_ID=             # (Optional) Calendar ID
RESEND_API_KEY=                 # (Optional) Email service
```

---

## Deployment Plan
1. **Frontend:** Vercel (static hosting)
2. **Backend:** Railway or Render (Node.js)
3. **Database:** SQLite file on server (or upgrade to PostgreSQL)
4. **Telegram Webhook:** Configure URL after deployment
