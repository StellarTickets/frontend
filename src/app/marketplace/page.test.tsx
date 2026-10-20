import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';

const apiFetch = vi.fn();
const signTransaction = vi.fn();

vi.mock('@/lib/api', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/lib/api')>()),
  apiFetch: (...args: unknown[]) => apiFetch(...args),
}));
vi.mock('@/lib/wallet', () => ({
  signTransaction: (...args: unknown[]) => signTransaction(...args),
  WalletError: class WalletError extends Error {},
}));
vi.mock('@/lib/auth-context', () => {
  // One stable user object: the page's effects depend on `user`, so a fresh object per render would refetch forever.
  const user = { id: 'u1', email: 'me@example.com', stellarPublicKey: 'GWALLET' };
  return { useAuth: () => ({ user, loading: false }) };
});
vi.mock('@/lib/use-require-auth', () => ({ useRequireAuth: () => {} }));
vi.mock('@/components/wallet-connect-button', () => ({ WalletConnectButton: () => null }));

import MarketplacePage from './page';
import { WalletError } from '@/lib/wallet';

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const listing = {
  id: 'l1',
  ticketId: 'ticket-1',
  sellerId: 'u2',
  price: '120',
  status: 'ACTIVE',
  ticket: {
    event: { name: 'Gig', venue: 'Hall', startsAt: '2030-01-01T20:00:00Z' },
    ticketType: { name: 'GA' },
  },
  seller: { name: 'Alice Smith' },
};

let container: HTMLDivElement;
let root: Root;

async function render() {
  apiFetch.mockImplementation(async (path: string) => {
    if (path === '/tickets/resale') return [listing];
    if (path.endsWith('/buy-resale')) return { unsignedXdr: 'UNSIGNED' };
    return {};
  });
  container = document.createElement('div');
  document.body.appendChild(container);
  root = createRoot(container);
  await act(async () => root.render(<MarketplacePage />));
  // Let the resale listings request resolve and re-render.
  await act(async () => new Promise((resolve) => setTimeout(resolve, 0)));
}

function button(label: string) {
  const match = Array.from(container.querySelectorAll('button')).find(
    (b) => b.textContent?.trim() === label,
  );
  if (!match) throw new Error(`No button labelled "${label}"`);
  return match;
}

async function click(label: string) {
  await act(async () => button(label).click());
}

beforeEach(() => {
  apiFetch.mockReset();
  signTransaction.mockReset();
});

afterEach(() => {
  act(() => root.unmount());
  container.remove();
});

describe('Marketplace wallet rejections (#234)', () => {
  it('shows the wallet message when a buy signature is rejected', async () => {
    signTransaction.mockRejectedValue(new WalletError('You declined the purchase in Freighter'));
    await render();
    await click('Buy');

    expect(signTransaction).toHaveBeenCalledWith('UNSIGNED', 'GWALLET');
    expect(container.textContent).toContain('You declined the purchase in Freighter');
  });
});
