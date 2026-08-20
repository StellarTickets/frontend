# SEO

- `src/app/layout.tsx` sets `metadataBase` and a title template
  (`%s · StellarTickets`) so per-page `<title>` overrides compose
  correctly.
- `src/app/sitemap.ts` lists the public marketing routes.
- `src/app/opengraph-image.tsx` and `src/app/icon.tsx` generate the
  OG image and favicon at request time via `next/og`'s
  `ImageResponse` — both render through satori, which only supports
  a subset of CSS (no SVG `<text>`; gradients and flex layouts work).
- Authenticated pages (`/dashboard`, `/my-tickets`, `/verify`, etc.)
  intentionally have no special SEO treatment — they're not meant to
  be indexed.
