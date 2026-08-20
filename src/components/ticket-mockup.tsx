import { CheckCircle2 } from 'lucide-react';

/** A static, illustrative ticket card for the marketing hero — not real ticket data. */
export function TicketMockup() {
  return (
    <div className="relative mx-auto w-full max-w-sm rotate-2 rounded-2xl border border-border-bright bg-surface shadow-2xl shadow-violet/10 transition-transform hover:rotate-0">
      <div className="h-2 rounded-t-2xl bg-gradient-sunset" />
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs tracking-wide text-muted uppercase">Concert · GA</p>
            <h3 className="mt-1 font-heading text-xl font-bold">Nova Skyline Tour</h3>
            <p className="mt-1 text-sm text-muted">Amphitheater · Sept 14, 8:00 PM</p>
          </div>
          <span className="flex items-center gap-1 rounded-full bg-emerald-950/60 px-2.5 py-1 text-xs font-medium text-emerald-400">
            <CheckCircle2 className="h-3.5 w-3.5" /> Valid
          </span>
        </div>

        <div className="ticket-notch my-6 border-t border-dashed border-border-bright" />

        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-muted">Seat</p>
            <p className="font-mono text-sm">GA-014</p>
          </div>
          <div>
            <p className="text-xs text-muted">Owner</p>
            <p className="font-mono text-sm">GBOA…7F2K</p>
          </div>
          <div className="flex gap-0.5">
            {Array.from({ length: 14 }).map((_, i) => (
              <span
                key={i}
                className="w-1 rounded-full bg-foreground/70"
                style={{ height: 12 + ((i * 7) % 20) }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
