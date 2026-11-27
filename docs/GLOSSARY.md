# Glossary

A plain-language reference for the ticketing and Stellar terms used throughout
this codebase. Entries are alphabetical. For component-specific terms see the
[Components](#components) section at the bottom.

---

## A–Z

**base units** — Prices are stored and transmitted as integer strings (e.g.
`"1000000"` = 1 XLM if the asset has 7 decimal places), never as floating-point
decimals. The conversion happens at display time only (`src/lib/format.ts`).
See [#226](https://github.com/StellarTickets/frontend/issues/226).

**bps (basis points)** — One hundredth of one percent: 100 bps = 1 %. The API
expresses resale caps and royalties in bps (`maxResaleMultiplierBps`,
`royaltyBps` — `src/lib/types.ts:76-77`); the UI shows them as percentages or
multipliers. Conversions live in `formatResaleCap` and `formatRoyalty`
(`src/lib/event-details.ts:36-46`). This is where off-by-100 mistakes happen,
so touch those helpers carefully.

**chainEventId / chainTicketId** — The on-chain identifier assigned to an event
or ticket after the blockchain transaction is confirmed. `null` before
confirmation. `src/lib/types.ts:75`, `:90`.

**check-in** — A one-way, non-destructive state change: a `VALID` ticket becomes
`USED`. Normal scanner flow on the day of the event. Compare *revoke*.

**DRAFT / PUBLISHED / CANCELLED** — The three states of an `Event`
(`src/lib/types.ts:56`). Only `PUBLISHED` events are visible in the
marketplace; `CANCELLED` events block new ticket sales but do not invalidate
already-issued tickets.

**gate code / `qrSecret`** — A short, per-ticket bearer secret embedded in the
QR code that the door scanner reads. It is never displayed in plain text in the
UI; the app renders it as a QR image. Knowing the gate code is sufficient to
check in a ticket, so it must not be leaked to other users.
`src/lib/types.ts:93`, `src/app/my-tickets/page.tsx:33-54`,
`src/app/security/page.tsx:72-78`.

**organization slug** — A URL-safe, lowercase identifier for the organization
that owns an event (e.g. `"stellar-foundation"`). Used in dashboard routes and
API paths. `src/lib/types.ts:80`.

**resale cap / multiplier** — The maximum price a ticket may be resold for,
expressed as a multiple of its face value. Stored as bps: 15 000 bps = 1.5×.
`maxResaleMultiplierBps` (`src/lib/types.ts:76`). `formatResaleCap` converts it
to a human-readable string (`src/lib/event-details.ts:40-46`).

**revoke** — A permanent, punitive state change: a ticket (any status) becomes
`REVOKED` and cannot be used or transferred. Offered alongside check-in on the
`/verify` page. Unlike check-in, revoke cannot be undone.

**royaltyBps** — The percentage of every resale price paid to the event organizer
as a royalty, in basis points. `src/lib/types.ts:77`.

**ticket type / tier** — `TicketType` in the API (`src/lib/types.ts:58`).
Called "tier" in the Verify result (`src/app/verify/page.tsx:19`) and "Ticket
types" in the organizer dashboard. Represents a named seating category or
price band within an event (e.g. "General Admission", "VIP").

**VALID / USED / REVOKED / RESALE** — The four states of a `Ticket`
(`src/lib/types.ts:83`). `VALID` = unused, transferable. `USED` = checked in.
`REVOKED` = permanently invalidated. `RESALE` = listed on the secondary market.

---

## Components

These entries describe UI components rather than domain concepts.

**build/confirm pair** — The two backend endpoints (e.g. `POST /tickets/issue`
then `POST /tickets/confirm-issue`) behind every on-chain write.
See `src/lib/onchain.ts`.

**Marquee** — The seamless infinite-scroll pill row (used for industries and
the tech stack on the homepage).

**ParticleNetwork** — The animated canvas background behind the hero section.

**PillButton** — The gradient hover-reveal CTA component used for primary
actions across the marketing pages.
