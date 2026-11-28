import { describe, it, expect } from 'vitest';
import sitemap from './sitemap';

describe('sitemap (#17)', () => {
  it('includes /about', () => {
    const urls = sitemap().map((e) => new URL(e.url).pathname);
    expect(urls).toContain('/about');
  });

  it('includes /security', () => {
    const urls = sitemap().map((e) => new URL(e.url).pathname);
    expect(urls).toContain('/security');
  });

  it('still includes the existing public routes', () => {
    const urls = sitemap().map((e) => new URL(e.url).pathname);
    for (const route of ['/', '/events', '/marketplace', '/login', '/register']) {
      expect(urls).toContain(route);
    }
  });
});
