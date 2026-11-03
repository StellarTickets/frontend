import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, Suspense } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import type { ReactNode } from 'react';

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
  const user = { id: 'u1', email: 'org@example.com', stellarPublicKey: 'GWALLET' };
  return { useAuth: () => ({ user, loading: false }) };
});
vi.mock('@/lib/use-require-auth', () => ({ useRequireAuth: () => {} }));
vi.mock('@/lib/event-details', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/lib/event-details')>()),
  buildPublishSummary: () => 'Summary',
}));
vi.mock('@/components/wallet-connect-button', () => ({ WalletConnectButton: () => null }));
vi.mock('@/components/event-details', () => ({ EventDetails: () => null }));
vi.mock('@/components/breadcrumbs', () => ({ Breadcrumbs: () => null }));
vi.mock('@/components/confirm-dialog', () => ({
  ConfirmDialog: ({
    open,
    confirmLabel,
    onConfirm,
    children,
  }: {
    open: boolean;
    confirmLabel: string;
    onConfirm: () => void;
    children: ReactNode;
  }) =>
    open ? (
      <div>
        {children}
        <button onClick={onConfirm}>{confirmLabel}</button>
      </div>
    ) : null,
}));

import EventPage from './page';
import { WalletError } from '@/lib/wallet';

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const event = {
  id: 'e1',
  name: 'Gig',
  venue: 'Hall',
  status: 'DRAFT',
  organizationId: 'o1',
  organization: { name: 'Org' },
  ticketTypes: [],
};

const params = Promise.resolve({ id: 'e1' });

let container: HTMLDivElement;
let root: Root;

async function render() {
  apiFetch.mockImplementation(async (path: string) => {
    if (path === '/events/e1') return event;
    if (path === '/events/e1/publish') return { unsignedXdr: 'UNSIGNED' };
    return {};
  });
  container = document.createElement('div');
  document.body.appendChild(container);
  root = createRoot(container);
  await act(async () => {
    root.render(
      <Suspense fallback={null}>
        <EventPage params={params} />
      </Suspense>,
    );
  });
  // Let the event request resolve and the suspended params settle.
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

describe('Event page wallet rejections (#233)', () => {
  it('shows the wallet message when a publish signature is rejected', async () => {
    signTransaction.mockRejectedValue(new WalletError('You declined the publish in Freighter'));
    await render();
    await click('Publish event on-chain');
    await click('Confirm and publish');

    expect(signTransaction).toHaveBeenCalledWith('UNSIGNED', 'GWALLET');
    expect(container.textContent).toContain('You declined the publish in Freighter');
  });
});
