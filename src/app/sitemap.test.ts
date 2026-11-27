import { describe, expect, it } from 'vitest';
import sitemap from './sitemap';

describe('sitemap metadata', () => {
  it('keeps all existing public routes', () => {
    const urls = sitemap().map((entry) => new URL(entry.url).pathname);
    for (const route of [
      '/',
      '/events',
      '/marketplace',
      '/about',
      '/security',
      '/login',
      '/register',
    ]) {
      expect(urls).toContain(route);
    }
  });

  it('uses a stable content date instead of the current request time', () => {
    const first = sitemap();
    const second = sitemap();

    expect(first).toEqual(second);
    expect(first.every((entry) => entry.lastModified === '2026-08-20')).toBe(true);
  });
});
