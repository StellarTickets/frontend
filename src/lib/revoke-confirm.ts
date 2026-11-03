/** Fields of a verified ticket used to name it in the revoke confirmation (#246). */
export interface RevokeTarget {
  eventName: string;
  tier: string;
  seat: string;
  ownerName: string;
}

/**
 * One-line description of the ticket being revoked, so staff can check they
 * scanned the right one, e.g. "Summer Fest · VIP · Seat A12 · held by Ada Obi".
 * Blank fields are skipped rather than rendered as empty separators.
 */
export function describeRevokeTarget(t: RevokeTarget): string {
  return [
    t.eventName.trim(),
    t.tier.trim(),
    t.seat.trim() ? `Seat ${t.seat.trim()}` : '',
    t.ownerName.trim() ? `held by ${t.ownerName.trim()}` : '',
  ]
    .filter(Boolean)
    .join(' · ');
}
