# Testing

Pure logic modules under `src/lib` are unit tested with
[Vitest](https://vitest.dev/) + jsdom:

```bash
npm test
```

Page components aren't unit tested yet — they're client components
that mostly orchestrate `fetch` calls and wallet signing, so the
highest-value coverage lives in `src/lib` (the API client, the
non-custodial signing flow, token storage) rather than in component
snapshot tests.

For UI changes, run `npm run dev` and manually exercise the affected
page — see the root README for the golden-path flows to check.

## End-to-End Tests

Browser-level smoke tests for public pages use [Playwright](https://playwright.dev/):

```bash
npm run build
npm run test:e2e
```

The test suite exercises:
- Home page hero and FAQ sections
- Navbar responsive collapsing into the mobile menu at 390px viewport width
- Form submission error handling on `/login` and `/register` with mocked API responses
- Unauthenticated access redirect from `/dashboard` to `/login`

