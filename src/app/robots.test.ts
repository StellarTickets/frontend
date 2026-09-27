import { describe, expect, it } from 'vitest';
import robots from './robots';

describe('robots metadata', () => {
  it('allows public pages and blocks authenticated areas', () => {
    expect(robots()).toEqual({
      rules: {
        userAgent: '*',
        allow: '/',
        disallow: ['/dashboard', '/my-tickets', '/verify'],
      },
      sitemap: 'http://localhost:3001/sitemap.xml',
    });
  });
});
