/** Formatting helpers for the organizer event-details block (#104). */

export function buildPublishSummary(event: {
  name?: string;
  startsAt?: string;
  endsAt?: string | null;
  venue?: string;
  maxResaleMultiplierBps?: number;
  royaltyBps?: number;
  ticketTypes?: Array<{ name: string; quantityTotal?: number; price?: string }>;
}): string {
  const dateSummary = event.startsAt
    ? formatEventDate(event.startsAt, event.endsAt)
    : 'Not set';

  const ticketTypes = event.ticketTypes?.length
    ? event.ticketTypes
        .map((tt) => `${tt.name} (${tt.quantityTotal ?? 0} total${tt.price ? ` · ${tt.price}` : ''})`)
        .join(', ')
    : 'No ticket types added yet';

  return [
    `Event: ${event.name ?? 'Untitled event'}`,
    `Date: ${dateSummary}`,
    `Venue: ${event.venue ?? 'Not set'}`,
    `Ticket types: ${ticketTypes}`,
    `Resale cap: ${formatResaleCap(event.maxResaleMultiplierBps ?? 10_000)}`,
    `Organizer royalty: ${formatRoyalty(event.royaltyBps ?? 0)}`,
  ].join('\n');
}

/** 500 → "5%", 250 → "2.5%". */
export function formatRoyalty(bps: number): string {
  return `${Number((bps / 100).toFixed(2))}%`;
}

/** 15000 → "1.5× face value", 10000 → "1× face value (no markup)". */
export function formatResaleCap(bps: number): string {
  const multiplier = Number((bps / 10_000).toFixed(2));
  return bps === 10_000
    ? `${multiplier}× face value (no markup)`
    : `${multiplier}× face value`;
}

/** Resale cap for a ticket: price × bps / 10000 (whole units), or null when the price isn't an integer. */
export function maxResalePrice(price: string | undefined, bps: number | undefined): string | null {
  if (!price || bps === undefined || !/^\d+$/.test(price)) return null;
  return ((BigInt(price) * BigInt(bps)) / BigInt(10_000)).toString();
}

/**
 * Locale date + time, e.g. "Sat, 20 Jun 2026, 19:00".
 * When `endsAt` is provided, renders a start–end range:
 * "Sat, 20 Jun 2026, 19:00 – Sat, 20 Jun 2026, 23:00".
 */
export function formatEventDate(
  iso: string,
  endsAt?: string | null,
  locale?: string,
  timeZone?: string,
): string {
  const fmt = new Intl.DateTimeFormat(locale, {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone,
  });
  const start = fmt.format(new Date(iso));
  return endsAt ? `${start} – ${fmt.format(new Date(endsAt))}` : start;
}

const EXPLORER_NETWORK: Record<string, string> = {
  testnet: 'testnet',
  mainnet: 'public',
  public: 'public',
  futurenet: 'futurenet',
};

/**
 * stellar.expert link to the ticketing contract the event lives in, or null
 * when the contract id isn't configured. Logs a warning for unrecognised
 * network names so misconfigured deployments are visible in the console
 * instead of silently dropping the on-chain verification link (#448).
 */
export function ticketingContractUrl(
  contractId: string | undefined,
  network: string | undefined,
): string | null {
  if (!contractId) return null;
  const key = (network ?? '').toLowerCase();
  const explorerNetwork = EXPLORER_NETWORK[key];
  if (!explorerNetwork) {
    console.warn(
      `ticketingContractUrl: unrecognised network "${network}". ` +
      `Expected one of: ${Object.keys(EXPLORER_NETWORK).join(', ')}. ` +
      `The on-chain verification link will not be shown.`,
    );
    return null;
  }
  return `https://stellar.expert/explorer/${explorerNetwork}/contract/${encodeURIComponent(contractId)}`;
}

/**
 * Event start/end fields for the create-event request (#100, #286).
 * `endsAt` is optional: it's sent only when set, and must be after `startsAt`.
 * Inputs are `datetime-local` values.
 */
export function eventTimesPayload(
  startsAt: string,
  endsAt: string,
): { startsAt: string; endsAt?: string } | { error: string } {
  if (endsAt && new Date(endsAt) <= new Date(startsAt)) {
    return { error: 'Ends at must be after Starts at' };
  }
  return {
    startsAt: new Date(startsAt).toISOString(),
    ...(endsAt ? { endsAt: new Date(endsAt).toISOString() } : {}),
  };
}
