# 🏥 Organigen Health (ਓਰਗੈਨੀਜੈਨ ਹੈਲਥ / ऑर्गेनिजेन हेल्थ)

> **Production-Quality Mobile-First Progressive Web App (PWA) for Rural Health Triage in Punjab, India.**

Organigen Health empowers rural families and frontline **ASHA / ANM health workers** across Punjab to quickly assess symptom urgency, receive culturally sensitive 6th-grade home-care guidance, identify life-threatening clinical red flags, and locate nearby government healthcare facilities.

---

## 🚀 Key Features

- **🌐 Multilingual by Design:** Complete UI and clinical guidance in **Punjabi (ਪੰਜਾਬੀ)**, **Hindi (हिन्दी)**, and **English**, toggleable instantly via the top navigation bar.
- **🎙️ Web Speech Voice Input:** Speak symptoms hands-free in Punjabi (`pa-IN`), Hindi (`hi-IN`), or English (`en-IN`).
- **🔊 Text-to-Speech Guidance:** An accessible **"Listen"** button reads aloud the triage results, clinical reasons, home-care instructions, and hospital danger signs.
- **🛡️ Deterministic Clinical Red-Flag Rule Engine:** Before calling any AI, the deterministic safety engine scans for life-threatening emergencies (FAST stroke criteria, cardiac chest pain, infant distress under 1 year, pregnancy complications, poisoning/snakebite, severe burns, uncontrollable hemorrhage).
- **🤖 Gemini AI Clinical Triage:** Evaluates non-emergency cases using the strict medical prompt in `lib/triagePrompt.ts`. Delivers simplified 6th-grade guidance without ever diagnosing or prescribing drug dosages.
- **🗺️ Interactive Punjab Healthcare Map:** Powered by **Leaflet & OpenStreetMap**, featuring **25 geocoded Punjab Civil Hospitals, Community Health Centres (CHCs), PHCs, and Jan Aushadhi generic pharmacies**. Computes real-time Haversine distance from user GPS with one-tap phone dialing (`tel:...`).
- **📊 ASHA Worker Surveillance Dashboard:** Built with **Recharts** to visualize community health trends: cases by village, urgency split, and top reported symptoms across Punjab rural districts.
- **🚨 108 Sticky Emergency Button:** Fixed high-contrast red call button on every page for immediate 1-tap connection to the free Punjab 108 ambulance dispatch.
- **♿ Accessibility & Inclusion:** Large touch targets (min 48px), high contrast, **Large-Text Toggle (A / A+)**, and **Dark Mode**.
- **📱 PWA & Offline Support:** Installable on Android, iOS, and desktop browsers with custom service worker caching and dedicated `/offline` screen with offline ambulance dialer.

---

## 🎨 Design System & Color Palette

| Token | Hex | Role |
|---|---|---|
| **Primary Teal** | `#0F766E` | Main branding, primary buttons, accents |
| **Mint** | `#CCFBF1` | Soft highlights, badge backgrounds |
| **App Background** | `#F0FDFA` | Calming clinical background |
| **Accent Amber** | `#F59E0B` | Badges, warnings, secondary highlights |
| **Dark Slate Text** | `#0F172A` | High-contrast readable typography |

### Urgency Color & Icon Mapping

Urgency is **always communicated via icon, label, and color**:
- 🚨 **Emergency (`#DC2626`):** Immediate hospital / Dial 108.
- ⚠️ **Urgent Today (`#F97316`):** Visit PHC or doctor today.
- 🕒 **See Clinic Soon (`#EAB308`):** Schedule visit in 1–2 days.
- ✅ **Home Care (`#16A34A`):** Bed rest, clean fluids, ORS, monitoring.

---

## 🏗️ Tech Stack

- **Framework:** Next.js 14 (App Router, TypeScript)
- **Styling:** Tailwind CSS, PostCSS, Lucide Icons
- **Animation:** Framer Motion
- **Maps:** Leaflet & OpenStreetMap (dynamic client-side import)
- **Data Visualizations:** Recharts
- **Database & Telemetry:** Supabase (`@supabase/supabase-js`) with offline cache fallback
- **AI Engine:** Google Gemini API (`@google/generative-ai`)
- **PWA:** Web App Manifest, Service Worker (`/sw.js`), Offline Fallback (`/offline`)
- **Deploy Target:** Vercel

---

## 📂 Project Structure

