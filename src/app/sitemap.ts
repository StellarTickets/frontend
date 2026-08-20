import type { MetadataRoute } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3001';

export default function sitemap(): MetadataRoute.Sitemap {
  // /about and /security are public, indexable pages that were omitted, so
  // crawlers only reached them by following in-page links. /security in
  // particular carries the contract citation, which is the page most worth
  // surfacing for anyone verifying the deployment.
  const routes = ['', '/marketplace', '/login', '/register', '/about', '/security'];

  return routes.map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' ? 'weekly' : 'monthly',
    priority: route === '' ? 1 : 0.6,
  }));
}
