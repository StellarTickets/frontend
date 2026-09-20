import type { MetadataRoute } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3001';
// Keep this stable between requests; update it when public page content changes.
const LAST_MODIFIED = '2026-09-20';

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ['', '/marketplace', '/login', '/register'];

  return routes.map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: LAST_MODIFIED,
    changeFrequency: route === '' ? 'weekly' : 'monthly',
    priority: route === '' ? 1 : 0.6,
  }));
}
