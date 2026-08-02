import Link from 'next/link';
import { INDUSTRIES, INDUSTRY_LABELS } from '@/lib/types';

const FEATURES = [
  {
    title: 'Issue',
    description:
      'Every ticket is minted as a real asset on Stellar the moment it is sold — no spreadsheets, no PDFs that can be duplicated.',
  },
  {
    title: 'Verify',
    description:
      'Gate staff check a ticket’s on-chain owner and status in real time. A screenshot or a photocopy simply will not scan as valid.',
  },
  {
    title: 'Transfer',
    description:
      'Send a ticket to a friend or family member with a direct, on-chain ownership transfer — no email forwarding, no shared logins.',
  },
  {
    title: 'Resell',
    description:
      'A built-in resale marketplace with an organizer-defined price cap and royalty split — curbing scalping while still letting fans resell fairly.',
  },
];

export default function Home() {
  return (
    <div>
      <section className="mx-auto max-w-6xl px-6 pt-24 pb-20 text-center">
        <p className="mb-4 text-sm font-medium tracking-wide text-primary uppercase">
          Secure. Verifiable. Powered by Stellar.
        </p>
        <h1 className="mx-auto max-w-3xl text-5xl font-bold tracking-tight text-balance sm:text-6xl">
          Blockchain-powered ticketing for events, travel, and transportation
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted">
          StellarTickets lets organizations issue, manage, verify, transfer, and resell tickets as
          real assets on the Stellar network — with fraud prevention and a trusted resale
          marketplace built in.
        </p>
        <div className="mt-10 flex items-center justify-center gap-4">
          <Link
            href="/register"
            className="rounded-md bg-primary px-6 py-3 font-medium text-primary-foreground hover:opacity-90"
          >
            Start issuing tickets
          </Link>
          <Link
            href="/marketplace"
            className="rounded-md border border-border px-6 py-3 font-medium hover:bg-surface"
          >
            Browse the marketplace
          </Link>
        </div>
      </section>

      <section className="border-t border-border bg-surface/40">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <h2 className="text-2xl font-semibold">One ticket model, twelve industries</h2>
          <p className="mt-2 max-w-2xl text-muted">
            Concerts, flights, sports, festivals, conferences, buses, movie theaters, museums,
            attractions, transit, universities, corporate events — every ticket is the same
            verifiable Stellar asset underneath.
          </p>
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {INDUSTRIES.map((industry) => (
              <div
                key={industry}
                className="rounded-lg border border-border bg-background px-4 py-3 text-sm"
              >
                {INDUSTRY_LABELS[industry]}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="text-2xl font-semibold">The full ticket lifecycle, on-chain</h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          {FEATURES.map((feature) => (
            <div key={feature.title} className="rounded-lg border border-border p-6">
              <h3 className="text-lg font-semibold text-primary">{feature.title}</h3>
              <p className="mt-2 text-muted">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-border">
        <div className="mx-auto max-w-6xl px-6 py-16 text-center">
          <h2 className="text-2xl font-semibold">Our mission</h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted">
            Build the world’s leading blockchain-powered ticketing infrastructure for events,
            travel, entertainment, and transportation.
          </p>
        </div>
      </section>
    </div>
  );
}
