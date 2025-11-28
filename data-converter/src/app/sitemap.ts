import { MetadataRoute } from 'next';
import { getAllConversions, getConversionSlug } from '@/config/formats';
import { locales, localeHtmlLang } from '@/config/i18n';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://data-converter.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const conversions = getAllConversions();
  const currentDate = new Date().toISOString();
  const sitemap: MetadataRoute.Sitemap = [];

  // Homepage for each locale
  for (const locale of locales) {
    const alternateLanguages: Record<string, string> = {};
    locales.forEach((l) => {
      alternateLanguages[localeHtmlLang[l]] = `${BASE_URL}/${l}`;
    });

    sitemap.push({
      url: `${BASE_URL}/${locale}`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 1.0,
      alternates: {
        languages: alternateLanguages,
      },
    });
  }

  // Conversion pages for each locale
  for (const locale of locales) {
    for (const { source, target } of conversions) {
      const slug = getConversionSlug(source, target);

      const alternateLanguages: Record<string, string> = {};
      locales.forEach((l) => {
        alternateLanguages[localeHtmlLang[l]] = `${BASE_URL}/${l}/${slug}`;
      });

      sitemap.push({
        url: `${BASE_URL}/${locale}/${slug}`,
        lastModified: currentDate,
        changeFrequency: 'monthly',
        priority: 0.8,
        alternates: {
          languages: alternateLanguages,
        },
      });
    }
  }

  return sitemap;
}
