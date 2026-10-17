/** Page size for the public events listing (#282). */
export const EVENTS_PAGE_SIZE = 20;

/** "Oct 16, 2026, 7:00 PM" or a start – end range when the event has an end time. */
export function formatEventDate(startsAt: string, endsAt: string | null): string {
  const opts: Intl.DateTimeFormatOptions = { dateStyle: 'medium', timeStyle: 'short' };
  const start = new Date(startsAt).toLocaleString(undefined, opts);
  return endsAt ? `${start} – ${new Date(endsAt).toLocaleString(undefined, opts)}` : start;
}
