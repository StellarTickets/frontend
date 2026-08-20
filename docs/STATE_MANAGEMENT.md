# State management

No external state library — `src/lib/auth-context.tsx` is the only
shared client state (a React Context holding the current user and
loading flag), refreshed from `GET /users/me` on mount. Every other
page fetches its own data locally with `useState`/`useEffect`; there's
no caching layer (no React Query/SWR) yet, so navigating between pages
re-fetches rather than reusing prior results.
