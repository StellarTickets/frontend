# Environment variables

See [`.env.example`](../.env.example):

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_API_URL` | Backend base URL |
| `NEXT_PUBLIC_APP_URL` | Public origin this frontend is served from, used for canonical/OG URLs and `sitemap.xml`. **Must be the public origin in production** (e.g. `https://stellartickets.app`) — it falls back to `http://localhost:3001` when unset |
| `NEXT_PUBLIC_STELLAR_NETWORK` | Must match the backend's configured network |
| `NEXT_PUBLIC_STELLAR_NETWORK_PASSPHRASE` | Passed to Freighter when signing, must match the network above |

All of them are `NEXT_PUBLIC_*` because they're read client-side (the
API base URL for `fetch`, the network passphrase for wallet signing)
— none of them are secret.
