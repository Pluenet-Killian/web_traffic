# CLAUDE.md - Project Context & Guidelines

## 1. Project Overview
High-performance, client-side data conversion tool built for Programmatic SEO and AdSense monetization.
- **Goal:** Maximize organic traffic via long-tail keywords (e.g., "Convert JSON to CSV").
- **Strategy:** 220+ generated static pages, 5 languages, 0-cost server architecture.
- **Monetization:** Google AdSense (Display & Interstitials).

## 2. Tech Stack
- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + Lucide React
- **Processing:** Client-side only (PapaParse, js-yaml). NO server-side processing for files.
- **Deployment:** Vercel (Static/Edge).

## 3. Core Architecture
- **Routing:** `src/app/[lang]/[slug]/page.tsx` handles all conversion pairs.
- **Configuration:**
  - `config/formats.ts`: Defines supported formats (JSON, CSV, SQL, etc.).
  - `config/i18n.ts`: Defines locales (en, fr, es, de, pt).
  - `config/content-matrix.ts`: Stores SEO rich text and FAQs to prevent "Thin Content".
- **Logic:** `lib/converters.ts` contains pure functions for data transformation.

## 4. Coding Standards & Rules

### SEO & Performance (Critical)
1.  **Zero CLS:** Ad units must have fixed heights/placeholders to prevent layout shifts.
2.  **Metadata:** Every page must have a unique `title` and `description` generated via `generateMetadata` in `[slug]/page.tsx`.
3.  **Links:** Always use `Link` from `next/link`. Ensure internal linking grid is present on all pages.

### Internationalization (i18n)
1.  **No Hardcoded Text:** All UI text must come from `dictionaries/{lang}.json`.
2.  **Routing:** All routes must be prefixed with `/[lang]/` (handled by middleware).
3.  **Hreflang:** `layout.tsx` must maintain correct `rel="alternate"` tags for Google.

### Converter Logic
1.  **Robustness:** Converters must handle malformed input gracefully (try/catch -> user toast).
2.  **Privacy:** Never send user data to an API route. All logic stays in `useEffect` or event handlers.
3.  **Feedback:** Always show a toast on success/error (Copy, Download, Parse Error).

## 5. Key Commands
- `npm run dev` - Start development server (Port 3000).
- `npm run build` - Build for production (Checks type safety & static generation).
- `npm run lint` - Check coding standards.

## 6. Project Structure Map
```text
src/
├── app/
│   ├── [lang]/              # Localization Root
│   │   ├── [slug]/          # The SEO Money Maker (Dynamic Converter Page)
│   │   ├── layout.tsx       # Global Layout + Ad Placeholders
│   │   └── page.tsx         # Hub Page (Internal Linking Matrix)
│   └── api/                 # AVOID USING (Keep it client-side)
├── components/
│   ├── converter-ui.tsx     # The Main Tool (Input/Output/Actions)
│   └── ad-unit.tsx          # AdSense Wrapper (Strict dimensions)
├── config/                  # The Brain of the app
│   ├── formats.ts           # Add new formats here to generate more pages
│   └── content-matrix.ts    # SEO Text injection
├── lib/
│   └── converters.ts        # Pure logic (Transformation engines)
└── dictionaries/            # Translation JSONs