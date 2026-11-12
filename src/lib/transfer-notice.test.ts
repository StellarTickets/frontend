import { describe, expect, it } from 'vitest';
import { transferNotice } from './transfer-notice';

describe('transferNotice (#266)', () => {
  it('names the event and seat for a seated ticket', () => {
    expect(
      transferNotice(
        { seat: 'A12', event: { name: 'Nova Skyline Tour' } },
        { name: 'Ada Obi', email: 'ada@example.com' },
        'ada@example.com',
      ),
    ).toBe(
      "Nova Skyline Tour · Seat A12 transferred to Ada Obi (ada@example.com). It's no longer in your tickets.",
    );
  });

  it('drops the seat part for general-admission tickets instead of rendering "Seat "', () => {
    expect(
      transferNotice(
        { seat: '', event: { name: 'Nova Skyline Tour' } },
        { email: 'ada@example.com' },
        'ada@example.com',
      ),
    ).toBe("Nova Skyline Tour transferred to ada@example.com. It's no longer in your tickets.");
  });

  it('skips a whitespace-only seat and trims the event name', () => {
    expect(
      transferNotice(
        { seat: '   ', event: { name: ' Nova Skyline Tour ' } },
        { email: 'ada@example.com' },
        'ada@example.com',
      ),
    ).toBe("Nova Skyline Tour transferred to ada@example.com. It's no longer in your tickets.");
  });

  it('falls back to Ticket when the event name is missing', () => {
    expect(
      transferNotice({ seat: 'A12' }, { email: 'ada@example.com' }, 'ada@example.com'),
    ).toBe("Ticket transferred to ada@example.com. It's no longer in your tickets.");
  });
});
