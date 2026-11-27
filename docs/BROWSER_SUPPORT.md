# Browser support

Targets the same baseline as Next.js 16: Chrome 111+, Edge 111+,
Firefox 111+, Safari 16.4+. Freighter wallet actions additionally
require the Freighter browser extension, which is Chromium/Firefox
only — Safari users can browse and read but not sign transactions
until Freighter (or another supported wallet) ships Safari support.

## `AbortSignal.any` compatibility note

`src/lib/api.ts` combines a per-request timeout signal with any caller-supplied
cancellation signal. `AbortSignal.any` (the native API for this) is only
available in Safari 17.4+ and Firefox 124+, which is narrower than the stated
floor. `apiFetch` therefore falls back to a manual `AbortController` shim when
`AbortSignal.any` is not present, keeping the documented Safari 16.4 / Firefox
111 baseline intact. See [#436](https://github.com/StellarTickets/frontend/issues/436).
