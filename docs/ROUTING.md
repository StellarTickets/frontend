# Routing

Next.js App Router, no middleware-based auth — every page that needs
a logged-in user checks `useAuth()` client-side and redirects to
`/login` itself (see any page under `src/app/dashboard`, `/verify`,
`/my-tickets`, `/marketplace`). This is a deliberate simplification:
the whole authenticated experience is client-rendered anyway (data
comes from the backend API, not server components), so a redirect
flash on first paint is an acceptable tradeoff against the complexity
of wiring up `middleware.ts`/`proxy.ts` for a JWT stored in
`localStorage` (which isn't readable from the edge/middleware layer
without extra plumbing).
