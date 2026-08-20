import { CheckCircle2 } from 'lucide-react';
import { LogoMark } from './logo';

const POINTS = [
  'Tickets minted as real Stellar assets — nothing to screenshot or forge',
  'Resale capped by the organizer, enforced by the contract itself',
  'Your wallet signs every action — we never hold your keys',
];

export function AuthLayout({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto grid min-h-[85vh] max-w-5xl grid-cols-1 items-center gap-10 px-6 py-16 md:grid-cols-[1.1fr_1fr] md:gap-16">
      <div className="hidden flex-col justify-center md:flex">
        <LogoMark size={56} />
        <h2 className="mt-8 font-heading text-4xl leading-tight font-bold text-balance">
          Own the ticket, <span className="text-gradient">not just a claim to it</span>
        </h2>
        <ul className="mt-8 flex flex-col gap-4">
          {POINTS.map((point) => (
            <li key={point} className="flex items-start gap-3 text-sm text-muted">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-amber" />
              {point}
            </li>
          ))}
        </ul>
      </div>

      <div className="w-full rounded-3xl border border-border-bright bg-surface p-8 shadow-2xl shadow-black/60 sm:p-10">
        <div className="mb-8 flex items-center gap-3 md:hidden">
          <LogoMark size={32} />
        </div>
        <h1 className="font-heading text-2xl font-bold sm:text-3xl">{title}</h1>
        <p className="mt-2 text-sm text-muted">{subtitle}</p>
        <div className="mt-8">{children}</div>
      </div>
    </div>
  );
}
