# Accessibility

Not audited yet. Known gaps to address before a production launch:

## Review checklist — contrast

Before merging UI changes that introduce or modify badges, chips, or
status indicators, verify the following:

- **Text contrast ≥ 4.5:1** for `text-xs` / `text-sm` (normal weight).
  Use the WCAG contrast checker at <https://webaim.org/resources/contrastchecker/>.
- **Background tokens are not text tokens.** `--muted` / `text-muted` is
  a text colour; using it as a background (`bg-muted`) against a light
  foreground produces ~1.6:1 and fails WCAG AA. Use `--surface-2` with a
  `--border` outline and a status colour (`text-info`, `text-success`,
  `text-warning`, `text-danger`) for inline chips, or the `StatusBadge`
  component if one exists for the semantic.
- **Status chips carry semantic weight.** The category chip on `/events`
  is the only place the event type is shown; "Your listing" on
  `/marketplace` is the only marker preventing a user from buying their
  own ticket. These must remain legible at all viewport sizes.

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
