# Component inventory

All shared components live in `src/components/`. They are split into three
groups below.

## Conventions

**Server vs Client split** — components are Server Components by default (no
`'use client'` directive). Add `'use client'` only when the component needs
state, effects, event handlers, or browser APIs. The table marks each
Client Component with **`[C]`**.

**`className` passthrough** — primitive components (`Button`, `TextField`,
`FormField`, `Breadcrumbs`) accept a `className` prop so callers can extend
spacing or layout without wrapping. Never use it to change colours or override
variant logic — that belongs in the variant/size prop.

**Where to add new components** — drop a `.tsx` file in `src/components/`
(kebab-case filename). If it needs `'use client'`, add the directive as the
very first line. Re-export complex sub-parts (e.g. `FieldHint`, `Input`,
`Select`) from the same file so imports stay at one path.

---

## Primitives

Reuse these instead of inline HTML or one-off styled elements.

| Component | File | Notes |
|---|---|---|
| `Button` / `buttonClassName` | `button.tsx` | `variant` (`primary`\|`secondary`\|`danger`) + `size` (`sm`\|`md`\|`lg`). `buttonClassName` is the class builder exported for cases where a `<button>` can't be used. |
| `TextField` **`[C]`** | `text-field.tsx` | Labelled input with optional leading icon and error message. Wraps a native `<input>`. |
| `FormField` / `FieldHint` / `Input` / `Select` | `form-field.tsx` | Lower-level field primitives (#129, #302). `FIELD_CONTROL_CLASS` exported for consistent input styling. |
| `FormError` | `form-error.tsx` | Inline error banner for form-level errors (not field-level). Renders nothing when `message` is null. |
| `ConfirmDialog` **`[C]`** | `confirm-dialog.tsx` | Modal confirmation prompt. Traps focus; dismisses on Escape. |
| `CopyButton` **`[C]`** | `copy-button.tsx` | Icon button that copies text to clipboard with a check-mark flash. |
| `Breadcrumbs` | `breadcrumbs.tsx` | Accessible `<nav aria-label="Breadcrumb">` trail. Accepts a `Crumb[]` array. |
| `StatusBadge` / `STATUS_STYLES` / `STATUS_LABELS` | `status-badge.tsx` | Colour-coded pill for `TicketStatus` and `EventStatus`. `/verify` imports `STATUS_STYLES`/`STATUS_LABELS` directly for inline use. |

---

## Domain components

Feature-specific components tied to ticketing or wallet concepts.

| Component | File | Notes |
|---|---|---|
| `WalletConnectButton` **`[C]`** | `wallet-connect-button.tsx` | Freighter connect/disconnect flow. Shown on all authenticated pages. |
| `EventDetails` | `event-details.tsx` | Read-only summary card for an `EventRecord`. Used in dashboard and marketplace. |
| `TicketQr` **`[C]`** | `ticket-qr.tsx` | Renders a ticket's `qrSecret` as a QR image (never plain text). Uses the `qrcode` package. |
| `QrScanner` **`[C]`** | `qr-scanner.tsx` | Camera-based QR reader on the `/verify` page. Uses the `BarcodeDetector` API. |
| `JsonLd` | `json-ld.tsx` | Server component that injects schema.org JSON-LD into `<head>`. |

---

## Chrome / layout

Site shell and marketing-only components.

| Component | File | Notes |
|---|---|---|
| `Navbar` **`[C]`** | `navbar.tsx` | Top navigation bar. Reads auth state; closes mobile drawer on route change. |
| `Footer` | `footer.tsx` | Site footer with link columns. Server Component. |
| `AuthLayout` | `auth-layout.tsx` | Centred two-column wrapper for `/login` and `/register`. |
| `Providers` **`[C]`** | `providers.tsx` | Root `AuthProvider` wrapper. Rendered in `src/app/layout.tsx`. |
| `Logo` / `LogoMark` | `logo.tsx` | ST monogram badge + wordmark. `BRAND_GRADIENT` exported for icon/OG-image generators. |
| `PillButton` | `pill-button.tsx` | Gradient hover-reveal CTA used on marketing pages. |
| `Marquee` | `marquee.tsx` | CSS-only infinite-scroll pill row. Content duplicated once and translated −50 %. |
| `ParticleNetwork` **`[C]`** | `particle-network.tsx` | Canvas dot-network hero background. |
| `AudienceToggle` **`[C]`** | `audience-toggle.tsx` | Attendees / Organizers pill tab switcher on the homepage. |
| `TicketMockup` | `ticket-mockup.tsx` | Static illustrative ticket card in the marketing hero — not real ticket data. |
