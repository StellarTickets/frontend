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
