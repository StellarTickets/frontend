# Deployment checklist

1. `npx eslint .` — no lint errors
2. `npx tsc --noEmit` — clean typecheck
3. `npm test` — Vitest suite green
4. `npm run build` — production build succeeds
5. Set `NEXT_PUBLIC_API_URL` to the deployed backend's URL
6. Set `NEXT_PUBLIC_STELLAR_NETWORK` / `NEXT_PUBLIC_STELLAR_NETWORK_PASSPHRASE`
   to match the backend's configured network
7. Confirm Freighter (or whichever wallet) is set to the same network
   before testing any signed action in production
