/** The site's one gradient, defined here in the raw values it needs everywhere: Tailwind's `bg-gradient-sunset` class in the browser, and this exact CSS string for the icon/opengraph-image generators, which don't process Tailwind. */
export const BRAND_GRADIENT = 'linear-gradient(135deg, #a78bfa 0%, #f472b6 55%, #f5b400 100%)';

/**
 * The StellarTickets mark: an "ST" monogram badge in the brand gradient.
 * Built from inline styles (not Tailwind classes) so it renders identically
 * in the browser (Navbar, Footer) and in icon.tsx / opengraph-image.tsx,
 * which render through satori and only understand inline styles.
 */
export function LogoMark({ size = 32, className }: { size?: number; className?: string }) {
  return (
    <div
      className={className}
      style={{
        position: 'relative',
        display: 'flex',
        width: size,
        height: size,
        flexShrink: 0,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: size * 0.28,
        backgroundImage: BRAND_GRADIENT,
      }}
    >
      <span
        style={{
          color: '#ffffff',
          fontWeight: 700,
          fontSize: size * 0.42,
          letterSpacing: '-0.03em',
          lineHeight: 1,
        }}
      >
        ST
      </span>
    </div>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-2 font-heading font-bold tracking-tight ${className ?? ''}`}
    >
      <LogoMark size={30} className="-rotate-3" />
      StellarTickets
    </span>
  );
}
