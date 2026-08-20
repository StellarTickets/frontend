# Responsive design

Tailwind's default breakpoints (`sm`, `md`, `lg`) throughout — the
hero grid, industries grid, and step timeline all collapse to a single
column below `lg`. The giant viewport-relative headline sections use
`vw`-based font sizes with `sm`/`lg` clamps so they scale down
proportionally on narrow screens rather than wrapping awkwardly.
