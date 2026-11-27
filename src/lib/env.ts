/**
 * Guards against a public env var silently falling back to a dev-only
 * default in a production build (#37). `api.ts`'s `NEXT_PUBLIC_API_URL`
 * fallback (`http://localhost:3000`) is the case that prompted this: if the
 * var is forgotten when building for production, every visitor's browser
 * tries to call *its own* localhost instead of the real backend, and the
 * failure looks like a backend outage rather than a config mistake.
 *
 * `NODE_ENV === 'production'` is Next.js's own signal for "this is a real
 * build", set automatically by `next build` — not something this app sets
 * itself — so this doesn't need a separate build-time flag.
 */
export function resolveEnv(name: string, value: string | undefined, devFallback: string): string {
  if (value) return value;
  if (process.env.NODE_ENV === 'production') {
    throw new Error(
      `Missing required environment variable: ${name}. This must be set for production builds.`,
    );
  }
  return devFallback;
}