```
├── data/
│   └── facilities.json         # 25 geocoded Punjab hospitals, clinics & pharmacies
├── lib/
│   └── triagePrompt.ts         # Clinical system prompt specification
├── messages/
│   ├── en.json                 # English translation strings
│   ├── hi.json                 # Hindi translation strings
│   └── pa.json                 # Punjabi translation strings
├── public/
│   ├── manifest.json           # PWA web manifest
│   ├── sw.js                   # Service Worker with offline routing
│   └── icons/                  # 192x192 & 512x512 PWA icons
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout, fonts, meta & providers
│   │   ├── page.tsx            # Landing page (hero, CTAs, 3 steps)
│   │   ├── check/page.tsx      # Chat-style symptom assessment flow
│   │   ├── result/page.tsx     # Color-coded triage card, TTS, share & map preview
│   │   ├── facilities/page.tsx # Leaflet map, filters, distance & tap-to-call
│   │   ├── dashboard/page.tsx  # ASHA surveillance dashboard with Recharts
│   │   ├── about/page.tsx      # Triage explanation & emergency directory
│   │   ├── offline/page.tsx    # Offline fallback page with dialer
│   │   └── api/
│   │       ├── triage/route.ts # POST /api/triage (Red flags -> Gemini -> Save)
│   │       └── cases/route.ts  # GET/POST /api/cases for telemetry
│   ├── components/
│   │   ├── Navbar.tsx          # Navigation, language, large-text, theme toggle
│   │   ├── Footer.tsx          # Medical disclaimer, emergency links
│   │   ├── EmergencyBar.tsx    # Sticky red "Call 108" button
│   │   ├── UrgencyBadge.tsx    # Accessible icon + label + color badge
│   │   ├── VoiceMicButton.tsx  # Web Speech API recognition button
│   │   ├── SpeechSpeaker.tsx   # Web Speech Synthesis TTS button
│   │   └── LeafletMap.tsx      # OpenStreetMap interactive map component
│   └── lib/
│       ├── geo.ts              # Haversine distance calculator
│       ├── redFlags.ts         # Deterministic clinical red-flag engine
│       ├── gemini.ts           # Gemini API client & intelligent fallback
│       ├── supabase.ts         # Supabase client & seeded sample cases
│       ├── i18n.tsx            # Multilingual Context & hook
│       └── types.ts            # TypeScript interfaces
├── .env.example
├── next.config.mjs
├── tailwind.config.ts
└── tsconfig.json
```

---

## 🛠️ Local Development Setup

### 1. Prerequisites
- **Node.js** v18+ (tested on Node v20 & v22)
- **npm** v9+

### 2. Clone and Install Dependencies
```bash
git clone <repo-url>
cd "new project"
npm install
```

### 3. Environment Variables Setup
Copy the example environment file:
```bash
cp .env.example .env.local
```
Add your API keys in `.env.local`:
```env
# Google Gemini API Key
GEMINI_API_KEY=AIzaSy...

# Supabase (Optional: app gracefully falls back to local cache if omitted)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
```

> **Note:** The app includes a complete offline clinical triage engine and seeded Punjab cases. It functions seamlessly even without external API keys!

### 4. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🗄️ Supabase Database Setup (Optional)

If using Supabase for live multi-device ASHA telemetry, run this SQL in your Supabase SQL editor:

```sql
create table if not exists cases (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  village text not null,
  age_group text not null,
  urgency text not null check (urgency in ('emergency', 'urgent_today', 'see_clinic_soon', 'home_care')),
  symptoms text not null
);

-- Enable Row Level Security (RLS)
alter table cases enable row level security;

-- Allow anonymous inserts & selects for rural health telemetry
create policy "Allow anonymous reads" on cases for select using (true);
create policy "Allow anonymous inserts" on cases for insert with check (true);
```

---

## 🚀 Deployment to Vercel

1. Push your repository to **GitHub / GitLab / Bitbucket**.
2. Sign in to [Vercel](https://vercel.com) and click **"New Project"**.
3. Import your repository.
4. In the **Environment Variables** section, add:
   - `GEMINI_API_KEY`
   - `NEXT_PUBLIC_SUPABASE_URL` (optional)
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` (optional)
5. Click **"Deploy"**.
6. Once deployed, verify PWA installability in Chrome DevTools under the **Lighthouse** tab (PWA badge will be 100% active).

---

## ⚖️ Clinical Disclaimer

> **Organigen Health provides preliminary triage guidance for informative and educational purposes only. It is not an electronic medical record, does not perform clinical diagnosis, and never prescribes pharmaceuticals or drug dosages. In any life-threatening situation, immediately call 108 or go to the nearest hospital.**
