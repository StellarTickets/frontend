# StellarTickets — Frontend

Next.js app for [StellarTickets](https://github.com/StellarTickets) —
*Secure. Verifiable. Powered by Stellar.*

Marketing site, organizer dashboard, resale marketplace, and gate-staff
verification tool, all talking to the
[backend API](https://github.com/StellarTickets/backend), which in turn
reads and writes through the
[`ticketing`](https://github.com/StellarTickets/blockchain) Soroban contract.

## Non-custodial wallet flow

This app never sends a private key anywhere. Every on-chain action (create
event, issue/purchase/transfer/check-in/revoke a ticket, list/cancel/buy a
resale listing) follows the same pattern:

1. Ask the backend to **build** an unsigned, fee-prepared XDR transaction for
   the action.
2. Have [Freighter](https://www.freighter.app/) **sign** it client-side —
   see [`src/lib/wallet.ts`](src/lib/wallet.ts).
3. Send the signed XDR back to the backend's **confirm** endpoint, which
   relays it to Soroban RPC.

[`src/lib/onchain.ts`](src/lib/onchain.ts) wires these three steps together;
every page under `src/app/dashboard`, `src/app/verify`, `src/app/marketplace`,
and `src/app/my-tickets` calls it the same way.

## Pages

| Route | Purpose |
|---|---|
| `/` | Marketing landing page — brand, mission, all 12 supported industries |
| `/login`, `/register` | Auth |
| `/dashboard` | Organizer: create an organization, see your organizations |
| `/dashboard/organizations/[id]` | Create events under an organization |
| `/dashboard/events/[id]` | Add ticket types, publish on-chain, issue tickets |
| `/verify` | Gate staff: look up a ticket by its code, check in or revoke it |
| `/my-tickets` | Attendee: view owned tickets, transfer or list for resale |
| `/marketplace` | Browse and buy resale-listed tickets |

## Development

```bash
npm install
cp .env.example .env.local   # point NEXT_PUBLIC_API_URL at a running backend
npm run dev
```

Requires the [backend](https://github.com/StellarTickets/backend) running
locally (or reachable) and the [Freighter](https://www.freighter.app/)
browser extension for any wallet-signed action.

## Testing

```bash
npm run lint
npx tsc --noEmit
npm test
npm run build
```

## More documentation

See [`docs/`](docs/README.md) for architecture, components, styling,
and FAQ.
