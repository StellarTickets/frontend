import { describe, expect, it } from 'vitest';
import { INDUSTRIES, INDUSTRY_LABELS } from './types';

describe('INDUSTRY_LABELS', () => {
  it('has a human-readable label for every industry', () => {
    for (const industry of INDUSTRIES) {
      expect(INDUSTRY_LABELS[industry]).toBeTruthy();
      expect(typeof INDUSTRY_LABELS[industry]).toBe('string');
    }
  });

  it('covers exactly the twelve supported industries, no more, no fewer', () => {
    expect(INDUSTRIES).toHaveLength(12);
    expect(Object.keys(INDUSTRY_LABELS)).toHaveLength(12);
  });

  it('has no duplicate labels', () => {
    const labels = Object.values(INDUSTRY_LABELS);
    expect(new Set(labels).size).toBe(labels.length);
  });
});
