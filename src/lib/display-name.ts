/** Shown when a seller has no usable name. */
export const VERIFIED_HOLDER_LABEL = 'Verified holder';

/**
 * Public-facing form of a seller's name (#272): first name and last initial,
 * e.g. "Ada Lovelace" → "Ada L.", "Mary Ann Smith" → "Mary S.". A single
 * name is shown as-is; a blank or missing name falls back to
 * "Verified holder". The full name is never rendered to other users.
 */
export function publicSellerName(fullName: string | null | undefined): string {
  const parts = (fullName ?? '').trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return VERIFIED_HOLDER_LABEL;
  const first = parts[0];
  if (parts.length === 1) return first;
  const lastInitial = Array.from(parts[parts.length - 1])[0].toLocaleUpperCase();
  return `${first} ${lastInitial}.`;
}
