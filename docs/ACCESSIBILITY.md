# Accessibility

Not audited yet. Known gaps to address before a production launch:

- The custom cursor dot (`src/components/custom-cursor.tsx`) is
  decorative-only and already respects `prefers-reduced-motion` and
  coarse-pointer devices, but hasn't been tested with a screen reader
  running alongside it.
- Form inputs across `/login`, `/register`, and the dashboard forms
  rely on native `<label>` wrapping, not explicit `htmlFor`/`id` pairs
  — works, but worth an audit.
- The marquee rows (`src/components/marquee.tsx`) mark the duplicated
  half as `aria-hidden` already; the visible half has no live-region
  concerns since it's decorative.
