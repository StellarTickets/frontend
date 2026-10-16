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
  const what = ticket?.event?.name ? `${ticket.event.name} · Seat ${ticket.seat}` : 'Ticket';
  return `${what} transferred to ${who}. It's no longer in your tickets.`;
}
