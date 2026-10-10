import type { MetadataRoute } from 'next';
import { routing } from '@/i18n/routing';

const BASE_URL = 'https://id.gdhlj.com';

const paths = [
  '',
  '/about',
  '/group',
  '/factory',
  '/products',
  '/quality',
  '/sales',
  '/contact',
];

export default function sitemap(): MetadataRoute.Sitemap {
  const items: MetadataRoute.Sitemap = [];
  for (const locale of routing.locales) {
    for (const path of paths) {
      items.push({
        url: `${BASE_URL}${locale === routing.defaultLocale ? '' : `/${locale}`}${path}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: path === '' ? 1 : 0.8,
      });
    }
  }
  return items;
}