/**
 * Build-time environment check (#370).
 *
 * Run before `next build` (see package.json "build" script) to surface
 * missing NEXT_PUBLIC_* variables early — a clear error at build time is
 * better than a runtime failure inside a live route.
 *
 * Only NEXT_PUBLIC_API_URL is required for every build.
 * NEXT_PUBLIC_STELLAR_NETWORK_PASSPHRASE is required unless SKIP_WALLET=1
 * is set (e.g. when building a static/marketing-only preview that never
 * calls signTransaction).
 */

const required = ['NEXT_PUBLIC_API_URL'];

if (!process.env.SKIP_WALLET) {
  required.push('NEXT_PUBLIC_STELLAR_NETWORK_PASSPHRASE');
}

const missing = required.filter((name) => !process.env[name]);

if (missing.length > 0) {
  console.error('');
  console.error('build error: missing required environment variables:');
  for (const name of missing) {
    console.error(`  - ${name}`);
  }
  console.error('');
  console.error('Set these in your .env.local (dev) or deployment environment (prod).');
  console.error('To skip the wallet check for a preview build: SKIP_WALLET=1 npm run build');
  console.error('');
  process.exit(1);
}

console.log('check-env: all required variables present');
