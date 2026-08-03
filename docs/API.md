# Backend endpoints this app calls

| Page | Endpoints |
|---|---|
| `/login`, `/register` | `POST /auth/login`, `POST /auth/register` |
| `/dashboard` | `GET/POST /organizations`, `GET /organizations/mine` |
| `/dashboard/organizations/[id]` | `GET /organizations/:id`, `GET/POST /organizations/:id/events` |
| `/dashboard/events/[id]` | `GET /events/:id`, `POST /events/:id/ticket-types`, `POST /events/:id/publish` + `confirm-publish`, `POST /tickets/issue` + `confirm-issue` |
| `/marketplace` | `GET /tickets/resale`, `POST /tickets/:id/buy-resale` + `confirm-buy-resale` |
| `/my-tickets` | `GET /tickets/mine`, transfer/list/cancel-resale + confirm variants |
| `/verify` | `GET /tickets/verify/:qrSecret`, check-in/revoke + confirm variants |
| all pages | `GET /users/me`, `PATCH /users/me/wallet`, `GET /users/lookup` |

See [`src/lib/api.ts`](../src/lib/api.ts) for the fetch wrapper and
[`src/lib/onchain.ts`](../src/lib/onchain.ts) for how build/confirm
pairs are wired to wallet signing.
