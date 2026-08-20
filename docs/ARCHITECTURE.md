# Architecture

## Non-custodial write flow

`src/lib/onchain.ts` wires together the three-step pattern every
on-chain action follows:

1. `src/lib/api.ts` asks the backend to build an unsigned XDR for the
   action.
2. `src/lib/wallet.ts` has Freighter sign it client-side.
3. The signed XDR is sent to the backend's matching `confirm-*`
   endpoint.

No other part of the app talks to Soroban directly.

## Auth state

`src/lib/auth-context.tsx` is a React context provider that holds the
JWT (in `localStorage`, via `src/lib/api.ts`) and the current user
profile, refreshed on mount and after login/register.

## Pages

Every route under `src/app` is a Next.js App Router page. Pages that
require auth check `useAuth()` and redirect to `/login` themselves —
there's no middleware-based route protection, since the whole app is
client-rendered post-auth anyway.
