/** The site's one gradient, defined here in the raw values it needs everywhere: Tailwind's `bg-gradient-sunset` class in the browser, and this exact CSS string for the icon/opengraph-image generators, which don't process Tailwind. */
export const BRAND_GRADIENT = 'linear-gradient(135deg, #a78bfa 0%, #f472b6 55%, #f5b400 100%)';

/**
 * The StellarTickets mark: a solid ticket-stub shape in the brand gradient
 * with a dashed tear-line and a sparkle accent, with "ST" lettering
 * overlaid as HTML text (satori, used by icon.tsx / opengraph-image.tsx,
 * doesn't support SVG <text> — only the shape below is SVG; the letters are
 * a plain positioned span so they render the same way everywhere).
 */
export function LogoMark({ size = 32, className }: { size?: number; className?: string }) {
  const height = (size * 72) / 100;
  return (
    <div
      className={className}
      style={{ position: 'relative', display: 'flex', width: size, height, flexShrink: 0 }}
    >
      <svg viewBox="0 0 100 72" width={size} height={height} aria-hidden="true">
        <defs>
          <linearGradient id="st-mark-grad" x1="0" y1="0" x2="100" y2="72" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#a78bfa" />
            <stop offset="55%" stopColor="#f472b6" />
            <stop offset="100%" stopColor="#f5b400" />
          </linearGradient>
        </defs>
        <path
          d="M6 16C6 11.6 9.6 8 14 8H86C90.4 8 94 11.6 94 16V26C90.7 27.4 88.5 30.6 88.5 34.5C88.5 38.4 90.7 41.6 94 43V54C94 58.4 90.4 62 86 62H14C9.6 62 6 58.4 6 54V43C9.3 41.6 11.5 38.4 11.5 34.5C11.5 30.6 9.3 27.4 6 26V16Z"
          fill="url(#st-mark-grad)"
        />
        <path
          d="M64 8V62"
          stroke="rgba(10,7,16,0.35)"
          strokeWidth="2.5"
          strokeDasharray="1 7"
          strokeLinecap="round"
        />
        <path d="M76.5 15l1.6 4.5L83 21l-4.9 1.5L76.5 27l-1.6-4.5L70 21l4.9-1.5z" fill="#fff" opacity="0.9" />
      </svg>
      <div
        style={{
          position: 'absolute',
          left: size * 0.1,
          top: 0,
          width: size * 0.5,
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <span
          style={{
            color: '#0a0710',
            fontWeight: 700,
            fontStyle: 'italic',
            fontSize: size * 0.42,
            letterSpacing: '-0.04em',
            lineHeight: 1,
          }}
        >
          ST
        </span>
      </div>
    </div>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-2 font-heading font-bold tracking-tight ${className ?? ''}`}
    >
      <LogoMark size={38} />
      StellarTickets
    </span>
  );
}
