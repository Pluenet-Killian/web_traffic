import { MetadataRoute } from 'next';
import { getAllConversions, getConversionSlug } from '@/config/formats';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://data-converter.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const conversions = getAllConversions();
  const currentDate = new Date().toISOString();

  // Page d'accueil
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
  ];

  // Pages de conversion dynamiques
  const conversionPages: MetadataRoute.Sitemap = conversions.map(({ source, target }) => ({
    url: `${BASE_URL}/${getConversionSlug(source, target)}`,
    lastModified: currentDate,
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  return [...staticPages, ...conversionPages];
}
