import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import type { EventRecord, Paginated } from '@/lib/types';

const apiFetch = vi.fn();

vi.mock('@/lib/api', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/lib/api')>()),
  apiFetch: (...args: unknown[]) => apiFetch(...args),
}));

import EventsPage from './page';

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

function event(overrides: Partial<EventRecord>): EventRecord {
  return {
    id: 'e1',
    organizationId: 'o1',
    name: 'Lagos Jazz Night',
    category: 'CONCERT',
    venue: 'Eko Hall',
    startsAt: '2030-01-01T20:00:00Z',
    endsAt: null,
    chainEventId: '1',
    maxResaleMultiplierBps: 15000,
    royaltyBps: 500,
    status: 'PUBLISHED',
    organization: { name: 'Afrobeats Co', slug: 'afrobeats' },
    ...overrides,
  } as EventRecord;
}

const page = (items: EventRecord[], total = items.length, n = 1): Paginated<EventRecord> => ({
  items,
  total,
  page: n,
  limit: 20,
});

let container: HTMLDivElement;
let root: Root;

async function render() {
  container = document.createElement('div');
  document.body.appendChild(container);
  await act(async () => {
    root = createRoot(container);
    root.render(<EventsPage />);
  });
}

beforeEach(() => apiFetch.mockReset());
afterEach(() => {
  act(() => root.unmount());
  container.remove();
});

describe('EventsPage (#282)', () => {
  it('lists published events with venue and organizer from GET /events', async () => {
    apiFetch.mockResolvedValue(page([event({}), event({ id: 'e2', name: 'Abuja Tech Summit', venue: 'ICC' })]));
    await render();

    expect(apiFetch).toHaveBeenCalledWith('/events?page=1&limit=20');
    expect(container.textContent).toContain('Lagos Jazz Night');
    expect(container.textContent).toContain('Eko Hall');
    expect(container.textContent).toContain('by Afrobeats Co');
    expect(container.textContent).toContain('Abuja Tech Summit');
    expect(container.querySelector('time')?.getAttribute('dateTime')).toBe('2030-01-01T20:00:00Z');
  });

  it('shows an empty state when nothing is published', async () => {
    apiFetch.mockResolvedValue(page([]));
    await render();
    expect(container.textContent).toContain('No events are published right now.');
  });

  it('pages forward with the Next button', async () => {
    apiFetch.mockResolvedValueOnce(page([event({})], 25, 1)).mockResolvedValueOnce(page([event({ id: 'e9', name: 'Page Two Gig' })], 25, 2));
    await render();
    const next = Array.from(container.querySelectorAll('button')).find((b) => b.textContent === 'Next')!;
    await act(async () => next.click());
    expect(apiFetch).toHaveBeenLastCalledWith('/events?page=2&limit=20');
    expect(container.textContent).toContain('Page Two Gig');
    expect(container.textContent).toContain('Page 2 of 2');
  });
});
