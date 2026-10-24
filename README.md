# CivicFix 🛡️

> **Bridging Communities and Solutions** — An AI-Assisted CivicTech Platform connecting citizens and local municipalities to report, triage, and track local infrastructure defects (potholes, streetlights, garbage overflow, water leaks).
>
> **Updated with Ground-Level Google Street View Triage, Explainable Vulnerable Road User Safety Priority Scoring, Automated Duplicate Suggestions, Resolution Verification with Before/After Photos, Recurring Issue Detection & Municipal Performance Analytics, Multilingual Voice Reporting (Hindi, Punjabi, English), Privacy Protection, Rate Limiting, Offline Draft Saving, Secure User Authentication & Role-Based Access Control (RBAC), and Sovereign Republic of India Geographic Boundary Enforcement.**

Built with **Next.js 14 (App Router)**, **TypeScript**, **Tailwind CSS**, **Web Crypto API (Salted SHA-256)**, and the **Google Maps Embed API Street View Mode / Street View Metadata API**.

---

## 🌟 Upgraded CivicTech Improvements (In Order of Implementation)

### 1. 🔐 User Authentication & Role-Based Access Control (RBAC)
- **Complete Auth Flow**: Sign Up (`/signup`), Login (`/login`), Logout, Forgot Password (`/forgot-password`), and Password Reset (`/reset-password`).
- **Cryptographic Password Security**: Uses the native **Web Crypto API** with salted SHA-256 hashing. Passwords are never stored or transmitted in plaintext.
- **Role Separation (`citizen` vs `admin`)**:
  - **Citizen Role**: Can submit reports, manage "My Submissions" vs public reports, corroborate issues, and dispute resolved repairs. Citizens **cannot** assign themselves Admin or alter municipal ticket statuses.
  - **Admin Role**: Requires the municipal security authorization code (`CIVIC_ADMIN_2026`) during registration to prevent self-elevation. Protected route `/admin` is strictly gated; unauthorized citizens receive an explicit access barrier.
