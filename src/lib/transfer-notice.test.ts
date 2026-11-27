import { transferNotice } from './transfer-notice';

const event = { name: 'Nova Skyline Tour' };
const recipient = { name: 'Ada Obi', email: 'ada@example.com' };
const fallback = 'ada@example.com';

describe('transferNotice', () => {
  it('includes seat when present', () => {
    const notice = transferNotice({ event, seat: 'A12' }, recipient, fallback);
    expect(notice).toBe(
      "Nova Skyline Tour · Seat A12 transferred to Ada Obi (ada@example.com). It's no longer in your tickets.",
    );
  });

  it('omits "Seat " label when seat is empty string (GA ticket)', () => {
    const notice = transferNotice({ event, seat: '' }, recipient, fallback);
    expect(notice).not.toContain('Seat ');
    expect(notice).toBe(
      "Nova Skyline Tour transferred to Ada Obi (ada@example.com). It's no longer in your tickets.",
    );
  });

  it('omits "Seat " label when seat is whitespace only', () => {
    const notice = transferNotice({ event, seat: '   ' }, recipient, fallback);
    expect(notice).not.toContain('Seat ');
  });

  it('omits "Seat " label when seat is undefined', () => {
    const notice = transferNotice(
      { event, seat: undefined as unknown as string },
      recipient,
      fallback,
    );
    expect(notice).not.toContain('Seat ');
  });

  it('falls back to "Ticket" when ticket is undefined', () => {
    const notice = transferNotice(undefined, recipient, fallback);
    expect(notice).toBe(
      "Ticket transferred to Ada Obi (ada@example.com). It's no longer in your tickets.",
    );
  });

  it('uses email directly when recipient has no name', () => {
    const notice = transferNotice({ event, seat: 'B3' }, {}, fallback);
    expect(notice).toContain('ada@example.com');
    expect(notice).not.toContain('(');
  });
});
