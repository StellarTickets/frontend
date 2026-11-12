import type { Ticket } from './types';

/**
 * Notice shown after a ticket transfer, naming the ticket and the recipient
 * (#266) so the user knows where the ticket went when it leaves their list.
 */
export function transferNotice(
  ticket: Pick<Ticket, 'seat' | 'event'> | undefined,
  recipient: { name?: string; email?: string },
  email: string,
): string {
  const address = recipient.email ?? email;
  const who = recipient.name ? `${recipient.name} (${address})` : address;
  // Seat is optional in practice (GA, wristbands), so skip it when blank rather
  // than rendering a dangling "Seat " — same rule as describeRevokeTarget.
  const parts = ticket?.event?.name.trim()
    ? [
        ticket.event.name.trim(),
        ticket.seat.trim() ? `Seat ${ticket.seat.trim()}` : '',
      ].filter(Boolean)
    : null;
  const what = parts ? parts.join(' · ') : 'Ticket';
  return `${what} transferred to ${who}. It's no longer in your tickets.`;
}
