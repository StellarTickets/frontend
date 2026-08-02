/** The StellarTickets mark: a ticket outline with a stub divider and a verification check — reused as-is in Navbar, icon.tsx, and opengraph-image.tsx. */
export function LogoMark({
  className,
  color = '#8b5cf6',
  size = 24,
}: {
  className?: string;
  color?: string;
  size?: number;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      width={size}
      height={size}
      className={className}
      aria-hidden="true"
    >
      <rect x="2" y="6" width="20" height="12" rx="2" stroke={color} strokeWidth="1.6" />
      <path d="M8 6v12" stroke={color} strokeWidth="1.6" strokeDasharray="1.5 1.8" />
      <path
        d="M4.5 12.2l1.4 1.4L8.3 11"
        stroke={color}
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 font-semibold ${className ?? ''}`}>
      <LogoMark className="h-6 w-6" />
      StellarTickets
    </span>
  );
}
