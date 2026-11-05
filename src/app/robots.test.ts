import { afterEach, describe, expect, it, vi } from 'vitest';

async function loadRobots(baseURL?: string) {
  vi.resetModules();
  vi.stubEnv('NEXT_PUBLIC_APP_URL', baseURL);
  return (await import('./robots')).default();
}

afterEach(() => {
  vi.unstubAllEnvs();
  vi.resetModules();
});

describe('robots metadata', () => {
  it('allows public pages and blocks private route roots as well as nested pages', async () => {
    const { rules, sitemap } = await loadRobots();
    const rule = Array.isArray(rules) ? rules[0] : rules;

    expect(rule.userAgent).toBe('*');
    expect(rule.allow).toBe('/');
    // A trailing slash alone would leave /dashboard, /my-tickets and /verify crawlable.
    expect(rule.disallow).toEqual(['/dashboard', '/my-tickets', '/verify']);
    expect(sitemap).toBe('http://localhost:3001/sitemap.xml');
  });

  it('uses the configured application origin for sitemap discovery', async () => {
    expect((await loadRobots('https://tickets.example')).sitemap).toBe(
      'https://tickets.example/sitemap.xml',
    );
  });
});
