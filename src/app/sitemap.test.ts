import { describe, expect, it } from 'vitest';
import sitemap from './sitemap';

describe('sitemap metadata', () => {
  it('uses a stable content date instead of the current request time', () => {
    const first = sitemap();
    const second = sitemap();

    expect(first).toEqual(second);
    expect(first.every((entry) => entry.lastModified === '2026-09-20')).toBe(true);
  });
});
