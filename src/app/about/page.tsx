import type { Metadata } from 'next';
import Link from 'next/link';
import { INDUSTRIES, INDUSTRY_LABELS } from '@/lib/types';

export const metadata: Metadata = { title: 'About' };

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-24">
      <p className="text-sm font-medium tracking-wide text-gradient uppercase">Our mission</p>
      <h1 className="mt-3 font-heading text-4xl font-bold tracking-tight sm:text-5xl">
        The world&apos;s ticketing infrastructure, rebuilt on Stellar
      </h1>
      <p className="mt-6 text-lg text-muted">
        StellarTickets exists because paper tickets and PDF screenshots don&apos;t verify
        themselves, and the resale market built around that gap mostly serves scalpers, not fans.
        We build the infrastructure that lets any organization — a concert promoter, an airline,
        a university, a bus company — issue tickets that are provably real, provably owned by one
        person at a time, and provably priced within the rules the issuer set.
      </p>

      <h2 className="mt-16 font-heading text-2xl font-bold">Why a blockchain, specifically</h2>
      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        <div className="rounded-xl border border-border bg-surface p-6">
          <h3 className="font-heading font-semibold text-foreground">One source of truth</h3>
          <p className="mt-2 text-sm text-muted">
            Ownership lives on the Stellar ledger, not in a database a venue or a reseller
            controls. Anyone can check a ticket&apos;s current owner and status without asking us
            for permission.
          </p>
        </div>
        <div className="rounded-xl border border-border bg-surface p-6">
          <h3 className="font-heading font-semibold text-foreground">Rules enforced in code</h3>
          <p className="mt-2 text-sm text-muted">
            Resale price caps and organizer royalties aren&apos;t policy on a poster — they&apos;re
            enforced by the smart contract itself, on every single resale.
          </p>
        </div>
        <div className="rounded-xl border border-border bg-surface p-6">
          <h3 className="font-heading font-semibold text-foreground">Settlement in seconds</h3>
          <p className="mt-2 text-sm text-muted">
            Stellar confirms transactions in a few seconds for a fraction of a cent, which is
            what makes on-chain issuance practical at concert-ticket scale.
          </p>
        </div>
        <div className="rounded-xl border border-border bg-surface p-6">
          <h3 className="font-heading font-semibold text-foreground">Non-custodial by design</h3>
          <p className="mt-2 text-sm text-muted">
            We never hold your keys. Every transaction is signed in your own wallet — see our{' '}
            <Link href="/security" className="text-foreground underline underline-offset-2">
              security page
            </Link>{' '}
            for the full flow.
          </p>
        </div>
      </div>

      <h2 className="mt-16 font-heading text-2xl font-bold">One model, twelve industries</h2>
      <p className="mt-4 text-muted">
        Rather than build a separate product per vertical, every ticket on StellarTickets — a
        concert GA pass, a flight seat, a museum entry, a semester bus pass — is the same
        underlying asset: an event, a tier, a seat, an owner, a status. The industry is metadata,
        not a different code path, which is what lets us support all twelve from day one:
      </p>
      <div className="mt-6 flex flex-wrap gap-2">
        {INDUSTRIES.map((industry) => (
          <span
            key={industry}
            className="rounded-full border border-border-bright bg-surface px-3 py-1 text-xs text-muted"
          >
            {INDUSTRY_LABELS[industry]}
          </span>
        ))}
      </div>

      <div className="mt-16 rounded-xl border border-border-bright bg-surface p-8">
        <h2 className="font-heading text-xl font-bold">Open source, top to bottom</h2>
        <p className="mt-3 text-sm text-muted">
          The smart contract, the API, and this site are all public. Read the code, run it
          yourself, or verify a claim we made above.
        </p>
        <div className="mt-4 flex flex-wrap gap-4 text-sm">
          <a
            href="https://github.com/StellarTickets/blockchain"
            className="text-gradient font-medium hover:underline"
          >
            Blockchain contract →
          </a>
          <a
            href="https://github.com/StellarTickets/backend"
            className="text-gradient font-medium hover:underline"
          >
            Backend API →
          </a>
          <a
            href="https://github.com/StellarTickets/frontend"
            className="text-gradient font-medium hover:underline"
          >
            This site →
          </a>
        </div>
      </div>
    </div>
  );
}
