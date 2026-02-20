# SmartClinic Agent - Project Tasks

## Current Status: Phase 1 - UI Updates

## Cost Rules (Active)
- No speculative API calls
- Max 1 retry on failure
- Batch related operations
- Use gemini-2.5-flash (paid tier)

---

## What's Connected vs Mocked

| Component | Status | Notes |
|-----------|--------|-------|
| SQLite DB | Real | Staff, services, appointments |
| Gemini AI | Real | Paid API |
| Telegram Bot | Real | Notifications working |
| Google Calendar | Mocked | Returns fake slots |
| Email | Mocked | Logs to console |
| Staff Schedules | Mock Data | Real structure, demo hours |

---

## Phases

### Phase 1: UI Updates (Done)
- [x] Update Services.tsx with real 10 services
- [x] Update About.tsx with real 6 staff members
- [x] Added category badges and staff info to services
- [x] Added image fallback for missing staff photos

### Phase 2: Local Testing
- [ ] Test full booking flow end-to-end
- [ ] Verify Telegram notifications with staff name
- [ ] Test different services route to correct staff

### Phase 3: Google Calendar Integration
- [ ] Set up Google Cloud project
- [ ] Create service account
- [ ] Share calendar with service account
- [ ] Update calendar.ts to use real API
- [ ] Test real availability checking

### Phase 4: Email Integration
- [ ] Choose provider (Resend/SendGrid)
- [ ] Set up API keys
- [ ] Update email.ts service
- [ ] Test confirmation emails

### Phase 5: Deployment
- [ ] Deploy client to Vercel
- [ ] Deploy server to Railway/Render
- [ ] Set up environment variables
- [ ] Configure Telegram webhook URL
- [ ] Final testing in production

---

## Staff-Service Mappings (Reference)

| Staff | Services |
|-------|----------|
| Dr. Ilan Ofeck | Restorations, Veneers, Crowns, Botox |
| Katy Fridman | Hygiene, Whitening |
| Shir Formoza | Hygiene, Whitening |
| Dr. Maayan Granit | Root Canal |
| Dr. Sahar Nadel | Implants, Periodontal Surgery |
| Dr. Dan Zitoni | Restorations |

---

## Files Modified This Session
- server/src/db/index.ts - Schema + seed data
- server/src/db/staff.ts - New file
- server/src/db/services.ts - New file
- server/src/db/appointments.ts - Added staff_id
- server/src/agent/tools/index.ts - Staff-based tools
- server/src/agent/index.ts - Updated system prompt
- server/src/services/telegram.ts - Added staff name
- server/src/routes/chat.ts - Model update
