import type { Metadata } from 'next';
import { KeyRound, ShieldCheck, Scan, Ban, TrendingDown, Split } from 'lucide-react';

export const metadata: Metadata = { title: 'Security' };

const MECHANISMS = [
  {
    icon: KeyRound,
    title: 'We never hold your keys',
    body: 'Every write — issuing, transferring, checking in, or reselling a ticket — is built as an unsigned transaction on our servers, signed inside your own Freighter wallet, and only then submitted to the network. Our database has nowhere to store a private key because it never sees one.',
  },
  {
    icon: Scan,
    title: 'Verification reads the chain, not our database',
    body: 'When gate staff scan a ticket, the API asks the Soroban contract directly for that ticket’s current owner and status. A cached copy in our own database is reconciled against that answer on every check — it is never the source of truth.',
  },
  {
    icon: ShieldCheck,
    title: 'Check-in can only happen once',
    body: 'The contract enforces the state transition itself: Valid → Used. A second scan of the same ticket is rejected on-chain, not just by client-side logic that a modified app could skip.',
  },
  {
    icon: Ban,
    title: 'Organizers can revoke a fraudulent ticket',
    body: 'A chargeback, a counterfeit report, a policy violation — an organizer can void a ticket on-chain. A revoked ticket can never be checked in, transferred, or resold again, permanently.',
  },
  {
    icon: TrendingDown,
    title: 'Resale price is capped by the contract',
    body: 'Every event sets a maximum resale multiplier when it’s published. Listing a ticket above that cap is rejected by the contract itself — not a terms-of-service line nobody reads.',
  },
  {
    icon: Split,
    title: 'Royalties settle atomically',
    body: 'When a resale ticket sells, the organizer’s royalty and the seller’s proceeds are paid out in the same on-chain transaction as the ownership transfer. There is no intermediate state where a payment succeeded but ownership didn’t move, or vice versa.',
  },
];

export default function SecurityPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-24">
      <p className="text-sm font-medium tracking-wide text-gradient uppercase">Security</p>
      <h1 className="mt-3 font-heading text-4xl font-bold tracking-tight sm:text-5xl">
        How verification and fraud prevention actually work
      </h1>
      <p className="mt-6 text-lg text-muted">
        Every claim below maps to a real function in the{' '}
        <a
          href="https://github.com/StellarTickets/blockchain/blob/main/contracts/ticketing/src/lib.rs"
          target="_blank"
          rel="noopener noreferrer"
          className="text-foreground underline underline-offset-2"
        >
          ticketing contract
        </a>
        . There is no marketing layer sitting on top of a system that works differently underneath.
      </p>

      <div className="mt-12 flex flex-col gap-6">
        {MECHANISMS.map(({ icon: Icon, title, body }) => (
          <div key={title} className="flex gap-4 rounded-xl border border-border bg-surface p-6">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-sunset">
              <Icon className="h-5 w-5 text-white" strokeWidth={2} />
            </div>
            <div>
              <h2 className="font-heading font-semibold text-foreground">{title}</h2>
              <p className="mt-1.5 text-sm text-muted">{body}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-16 rounded-xl border border-border-bright bg-surface p-8">
        <h2 className="font-heading text-xl font-bold">The gate code</h2>
        <p className="mt-3 text-sm text-muted">
          Every ticket carries a per-ticket secret embedded in its scannable code. Verifying that
          code against our records is only the first check — the on-chain owner and status check
          above is what actually decides whether a scan is valid, so a photographed or forwarded
          code alone can&apos;t be reused once it&apos;s been checked in.
        </p>
      </div>

      <p className="mt-10 text-sm text-muted">
        Found something that doesn&apos;t match this description? The contract, API, and this
        site are all open source — please open an issue on the relevant repository.
      </p>
    </div>
  );
}
