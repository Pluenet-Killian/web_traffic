# CLAUDE.md - Project Context & Guidelines

## 1. Project Overview
High-performance, client-side "Swiss Army Knife" for files (Data, PDF, Images).
- **Goal:** Maximize organic traffic via Programmatic SEO (Converters) and Viral Tools (PDF/Images).
- **Strategy:** ~286 static pages, 5 languages (En, Fr, Es, De, Pt), "Privacy-First" USP.
- **Monetization:** Aggressive but clean AdSense strategy (Display, Native, Sticky, and "Ad-Wait" Modals).
- **Design:** Premium SaaS Aesthetic (Bento Grid, Glassmorphism, Zinc/Indigo palette).

## 2. Tech Stack
- **Framework:** Next.js 14+ (App Router).
- **Language:** TypeScript.
- **Styling:** Tailwind CSS + Lucide React + Framer Motion (Animations).
- **Core Logic (Client-Side Only):**
  - Data: `papaparse` (CSV), `js-yaml` (YAML).
  - Media: `pdf-lib` (PDF manipulation), `react-dropzone`, Canvas API (Images).
- **Deployment:** Vercel (Static Export).

## 3. Core Architecture
The app is divided into 4 main pillars:
1.  **Converters (Programmatic SEO):** `src/app/[lang]/[slug]/`
    - Logic defined in `config/formats.ts`.
2.  **Tools (Viral/Utility):** `src/app/[lang]/tools/[tool-slug]/`
    - Logic defined in `config/tools.ts` and `lib/pdf-tools.ts`.
3.  **Guides (How-To Content):** `src/app/[lang]/guides/[slug]/`
    - Logic defined in `config/guides.ts`.
4.  **Legal (AdSense Compliance):** `src/app/[lang]/legal/`
    - Content defined in `config/legal.ts`.

## 4. Coding Standards & Rules

### Monetization & AdOps (CRITICAL)
1.  **Ad-Wait Pattern:** All tools MUST use `<ProcessingModal>` before download. This introduces a 1.5s delay to show a high-value ad.
2.  **Smart Cross-Sell:** Every page must include `<SmartSidebar>` to recirculate traffic between Data and Tools.
3.  **Ad Density:** Maintain placeholders for Top Billboard (Header), Sticky Sidebar, and In-Grid Native ads.
4.  **Consent:** Never fire AdSense/Analytics tags before user consent (handled by `ConsentContext`).

### UI/UX & Design System
1.  **Premium Feel:** Use "Bento Grid" layouts for lists. Use "Window/IDE" styling for tools.
2.  **Feedback:** Use Toasts for actions. Use Framer Motion for transitions.
3.  **Color Palette:** Backgrounds `bg-white` or `bg-zinc-50`. Text `text-zinc-900`. Accents `indigo-600`.
4.  **Navigation:** Mega-menu in Header. "Fat Footer" with dynamic top links.

### Data Privacy Rule
- **ABSOLUTE RULE:** No file is ever sent to a server (`/api` routes are forbidden for file processing).
- All logic (PDF merge, conversion, watermark) must happen in the browser (WASM/JS).

## 5. Project Structure Map
```text
src/
├── app/
│   ├── [lang]/
│   │   ├── [slug]/          # Data Converters (Programmatic)
│   │   ├── tools/           # PDF & Image Tools (e.g., pdf-dark-mode)
│   │   ├── guides/          # SEO Blog/Tutorials
│   │   ├── legal/           # Privacy, Terms, Cookies
│   │   ├── layout.tsx       # Main Layout (Navbar, Footer, Ads)
│   │   └── page.tsx         # Bento Grid Homepage
├── components/
│   ├── ad-unit.tsx          # AdSense Component (Responsive)
│   ├── processing-modal.tsx # "Ad-Wait" Modal (The Money Maker)
│   ├── smart-sidebar.tsx    # Cross-selling Widget
│   ├── tool-ui.tsx          # Shared layout for Tools
│   ├── converter-ui.tsx     # Shared layout for Data Converters
│   ├── cookie-consent.tsx   # GDPR Banner
│   └── analytics-scripts.tsx# GA4 & AdSense Injection
├── config/                  # Content Sources ( The "Database")
│   ├── formats.ts           # Data pairs (JSON->CSV...)
│   ├── tools.ts             # Tools config
│   ├── guides.ts            # Blog content
│   ├── legal.ts             # Legal text
│   └── i18n.ts              # Locales setup
├── lib/
│   ├── converters.ts        # Data Logic (Text processing)
│   ├── pdf-tools.ts         # PDF Logic (pdf-lib)
│   └── image-tools.ts       # Image Logic (Canvas)
└── dictionaries/            # UI Strings (Translations)