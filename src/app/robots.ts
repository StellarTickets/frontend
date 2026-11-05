import type { MetadataRoute } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3001';

// Prefixes cover both the authenticated route itself and its nested pages.
const PRIVATE_ROUTES = ['/dashboard', '/my-tickets', '/verify'];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: PRIVATE_ROUTES,
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
