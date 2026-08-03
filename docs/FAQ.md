# FAQ

**Why does this app need a wallet at all for browsing?**
It doesn't — `/`, `/about`, `/security`, and the marketing pages work
with no wallet. A wallet is only required once you buy, receive, or
resell a ticket, since that's when something needs to be signed.

**Why is the verify page manual-entry only, not a camera scanner?**
Camera-based QR scanning isn't implemented yet — see `ROADMAP.md`.
Manual code entry is a real, complete implementation of the same
verification flow, not a placeholder for the camera version.

**Where does the gradient come from?**
`BRAND_GRADIENT` in `src/components/logo.tsx` and `--gradient-sunset`
in `src/app/globals.css` are kept in sync deliberately — see the
comment in `globals.css`.
