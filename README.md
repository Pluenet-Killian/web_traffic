# Data Converter

A high-performance, SEO-optimized data format converter built with Next.js 14. Converts between JSON, CSV, XML, YAML, SQL, Markdown, and HTML formats entirely client-side for maximum privacy.

## Features

- **7 Data Formats**: JSON, CSV, XML, YAML, SQL, Markdown, HTML Table
- **42 Conversion Combinations**: All possible format pairs
- **5 Languages**: English, French, Spanish, German, Portuguese
- **221 Static Pages**: Pre-rendered for optimal SEO and performance
- **100% Client-Side**: No data ever leaves the browser
- **Drag & Drop**: File upload support
- **Mobile Responsive**: Works on all devices

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **CSV Parsing**: PapaParse
- **YAML Parsing**: js-yaml

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <your-repo-url>

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Start development server
npm run dev
```

### Environment Variables

Create a `.env.local` file with:

```env
NEXT_PUBLIC_SITE_URL=https://your-domain.com
NEXT_PUBLIC_ADSENSE_ID=ca-pub-XXXXXXXXXX
```

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SITE_URL` | Your production domain (for sitemap, canonical URLs) | Yes |
| `NEXT_PUBLIC_ADSENSE_ID` | Google AdSense Publisher ID | No |

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
src/
├── app/
│   ├── [lang]/
│   │   ├── [slug]/
│   │   │   └── page.tsx      # Conversion pages
│   │   ├── layout.tsx        # Language layout with hreflang
│   │   ├── page.tsx          # Homepage
│   │   └── not-found.tsx     # 404 page
│   ├── layout.tsx            # Root layout
│   ├── robots.ts             # robots.txt generation
│   ├── sitemap.ts            # sitemap.xml generation
│   └── not-found.tsx         # Root 404
├── components/
│   ├── converter-ui.tsx      # Main converter component
│   ├── ad-unit.tsx           # Ad placeholders
│   └── toast.tsx             # Toast notifications
├── config/
│   ├── formats.ts            # Format definitions
│   ├── i18n.ts               # i18n configuration
│   └── content-matrix.ts     # SEO content per conversion
├── dictionaries/
│   ├── en.json               # English translations
│   ├── fr.json               # French translations
│   ├── es.json               # Spanish translations
│   ├── de.json               # German translations
│   ├── pt.json               # Portuguese translations
│   └── index.ts              # Dictionary loader
├── lib/
│   └── converters.ts         # Conversion logic
└── middleware.ts             # Locale detection
```

## URL Structure

```
/                    → Redirects to /en
/en                  → English homepage
/fr                  → French homepage
/en/json-to-csv      → JSON to CSV converter (English)
/fr/json-to-csv      → JSON to CSV converter (French)
```

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in Vercel
3. Set environment variables
4. Deploy

### Other Platforms

The project exports as static HTML. Deploy to any static hosting:

```bash
npm run build
# Output in .next/ directory
```

## SEO Features

- Dynamic meta tags per conversion
- JSON-LD structured data (SoftwareApplication, FAQPage)
- Automatic sitemap.xml generation
- hreflang tags for all languages
- Canonical URLs
- Open Graph tags

## License

MIT
