'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';
import { actionErrorMessage } from '@/lib/action-error';
import { EVENTS_PAGE_SIZE, formatEventDate } from '@/lib/events';
import type { EventRecord, Paginated } from '@/lib/types';
import { FormError } from '@/components/form-error';
import { Button } from '@/components/button';

/** Public listing of published events (#282). No sign-in required. */
export default function EventsPage() {
  const [page, setPage] = useState(1);
  const [data, setData] = useState<Paginated<EventRecord> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    apiFetch<Paginated<EventRecord>>(`/events?page=${page}&limit=${EVENTS_PAGE_SIZE}`)
      .then((res) => {
        if (!cancelled) setData(res);
      })
      .catch((err) => {
        if (!cancelled) setError(actionErrorMessage(err, 'Could not load events.'));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [page]);

  // Loading/error are reset here rather than synchronously inside the effect.
  function goToPage(next: number) {
    setLoading(true);
    setError(null);
    setPage(next);
  }

  const totalPages = data ? Math.max(1, Math.ceil(data.total / data.limit)) : 1;

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="font-heading text-3xl font-bold">Events</h1>
      <p className="mt-2 text-muted">Upcoming published events with tickets on StellarTickets.</p>

      {error && (
        <div className="mt-6">
          <FormError message={error} />
        </div>
      )}

      {loading && !data ? (
        <p className="mt-8 text-muted">Loading…</p>
      ) : !error && data && data.items.length === 0 ? (
        <p className="mt-8 text-muted">No events are published right now.</p>
      ) : data ? (
        <ul className="mt-8 flex flex-col gap-3" aria-busy={loading}>
          {data.items.map((event) => (
            <li key={event.id} className="rounded-lg border border-border p-4">
              <div className="flex items-center gap-2">
                <p className="break-words font-medium">{event.name}</p>
                <span className="rounded bg-muted px-2 py-0.5 text-xs font-medium text-foreground">
                  {event.category}
                </span>
              </div>
              <p className="mt-1 text-sm text-muted">
                <time dateTime={event.startsAt}>{formatEventDate(event.startsAt, event.endsAt)}</time>
              </p>
              <p className="break-words text-sm text-muted">
                {event.venue}
                {event.organization && <> · by {event.organization.name}</>}
              </p>
            </li>
          ))}
        </ul>
      ) : null}

      {data && totalPages > 1 && (
        <nav className="mt-8 flex items-center justify-between" aria-label="Events pages">
          <Button onClick={() => goToPage(page - 1)} disabled={page <= 1 || loading}>
            Previous
          </Button>
          <span className="text-sm text-muted">
            Page {page} of {totalPages}
          </span>
          <Button onClick={() => goToPage(page + 1)} disabled={page >= totalPages || loading}>
            Next
          </Button>
        </nav>
      )}
    </div>
  );
}
