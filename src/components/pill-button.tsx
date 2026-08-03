import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

/** A pill CTA whose gradient fill wipes in from the left on hover. */
export function PillButton({
  href,
  children,
  variant = 'solid',
}: {
  href: string;
  children: React.ReactNode;
  variant?: 'solid' | 'outline';
}) {
  return (
    <Link
      href={href}
      className={`group relative inline-flex items-center overflow-hidden rounded-full border px-6 py-3 font-semibold ${
        variant === 'solid'
          ? 'border-transparent bg-gradient-sunset text-white shadow-lg shadow-violet/20'
          : 'border-border-bright text-foreground'
      }`}
    >
      {variant === 'outline' && (
        <span className="absolute inset-0 -translate-x-full bg-gradient-sunset transition-transform duration-300 ease-out group-hover:translate-x-0" />
      )}
      <span className="relative flex items-center gap-2 transition-colors duration-300 group-hover:text-white">
        {children}
        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
      </span>
    </Link>
  );
}
