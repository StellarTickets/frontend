/**
 * The StellarTickets mark: a torn ticket stub with a perforated tear-line
 * and a four-point "stellar" sparkle where the stub separates — reused as-is
 * in Navbar, Footer, icon.tsx, and opengraph-image.tsx.
 */
export function LogoMark({
  className,
  size = 28,
  gradient = true,
}: {
  className?: string;
  size?: number;
  /** Set false for static image-generation contexts (icon/opengraph) that render flat colors more reliably. */
  gradient?: boolean;
}) {
  const stroke = gradient ? 'url(#st-logo-grad)' : '#c4b5fd';
  const fill = gradient ? 'url(#st-logo-grad)' : '#f5b400';

  return (
    <svg
      viewBox="0 0 28 24"
      fill="none"
      width={size}
      height={(size * 24) / 28}
      className={className}
      aria-hidden="true"
    >
      {gradient && (
        <defs>
          <linearGradient id="st-logo-grad" x1="0" y1="0" x2="28" y2="24" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#a78bfa" />
            <stop offset="55%" stopColor="#f472b6" />
            <stop offset="100%" stopColor="#f5b400" />
          </linearGradient>
        </defs>
      )}
      <path
        d="M2.5 6.5C2.5 5.4 3.4 4.5 4.5 4.5H23.5C24.6 4.5 25.5 5.4 25.5 6.5V8.2C24.5 8.6 23.8 9.5 23.8 10.6C23.8 11.7 24.5 12.6 25.5 13V17.5C25.5 18.6 24.6 19.5 23.5 19.5H4.5C3.4 19.5 2.5 18.6 2.5 17.5V13C3.5 12.6 4.2 11.7 4.2 10.6C4.2 9.5 3.5 8.6 2.5 8.2V6.5Z"
        stroke={stroke}
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path d="M17 5v14" stroke={stroke} strokeWidth="1.5" strokeDasharray="1.4 2" />
      <path
        d="M20.6 8.4l0.7 2 2.1 0.7-2.1 0.7-0.7 2-0.7-2-2.1-0.7 2.1-0.7z"
        fill={fill}
        stroke="none"
      />
    </svg>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 font-heading font-bold tracking-tight ${className ?? ''}`}>
      <LogoMark size={26} className="-rotate-3" />
      StellarTickets
    </span>
  );
}
