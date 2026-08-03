'use client';

import { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { PillButton } from './pill-button';

const CONTENT = {
  attendees: {
    label: 'For Attendees',
    heading: 'Own your ticket, not just a screenshot of it',
    points: [
      'Buy or receive a ticket as a real Stellar asset — nothing to screenshot, print, or forge',
      'Transfer it to a friend directly from your wallet, no forwarding a PDF',
      'Resell it fairly if you can’t make it, capped at the organizer’s price limit',
    ],
    cta: { href: '/marketplace', label: 'Browse the marketplace' },
    cardFrom: 'from-[#150f22]',
  },
  organizers: {
    label: 'For Organizers',
    heading: 'Set the rules once, let the contract enforce them',
    points: [
      'Issue tickets on-chain for any of the 12 supported industries from one dashboard',
      'Set your own anti-scalping resale cap and royalty percentage per event',
      'Verify and check in attendees against the live on-chain owner and status',
    ],
    cta: { href: '/register', label: 'Create your organization' },
    cardFrom: 'from-violet-950',
  },
} as const;

type AudienceKey = keyof typeof CONTENT;

export function AudienceToggle() {
  const [active, setActive] = useState<AudienceKey>('attendees');
  const content = CONTENT[active];

  return (
    <div>
      <div className="relative inline-flex rounded-full border border-border bg-surface p-1">
        <div
          className={`absolute top-1 bottom-1 left-1 w-[168px] rounded-full bg-gradient-sunset transition-transform duration-300 ease-out ${
            active === 'organizers' ? 'translate-x-[168px]' : 'translate-x-0'
          }`}
        />
        {(Object.keys(CONTENT) as AudienceKey[]).map((key) => (
          <button
            key={key}
            onClick={() => setActive(key)}
            className={`relative z-10 w-[168px] rounded-full px-4 py-2.5 text-sm font-semibold transition-colors duration-300 ${
              active === key ? 'text-white' : 'text-muted hover:text-foreground'
            }`}
          >
            {CONTENT[key].label}
          </button>
        ))}
      </div>

      <div
        className={`mt-8 rounded-2xl border border-border-bright bg-gradient-to-b ${content.cardFrom} to-background p-8`}
      >
        <h3 className="font-heading text-2xl font-bold">{content.heading}</h3>
        <ul className="mt-6 flex flex-col gap-3">
          {content.points.map((point) => (
            <li key={point} className="flex items-start gap-3 text-sm text-neutral-200">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-amber" />
              {point}
            </li>
          ))}
        </ul>
        <div className="mt-8">
          <PillButton href={content.cta.href}>{content.cta.label}</PillButton>
        </div>
      </div>
    </div>
  );
}
