import Link from 'next/link';
import { Logo } from './logo';

const COLUMNS: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: 'Product',
    links: [
      { label: 'Marketplace', href: '/marketplace' },
      { label: 'Get started', href: '/register' },
      { label: 'Organizer dashboard', href: '/dashboard' },
      { label: 'Verify a ticket', href: '/verify' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', href: '/about' },
      { label: 'Security', href: '/security' },
    ],
  },
  {
    title: 'Source',
    links: [
      { label: 'Frontend', href: 'https://github.com/StellarTickets/frontend' },
      { label: 'Backend', href: 'https://github.com/StellarTickets/backend' },
      { label: 'Blockchain', href: 'https://github.com/StellarTickets/blockchain' },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Logo className="text-foreground" />
            <p className="mt-3 max-w-xs text-sm text-muted">
              Blockchain ticketing infrastructure for events, travel, entertainment, and
              transportation.
            </p>
          </div>
          {COLUMNS.map((column) => (
            <div key={column.title}>
              <h3 className="text-sm font-semibold text-foreground">{column.title}</h3>
              <ul className="mt-3 flex flex-col gap-2 text-sm text-muted">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="hover:text-foreground">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-col gap-2 border-t border-border pt-6 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {new Date().getFullYear()} StellarTickets.</p>
          <p>Open source, top to bottom.</p>
        </div>
      </div>
    </footer>
  );
}