- **Dual Authentication Engine**: Seamlessly delegates to **Supabase Auth** when `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are provided, with an autonomous local Web Crypto session store fallback.
- **Pre-Configured Instant Test Accounts**:
  - 👤 **Citizen**: `citizen@civicfix.in` / `Citizen@123`
  - 🏛️ **Municipal Admin**: `admin@municipal.gov.in` / `Admin@123`

### 2. 🇮🇳 Sovereign Republic of India Geographic Boundary Enforcement
- **India-Only Geodesy**: Multi-polygon boundary validator (`isWithinIndia`) strictly limits reporting to the sovereign territory of the Republic of India (including Andaman & Nicobar and Lakshadweep), while mathematically excluding offshore oceanic expanses and neighboring territories. Foreign coordinates (e.g. San Francisco, London, Dubai, Lahore) are immediately blocked with informative diagnostic guidance.
- **All 28 States & 8 Union Territories**: Full administrative division database with district dropdown hierarchy.
- **6-Digit Indian PIN Code Validation**: Validates postal codes using `^[1-9][0-9]{5}$` (rejecting 0-prefixed, 5-digit, or non-numeric entries).
- **Normalized Address Formatting**: Standardizes reports into postal format (`Street, City, District, State - PIN, India`).
- **Verified Indian Metro Presets**: 1-click test scenarios in New Delhi (Connaught Place), Bengaluru (MG Road), Mumbai (Marine Drive), Chandigarh, Ludhiana, Kolkata, and Pune.
- **Google Street View for India**: Strictly loads contextual Street View panoramas for validated Indian locations only when coverage exists; operates transparently without Street View when unavailable.

### 3. 🤖 AI-Assisted Photo & Description Validation with Suggestions & Human Review
- **Automatic Category & Severity Suggestions**: Analyzes visual evidence and description to suggest the most appropriate defect category and severity tier with confidence metrics ($0-100\%$).
- **One-Click Triage Acceptance**: Citizens can accept recommended categories with a single click in the reporting flow.
- **Human Review Routing (`review_needed`)**: Flagged tickets (low keyword alignment, brief observation, or ambiguous photo) are routed to municipal supervisor review prior to field crew dispatch.
- **Dual Engine Transparency**: Uses **Google Gemini 1.5 Pro / Flash** multimodal analysis when `GEMINI_API_KEY` is set; transparently displays `Deterministic Triage Heuristics (Demo Engine)` when running offline or in demo mode.

### 2. 👥 Duplicate Incident Suggestions with Image Similarity
- **Multi-Factor Matching**: Combines **Haversine geodesy** (<250m), issue category match, incident age recency (past 14 days), text token similarity, and **photo evidence similarity**.
- **One-Click Corroboration (`+1 Me Too!`)**: Instead of cluttering the municipal backlog with duplicate complaints, citizens can corroborate the existing ticket, escalating its community priority weight.

### 3. ⚖️ Explainable Safety-Priority Score (Vulnerable Road Users & Recurrence)
- **Objective Multi-Factor Formula (1-100)**:
  - **Base Structural Hazard (max 35 pts)**: Structural danger of defect (e.g. collapsed sewer grate vs cosmetic curb chip).
  - **Public Exposure & Arterial Zoning (max 20 pts)**: Hospital routes, transit avenues, downtown density.
  - **Vulnerable Road Users (VRUs) Protection (max 15 pts)**: Explicit protection points for elementary school zones, pedestrian crosswalks, bike lanes, wheelchair ramps, and senior center routes.
  - **Duration Escalation (max 20 pts)**: Automatically increases by $+2.5$ points per day an unaddressed ticket languishes.
  - **Community Corroboration Curve (max 10 pts)**: Diminishing-returns logarithmic curve ($2 \times \log_2(1 + \text{votes})$), guaranteeing that viral upvoting cannot override structural safety.
  - **Chronic Recurrence Escalation (max 10 pts)**: $+10$ points penalty for defects repeating at the same coordinates.
- **Four Clear Priority Tiers**: 🔴 **P1 Critical** (80-100), 🟠 **P2 Urgent** (60-79), 🟡 **P3 Standard** (40-59), 🟢 **P4 Routine** (1-39).
- **Interactive Scorecard**: Detailed factor breakdown accessible on any ticket badge.

### 4. 🔍 Resolution Verification with Before & After Photos & Reopen Workflow
- **Before & After Photographic Comparison**: When municipal crews resolve a ticket, they attach an after-repair photo shown side-by-side with the citizen's intake photo.
- **Accountability Metadata**: Records supervisor sign-off, completion timestamp, and turnaround repair hours.
- **Citizen Feedback & Reopen Workflow**:
  - Citizens can click **"Verified Fixed"** to confirm work quality.
  - If a patch washed away or work was substandard, citizens click **"Dispute / Reopen"** with specific feedback notes.
  - Disputed tickets transition to status `'reopened'`, re-entering municipal dispatch with urgent SLA.

### 5. 🔄 Recurring-Issue Detection & Municipal Performance Analytics
- **Chronic Failure Detection**: Detects defects occurring within **80 meters** of previously resolved or reported issues within **90 days**.
- **Chronic Defect Badge & History**: Marks tickets with `⚠️ Chronic Defect (x3 in 90 days)`, detailing past repair dates and repair lifespans.
- **Municipal Performance Analytics Dashboard**: Full operational view in `/admin` featuring:
  - **Mean Time to Resolution (MTTR)** across departments.
  - **SLA Compliance Rate (%)**.
  - **Chronic Recurrence Rate (%)**.
  - **Citizen Dispute Rate (%)**.
  - **7-Day Intake vs Outflow Throughput Chart** (Recharts line graph).
  - **Defect Volume vs Chronic Recurrence Distribution** (Recharts bar graph).
  - **Department-by-Department SLA Table**.

### 6. 🎙️ Multilingual Voice-Based Reporting (Hindi, Punjabi, English)
- **Web Speech Dictation**: Direct in-browser microphone dictation powered by `SpeechRecognition` / `webkitSpeechRecognition`.
- **Supported Languages**:
  - 🇮🇳 **English (India)** (`en-IN`)
  - 🇮🇳 **हिन्दी (Hindi)** (`hi-IN`)
  - 🇮🇳 **ਪੰਜਾਬੀ (Punjabi)** (`pa-IN`)
- **Editable Transcription**: Transcribed speech streams directly into the description box and remains **100% editable** before submission.
- **Quick-Dictate Templates**: One-click phrases in English, Hindi, and Punjabi for immediate testing even on browsers without microphone access.

### 7. 🛡️ Privacy Protection, Rate Limiting, & Low-Connectivity Draft Saving
- **PII Anonymization**: Citizen names are redacted on public feeds (e.g. `Alexander Chen` $\rightarrow$ `Alex C. (Resident)`), phone numbers and emails are masked.
- **Report Rate Limiting**: Enforces a maximum of 3 submissions per 5-minute window per device to prevent denial-of-service spam, with a clear cooldown countdown and a demo bypass button.
- **Offline / Low-Connectivity Draft Protection**:
  - Automatically detects online/offline status (`navigator.onLine`).
  - Auto-saves photo data, coordinates, category, and description to browser storage.
  - Restores unsaved drafts upon return, preventing lost field reports.

---

## 📸 Google Street View Integration (Zero Overhead Map Interface)

- **No Overhead Maps**: Leaflet, map tiles, and overhead satellite maps remain completely excluded.
- **Official Google Maps Embed API Street View Mode**: Interactive 360° ground panorama embedded at exact defect coordinates (`lat`, `lng`).
- **Contextual Baseline Notice**: Clearly labeled with capture date (e.g., *"Imagery captured Aug 2023"*). The system explicitly notifies users that Street View illustrates historical road conditions and is never presented as proof of the present defect.
- **Graceful Fallback**: If an issue is on an unmapped pedestrian walkway, private easement, or no API key is present, the app explains this clearly and displays the citizen's uploaded live photo evidence and GPS telemetry.

---

## 🧪 Automated Test Suite

A standalone Node.js test suite is included in `tests/civicfix.test.mjs`:

```bash
npm test
```

### 24 Verified Automated Tests:
1. **Duplicate Detection**: Accurately flags tickets within 50m of matching category; ignores distant reports (>1km).
2. **Safety Priority Scoring**: Computes P1 Critical score for school zone water leaks; verifies community votes cannot overwhelm base structural hazards.
3. **Invalid Uploads**: Rejects empty payloads, catches corrupt base64 strings, and routes low-confidence descriptions to human review.
4. **Unavailable Street View**: Fallback triggers cleanly without falsely asserting imagery exists.
5. **Denied GPS Permission**: Recovers gracefully with manual address input guidance.
6. **Resolution Dispute**: Successfully transitions resolved ticket to `reopened` and records dispute audit trail.
7. **Privacy Anonymization**: Redacts full civilian names into anonymized public formats.
8. **Recurring-Issue Detection**: Flags chronic failure within 80m and calculates recurrence count.
9. **Vulnerable Road User (VRU) Protection**: Escalates score for school crosswalks, bike lanes, and wheelchair ramps.
10. **Multilingual Voice Reporting**: Ingests and processes English, Hindi, and Punjabi transcripts with editable text.
11. **Rate Limiting**: Blocks submission flooding exceeding 3 reports in 5 minutes.
12. **Low-Connectivity Draft Saving**: Serializes and restores draft report without data loss.
13. **India Geographic Boundary**: Accepts verified coordinates across Indian sovereign territory (Delhi, Mumbai, Bengaluru, Kolkata, Ludhiana, Chennai, Port Blair, Kavaratti).
14. **India Geographic Exclusion**: Strictly rejects coordinates outside India (San Francisco, London, Dubai, New York, Lahore, Dhaka, offshore Arabian Sea/Bay of Bengal).
15. **Indian PIN Code Validation**: Validates 6-digit Indian PIN codes; rejects 0-prefix, short, or invalid formats.
16. **India Address Normalization**: Formats standard structured postal address with sovereign `India` country tag.
17. **Password Hashing Security**: Computes deterministic Web Crypto SHA-256 salted hashes without plaintext exposure.
18. **Admin Privilege Escalation Prevention**: Blocks non-admin attempts to self-assign Admin role without `CIVIC_ADMIN_2026`.
19. **RBAC Complaint Status Protection**: Enforces that only Admin role can alter ticket status or dispatch crews; blocks citizens.
20. **Password Reset Token Lifecycle**: Verifies token validity, generation, and expiration enforcement.

---

## ⚡ Functional Breakdown: Out-of-the-Box vs. API Key Required

| Feature | Out-of-the-Box (Demo / Offline Mode) | With Configured API Keys |
| :--- | :---: | :---: |
| **Authentication & RBAC (Citizen & Admin)** | ✅ Web Crypto Salted SHA-256 & Local Storage Engine | ✅ Supabase Auth (`NEXT_PUBLIC_SUPABASE_URL`) |
| **India-Only Geodesy & PIN Validation** | ✅ Sovereign Boundary Math & 28 States + 8 UTs | ✅ Server API (`/api/validate-location`) |
| **Multilingual Voice Dictation (HI, PA, EN)** | ✅ Web Speech API & Instant Templates | ✅ Fully Functional |
| **Recurring-Issue Detection & History** | ✅ Fully Functional (80m / 90d Geodesy) | ✅ Fully Functional |
| **Municipal Analytics (MTTR, SLA, Charts)** | ✅ Fully Functional (Recharts KPIs) | ✅ Fully Functional |
| **Offline Draft Auto-Saving & Restore** | ✅ Fully Functional (localStorage) | ✅ Fully Functional |
| **Report Rate Limiting & Cooldown** | ✅ Fully Functional | ✅ Fully Functional |
| **VRU Safety Priority Scoring (P1-P4)** | ✅ Fully Functional (Explainable Logic) | ✅ Fully Functional |
| **Resolution Verification & Before/After Proof** | ✅ Fully Functional | ✅ Fully Functional |
| **Citizen Dispute & Reopen Workflow** | ✅ Fully Functional | ✅ Fully Functional |
| **Duplicate Detection with Image Similarity** | ✅ Fully Functional | ✅ Fully Functional |
| **Live Device Camera & GPS Capture** | ✅ Fully Functional | ✅ Fully Functional |
| **Municipal Kanban Board & Dispatch** | ✅ Gated to Admin Role (`admin@municipal.gov.in`) | ✅ Fully Functional |
| **Embedded 360° Interactive Street View** | ℹ️ Shows Locked GPS Telemetry & Direct Web Launcher | ✅ Streams In-App 360° Panoramas (`NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`) |
| **Automated Street View Metadata Check** | ℹ️ Reports Diagnostic Status | ✅ Real Google Metadata API Check (`NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`) |
| **AI Visual & Text Validation** | ℹ️ Deterministic Heuristic Analysis | ✅ Live Gemini 1.5 Multimodal Analysis (`GEMINI_API_KEY`) |

---

## 🔑 Environment Configuration

Create a `.env.local` file in the root directory:

```env
# Optional: Google Maps Embed & Street View Metadata API Key
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here

# Optional: Google Gemini API Key for Live Multimodal Vision Validation
GEMINI_API_KEY=your_gemini_api_key_here

# Optional: Supabase Authentication (Defaults to built-in Web Crypto engine if omitted)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Municipal Admin Authorization Key (Required to register as Admin)
ADMIN_INVITE_CODE=CIVIC_ADMIN_2026
```

---

## 🚀 Quick Start Instructions

```bash
# 1. Install dependencies
npm install

# 2. Run automated test suite (24 tests)
npm test

# 3. Start development server
npm run dev

# 4. Build for production
npm run build
```

# 4. Build for production
npm run build
```

Open [http://localhost:3000](http://localhost:3000) to view CivicFix.
