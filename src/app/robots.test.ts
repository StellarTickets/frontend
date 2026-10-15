import { describe, expect, it } from 'vitest';
import robots from './robots';

describe('robots', () => {
  it('allows public pages and disallows authenticated routes', () => {
    const { rules, sitemap } = robots();
    const rule = Array.isArray(rules) ? rules[0] : rules;

    expect(rule.userAgent).toBe('*');
    expect(rule.allow).toBe('/');
    expect(rule.disallow).toEqual(expect.arrayContaining(['/dashboard/', '/my-tickets/']));
    expect(sitemap).toMatch(/\/sitemap\.xml$/);
  });
});
