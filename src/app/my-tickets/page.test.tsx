import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import type { Ticket } from '@/lib/types';

const apiFetch = vi.fn();
const signTransaction = vi.fn();

vi.mock('@/lib/api', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/lib/api')>()),
  apiFetch: (...args: unknown[]) => apiFetch(...args),
}));
vi.mock('@/lib/wallet', () => ({
  signTransaction: (...args: unknown[]) => signTransaction(...args),
}));
vi.mock('@/lib/auth-context', () => ({
  useAuth: () => ({
    user: { id: 'u1', email: 'me@example.com', stellarPublicKey: 'GWALLET' },
    loading: false,
  }),
}));
vi.mock('@/lib/use-require-auth', () => ({ useRequireAuth: () => {} }));
vi.mock('@/components/wallet-connect-button', () => ({ WalletConnectButton: () => null }));
vi.mock('@/components/ticket-qr', () => ({ TicketQr: () => null }));

import MyTicketsPage from './page';

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

function ticket(overrides: Partial<Ticket>): Ticket {
  return {
    id: 't1',
    seat: 'A1',
    status: 'VALID',
    qrSecret: 'secret',
    chainTicketId: '1',
    event: { name: 'Gig', startsAt: '2030-01-01T20:00:00Z', venue: 'Hall', category: 'CONCERT' },
    ticketType: { name: 'GA', price: '100' },
    ...overrides,
  } as unknown as Ticket;
}

let container: HTMLDivElement;
let root: Root;

async function render(tickets: Ticket[]) {
  apiFetch.mockImplementation(async (path: string) => {
    if (path === '/tickets/mine') return tickets;
    if (path.startsWith('/users/lookup')) return { id: 'u2', name: 'Bob' };
    if (path.startsWith('/tickets/') && !path.includes('confirm')) return { unsignedXdr: 'UNSIGNED' };
    return {};
  });
  container = document.createElement('div');
  document.body.appendChild(container);
  root = createRoot(container);
  await act(async () => root.render(<MyTicketsPage />));
}

function button(label: string): HTMLButtonElement {
  const found = [...container.querySelectorAll('button')].find(
    (b) => b.textContent?.trim() === label,
  );
  if (!found) throw new Error(`No button "${label}"`);
  return found;
}

async function click(label: string) {
  await act(async () => button(label).click());
}

async function type(selector: string, value: string) {
  const input = container.querySelector<HTMLInputElement>(selector)!;
  const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')!.set!;
  await act(async () => {
    setter.call(input, value);
    input.dispatchEvent(new Event('input', { bubbles: true }));
  });
}

function postsTo(path: string) {
  return apiFetch.mock.calls.find(([p]) => p === path)?.[1];
}

beforeEach(() => {
  apiFetch.mockReset();
  signTransaction.mockReset().mockResolvedValue('SIGNED');
});

afterEach(() => {
  act(() => root.unmount());
  container.remove();
});

describe('My tickets actions (#313)', () => {
  it('transfers a ticket after looking up and confirming the recipient', async () => {
    await render([ticket({})]);

    await click('Transfer');
    await type('#transfer-email-t1', 'bob@example.com');
    await click('Send');
    expect(apiFetch).toHaveBeenCalledWith('/users/lookup?email=bob%40example.com');

    await click('Confirm');
    expect(postsTo('/tickets/t1/transfer')).toEqual({ method: 'POST', body: { toUserId: 'u2' } });
    expect(signTransaction).toHaveBeenCalledWith('UNSIGNED', 'GWALLET');
    expect(postsTo('/tickets/t1/confirm-transfer')).toEqual({
      method: 'POST',
      body: { toUserId: 'u2', signedXdr: 'SIGNED' },
    });
  });

  it('fades the ticket out and names the recipient after a transfer (#266)', async () => {
    await render([ticket({})]);
    await click('Transfer');
    await type('#transfer-email-t1', 'bob@example.com');
    await click('Send');
    await click('Confirm');

    // The ticket fades before the list refreshes.
    expect(container.querySelector('li')?.className).toContain('opacity-0');

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 350));
    });
    const status = container.querySelector('[role="status"]');
    expect(status?.textContent).toBe(
      "Gig · Seat A1 transferred to Bob (bob@example.com). It's no longer in your tickets.",
    );
    expect(status?.getAttribute('aria-live')).toBe('polite');
  });

  it('lists a ticket for resale at the entered price', async () => {
    await render([ticket({})]);

    await click('List for resale');
    await type('#resale-price-t1', '120');
    await click('List');

    expect(postsTo('/tickets/t1/list-resale')).toEqual({ method: 'POST', body: { price: '120' } });
    expect(postsTo('/tickets/t1/confirm-list-resale')).toEqual({
      method: 'POST',
      body: { price: '120', signedXdr: 'SIGNED' },
    });
  });

  it('cancels a resale listing', async () => {
    await render([ticket({ status: 'RESALE' })]);

    await click('Cancel listing');

    expect(postsTo('/tickets/t1/cancel-resale')).toEqual({ method: 'POST' });
    expect(postsTo('/tickets/t1/confirm-cancel-resale')).toEqual({
      method: 'POST',
      body: { signedXdr: 'SIGNED' },
    });
  });
});
