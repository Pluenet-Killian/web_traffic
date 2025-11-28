import { NextRequest, NextResponse } from 'next/server';
import { locales, defaultLocale, isValidLocale, type Locale } from '@/config/i18n';

// Chemins à exclure du middleware
const PUBLIC_FILE = /\.(.*)$/;
const EXCLUDED_PATHS = ['/_next', '/api', '/favicon.ico', '/robots.txt', '/sitemap.xml'];

function getLocaleFromHeaders(request: NextRequest): Locale {
  // Récupérer la langue préférée depuis Accept-Language
  const acceptLanguage = request.headers.get('accept-language');

  if (!acceptLanguage) return defaultLocale;

  // Parser l'en-tête Accept-Language
  const preferredLocales = acceptLanguage
    .split(',')
    .map((lang) => {
      const [locale, quality = '1'] = lang.trim().split(';q=');
      return {
        locale: locale.split('-')[0].toLowerCase(), // Prendre seulement la partie langue (ex: 'en' de 'en-US')
        quality: parseFloat(quality),
      };
    })
    .sort((a, b) => b.quality - a.quality);

  // Trouver la première locale supportée
  for (const { locale } of preferredLocales) {
    if (isValidLocale(locale)) {
      return locale;
    }
  }

  return defaultLocale;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Ignorer les fichiers statiques et chemins exclus
  if (
    PUBLIC_FILE.test(pathname) ||
    EXCLUDED_PATHS.some((path) => pathname.startsWith(path))
  ) {
    return NextResponse.next();
  }

  // Vérifier si le pathname commence par une locale valide
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) {
    return NextResponse.next();
  }

  // Rediriger vers la locale détectée
  const locale = getLocaleFromHeaders(request);

  // Construire la nouvelle URL avec la locale
  const newUrl = new URL(`/${locale}${pathname}`, request.url);

  // Préserver les query params
  newUrl.search = request.nextUrl.search;

  return NextResponse.redirect(newUrl);
}

export const config = {
  // Matcher pour toutes les routes sauf les fichiers statiques
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (SEO files)
     * - Files with extensions (.png, .jpg, etc.)
     */
    '/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\..*).*)',
  ],
};
