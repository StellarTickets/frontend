# Third-party services

| Service | Used for |
|---|---|
| Freighter (browser extension) | Wallet connect + transaction signing |
| Stellar/Soroban RPC (via the backend) | On-chain reads/writes — the frontend never calls RPC directly |
| Google Fonts (via `next/font/google`) | Space Grotesk, Inter — self-hosted at build time, no runtime request to Google |

No analytics, error tracking, or ad services are integrated.
