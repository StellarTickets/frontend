# Performance notes

- The particle network canvas (`src/components/particle-network.tsx`)
  redraws every frame via `requestAnimationFrame` — it's a small,
  fixed particle count (60) and skips entirely under
  `prefers-reduced-motion`, but hasn't been profiled on low-end mobile.
- Marquee rows are pure CSS `@keyframes` animations, not JS-driven, so
  they're cheap regardless of particle count.
- No image optimization concerns yet — the site currently has no
  raster hero imagery, only the generated OG image and the SVG/HTML
  logo mark.
