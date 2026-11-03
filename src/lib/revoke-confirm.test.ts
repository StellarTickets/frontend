import { describe, expect, it } from 'vitest';
import { describeRevokeTarget } from './revoke-confirm';

describe('describeRevokeTarget (#246)', () => {
  it('names the event, tier, seat and holder', () => {
    expect(
      describeRevokeTarget({ eventName: 'Summer Fest', tier: 'VIP', seat: 'A12', ownerName: 'Ada Obi' }),
    ).toBe('Summer Fest · VIP · Seat A12 · held by Ada Obi');
  });

  it('skips blank fields instead of leaving empty separators', () => {
    expect(
      describeRevokeTarget({ eventName: 'Summer Fest', tier: 'GA', seat: '  ', ownerName: '' }),
    ).toBe('Summer Fest · GA');
  });

  it('trims whitespace', () => {
    expect(
      describeRevokeTarget({ eventName: ' Fest ', tier: ' GA ', seat: ' 7 ', ownerName: ' Bo ' }),
    ).toBe('Fest · GA · Seat 7 · held by Bo');
  });
});
