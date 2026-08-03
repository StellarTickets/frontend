import {
  Music,
  Plane,
  Trophy,
  PartyPopper,
  Presentation,
  Bus,
  Clapperboard,
  Landmark,
  MapPin,
  TrainFront,
  GraduationCap,
  Briefcase,
  Ticket,
  ScanLine,
  ArrowLeftRight,
  Repeat2,
  ShieldCheck,
  KeyRound,
  TrendingDown,
} from 'lucide-react';
import { INDUSTRIES, INDUSTRY_LABELS, type Industry } from '@/lib/types';
import { TicketMockup } from '@/components/ticket-mockup';
import { ParticleNetwork } from '@/components/particle-network';
import { Marquee } from '@/components/marquee';
import { PillButton } from '@/components/pill-button';
import { AudienceToggle } from '@/components/audience-toggle';

const INDUSTRY_ICONS: Record<Industry, React.ComponentType<{ className?: string }>> = {
  CONCERTS: Music,
  FLIGHTS: Plane,
  SPORTS: Trophy,
  FESTIVALS: PartyPopper,
  CONFERENCES: Presentation,
  BUS: Bus,
  MOVIE_THEATERS: Clapperboard,
  MUSEUMS: Landmark,
  TOURIST_ATTRACTIONS: MapPin,
  PUBLIC_TRANSPORT: TrainFront,
  UNIVERSITIES: GraduationCap,
  CORPORATE_EVENTS: Briefcase,
};

const INDUSTRY_MARQUEE = INDUSTRIES.map((i) => ({ label: INDUSTRY_LABELS[i], icon: INDUSTRY_ICONS[i] }));
const STACK_MARQUEE = [
  { label: 'Stellar' },
  { label: 'Soroban' },
  { label: 'Freighter' },
  { label: 'Next.js' },
  { label: 'NestJS' },
  { label: 'Prisma' },
  { label: 'Rust' },
  { label: 'PostgreSQL' },
  { label: 'Tailwind CSS' },
  { label: 'TypeScript' },
];

const STATS = [
  { value: '12', label: 'industries on one ticket model' },
  { value: '~5s', label: 'to settle a ticket on Stellar' },
  { value: '0', label: 'private keys we ever hold' },
  { value: '3', label: 'open-source repos, fully public' },
];

const STEPS = [
  {
    icon: Ticket,
    title: 'Issue',
    body: 'An organizer publishes an event and mints tickets as real Stellar assets — no spreadsheets, no PDFs that can be copied.',
  },
  {
    icon: ScanLine,
    title: 'Verify',
    body: 'Gate staff scan a ticket and the app checks its on-chain owner and status live. A screenshot doesn’t pass.',
  },
  {
    icon: ArrowLeftRight,
    title: 'Transfer',
    body: 'Send a ticket to a friend with a direct on-chain transfer — no email forwarding, no shared account logins.',
  },
  {
    icon: Repeat2,
    title: 'Resell',
    body: 'List on the built-in marketplace under the organizer’s price cap; royalties settle automatically on sale.',
  },
];

const SECURITY_HIGHLIGHTS = [
  {
    icon: KeyRound,
    title: 'Non-custodial',
    body: 'We never touch a private key. Every action is signed in your own wallet.',
  },
  {
    icon: ShieldCheck,
    title: 'On-chain checks',
    body: 'Verification and check-in read the contract directly — not a database we control.',
  },
  {
    icon: TrendingDown,
    title: 'Anti-scalping cap',
    body: 'Resale price is capped by the contract itself, enforced on every listing.',
  },
];

const FAQS = [
  {
    q: 'Do I need to know anything about crypto to use this?',
    a: 'To browse events and read ticket data, no. To buy, receive, or resell a ticket, you’ll connect a Stellar wallet (we support Freighter) the same way you’d connect a bank card — it’s a one-time setup per account.',
  },
  {
    q: 'Is StellarTickets custodial — can you access my tickets or funds?',
    a: 'No. We never store a private key. Every on-chain action is signed inside your own wallet before it’s submitted; see our security page for the exact flow.',
  },
  {
    q: 'What actually stops scalping?',
    a: 'Every event sets a maximum resale multiplier when it’s published, and the smart contract rejects any resale listing priced above that cap — it isn’t a policy that can be ignored.',
  },
  {
    q: 'What happens if I lose access to my wallet?',
    a: 'Your ticket is an asset owned by your wallet address, the same way any Stellar account works — wallet recovery is handled by your wallet provider (e.g. Freighter’s recovery phrase), not by StellarTickets.',
  },
];

