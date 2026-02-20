# SmartClinic Agent - Project Tasks

## Current Status: Phase 1 Complete - Ready for Testing

## Cost Rules (Active)
- Use gemini-2.5-flash (paid tier)
- No speculative API calls
- Max 1 retry on failure
- Batch related operations

---

## What's Connected vs Mocked

| Component | Status | Notes |
|-----------|--------|-------|
| SQLite DB | ✅ Real | Staff, services, appointments |
| Gemini AI | ✅ Real | Paid API (gemini-2.5-flash) |
| Telegram Bot | ✅ Real | Notifications working |
| Google Calendar | 🔶 Mocked | Returns mock slots |
| Email | 🔶 Mocked | Logs to console |

---

## Completed

### Phase 1: UI Updates ✅
- [x] Update Services.tsx with 10 real services + categories
- [x] Update About.tsx with 6 real staff members
- [x] Update Home.tsx with clinic branding and info
- [x] Fix all "Opek" → "Ofeck" throughout codebase
- [x] Update phone (03-5467032) and address (Basel 35, Tel Aviv)
- [x] Create SPEC.md project specification
- [x] Update Navbar, Footer, ChatWidget with correct names

### Phase 0: Backend ✅
- [x] Staff-based booking logic
- [x] Database schema with staff/services relationships
- [x] Agent tools for specialist matching
- [x] System prompt with clinic info
- [x] Telegram notifications with staff name

---

## Pending

### Phase 2: Testing (Current)
- [ ] Test full booking flow in browser
- [ ] Verify staff images display (after adding photos)
- [ ] Test Telegram approval/decline flow
- [ ] Test different services route to correct specialist

### Phase 3: Google Calendar Integration
- [ ] Set up Google Cloud project
- [ ] Create service account with Calendar API
- [ ] Share clinic calendar with service account
- [ ] Update calendar.ts to use real API
- [ ] Test real availability checking

### Phase 4: Email Integration
- [ ] Set up Resend account
- [ ] Add RESEND_API_KEY to environment
- [ ] Update email.ts to send real emails
- [ ] Test confirmation emails

### Phase 5: Deployment
- [ ] Deploy client to Vercel
- [ ] Deploy server to Railway/Render
- [ ] Configure production environment variables
- [ ] Set up Telegram webhook URL
- [ ] Final production testing

---

## Quick Reference

### Staff Images Location
```
client/public/images/staff/
├── dr-ilan-ofeck.jpg
├── katy-fridman.jpg
├── dr-sahar-nadel.jpg
├── dr-maayan-granit.jpg
├── dr-dan-zitoni.jpg
└── shir-formoza.jpg
```

### Key Files
- `server/src/agent/index.ts` - System prompt
- `server/src/agent/tools/index.ts` - AI tools
- `server/src/db/index.ts` - Database schema + seed data
- `server/src/routes/chat.ts` - Chat endpoint + model config

### Run Locally
```bash
# Terminal 1 - Server
cd server && npm run dev

# Terminal 2 - Client
cd client && npm run dev
```
