# Styling

Tailwind CSS v4, configured entirely through `src/app/globals.css`'s
`@theme inline` block — there's no `tailwind.config.ts`, which v4
doesn't require for a project this size. Custom tokens
(`--color-surface`, `--color-violet`, `--gradient-sunset`, etc.) are
defined once in `:root` and mapped into Tailwind's theme so they're
usable as ordinary utility classes (`bg-surface`, `text-violet`,
`bg-gradient-sunset`).

Two font families: `Space Grotesk` (`font-heading`) for display text,
`Inter` (default `font-sans`) for body copy — both loaded via
`next/font/google` in `src/app/layout.tsx`.