export default function Home() {
  return (
    <div>
      <section className="relative overflow-hidden">
        <ParticleNetwork />
        <div className="relative mx-auto grid max-w-6xl gap-12 px-6 pt-20 pb-16 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:pt-28">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-border-bright bg-surface px-3 py-1 text-xs font-medium text-muted">
              <span className="h-1.5 w-1.5 rounded-full bg-gradient-sunset" />
              Secure. Verifiable. Powered by Stellar.
            </p>
            <h1 className="mt-6 font-heading text-5xl font-bold tracking-tight text-balance sm:text-6xl">
              Tickets that can&apos;t be <span className="text-gradient">faked, duplicated,</span>{' '}
              or scalped past the price cap
            </h1>
            <p className="mt-6 max-w-xl text-lg text-muted">
              StellarTickets lets organizations issue, verify, transfer, and resell tickets as
              real assets on the Stellar network — for concerts, flights, sports, festivals,
              transit, and eight more industries, all on one platform.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <PillButton href="/register">Start issuing tickets</PillButton>
              <PillButton href="/marketplace" variant="outline">
                Browse the marketplace
              </PillButton>
            </div>
          </div>
          <TicketMockup />
        </div>

        <div className="relative mt-4 space-y-3 py-2">
          <Marquee items={INDUSTRY_MARQUEE} />
          <Marquee items={STACK_MARQUEE} reverse />
        </div>

        <div className="relative border-t border-border bg-surface/60">
          <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-6 py-10 sm:grid-cols-4">
            {STATS.map((stat) => (
              <div key={stat.label}>
                <p className="font-heading text-3xl font-bold text-gradient">{stat.value}</p>
                <p className="mt-1 text-xs text-muted">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="overflow-hidden border-b border-border py-16">
        <h2 className="px-6 text-center font-heading text-[13vw] leading-none font-bold text-foreground/90 sm:text-[9vw] lg:text-[7vw]">
          Every ticket. Verified.
        </h2>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="font-heading text-3xl font-bold">The full ticket lifecycle, on-chain</h2>
        <p className="mt-2 max-w-2xl text-muted">
          Every step below is a real Soroban contract call, not a database flag.
        </p>
        <div className="relative mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="absolute top-6 right-0 left-0 hidden h-px bg-border-bright lg:block" />
          {STEPS.map((step, i) => (
            <div key={step.title} className="relative">
              <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-sunset">
                <step.icon className="h-6 w-6 text-white" strokeWidth={2} />
              </div>
              <p className="mt-4 text-xs font-medium text-muted">Step {i + 1}</p>
              <h3 className="mt-1 font-heading text-lg font-semibold">{step.title}</h3>
              <p className="mt-2 text-sm text-muted">{step.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-border bg-surface/40">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <h2 className="font-heading text-3xl font-bold">Choose your side of the platform</h2>
          <p className="mt-2 max-w-2xl text-muted">
            The same contract powers both — pick a view to see what it looks like from there.
          </p>
          <div className="mt-10">
            <AudienceToggle />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="font-heading text-3xl font-bold">One ticket model, twelve industries</h2>
        <p className="mt-2 max-w-2xl text-muted">
          Every industry below issues, verifies, transfers, and resells through the exact same
          contract — the industry is metadata, not a different product.
        </p>
        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {INDUSTRIES.map((industry) => {
            const Icon = INDUSTRY_ICONS[industry];
            return (
              <div
                key={industry}
                className="flex items-center gap-3 rounded-xl border border-border bg-surface px-4 py-4 transition-colors hover:border-border-bright"
              >
                <Icon className="h-5 w-5 shrink-0 text-violet" />
                <span className="text-sm">{INDUSTRY_LABELS[industry]}</span>
              </div>
            );
          })}
        </div>
      </section>

      <section className="border-t border-border bg-surface/40">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div>
              <h2 className="font-heading text-3xl font-bold">Built to be verified, not trusted</h2>
              <p className="mt-3 text-muted">
                We designed StellarTickets so you don&apos;t have to take our word for any of this
                — read exactly how it works.
              </p>
              <PillButton href="/security" variant="outline">
                Read the security breakdown
              </PillButton>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {SECURITY_HIGHLIGHTS.map((item) => (
                <div key={item.title} className="rounded-xl border border-border bg-background p-5">
                  <item.icon className="h-5 w-5 text-amber" strokeWidth={2} />
                  <h3 className="mt-3 font-heading font-semibold">{item.title}</h3>
                  <p className="mt-1.5 text-sm text-muted">{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-3xl px-6 py-20">
          <h2 className="font-heading text-3xl font-bold">Frequently asked</h2>
          <div className="mt-8 flex flex-col divide-y divide-border">
            {FAQS.map((faq) => (
              <details key={faq.q} className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium">
                  {faq.q}
                  <span className="text-muted transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 text-sm text-muted">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 pb-20">
        <div className="mx-auto max-w-5xl overflow-hidden rounded-3xl bg-gradient-sunset px-8 py-20 text-center text-white">
          <h2 className="font-heading text-[9vw] leading-[1.05] font-bold sm:text-[4.5vw]">
            Ready to issue your first ticket?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-white/85 sm:text-lg">
            For events, travel, entertainment, and transportation — one non-custodial platform,
            open source top to bottom.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <a
              href="/register"
              className="rounded-full bg-white px-6 py-3 font-semibold text-neutral-900 hover:opacity-90"
            >
              Create your account
            </a>
            <a
              href="/about"
              className="rounded-full border border-white/40 px-6 py-3 font-semibold text-white hover:bg-white/10"
            >
              Learn more
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
