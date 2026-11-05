import { describe, expect, it } from 'vitest';
import { publicSellerName, VERIFIED_HOLDER_LABEL } from './display-name';

describe('publicSellerName (#272)', () => {
  it('shows first name and last initial', () => {
    expect(publicSellerName('Ada Lovelace')).toBe('Ada L.');
  });

  it('drops middle names', () => {
    expect(publicSellerName('Mary Ann Smith')).toBe('Mary S.');
  });

  it('normalises whitespace and capitalises the initial', () => {
    expect(publicSellerName('  ada   lovelace ')).toBe('ada L.');
  });

  it('handles non-ASCII last names', () => {
    expect(publicSellerName('Zoë Ørsted')).toBe('Zoë Ø.');
  });

  it('shows a single name as-is', () => {
    expect(publicSellerName('Cher')).toBe('Cher');
  });

  it('falls back to "Verified holder" for blank or missing names', () => {
    expect(publicSellerName('')).toBe(VERIFIED_HOLDER_LABEL);
    expect(publicSellerName('   ')).toBe(VERIFIED_HOLDER_LABEL);
    expect(publicSellerName(undefined)).toBe(VERIFIED_HOLDER_LABEL);
    expect(publicSellerName(null)).toBe(VERIFIED_HOLDER_LABEL);
  });

  it('never contains the full last name', () => {
    expect(publicSellerName('Ada Lovelace')).not.toContain('Lovelace');
  });
});
