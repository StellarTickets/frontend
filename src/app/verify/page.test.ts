import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, createElement } from 'react';
import { createRoot, type Root } from 'react-dom/client';

// ── Mocks ─────────────────────────────────────────────────────────────────────

const WALLET_A = `G${'A'.repeat(55)}`;
const WALLET_B = `G${'B'.repeat(55)}`;

const walletMock = vi.hoisted(() => ({
  currentWalletAddress: vi.fn(async (): Promise<string | null> => WALLET_A),
}));

vi.mock('@/lib/wallet', () => ({
  currentWalletAddress: walletMock.currentWalletAddress,
  WalletError: class WalletError extends Error {},
  FREIGHTER_INSTALL_URL: 'https://www.freighter.app/',
  isFreighterInstalled: vi.fn(async () => true),
  connectWallet: vi.fn(async () => WALLET_A),
  signTransaction: vi.fn(async () => 'signed-xdr'),
}));

const apiFetchMock = vi.hoisted(() => vi.fn());

vi.mock('@/lib/api', () => ({
  apiFetch: apiFetchMock,
  getErrorMessage: (_err: unknown, fallback: string) => fallback,
  getToken: vi.fn(() => 'tok'),
  clearToken: vi.fn(),
  setToken: vi.fn(),
  isUnauthorized: vi.fn(() => false),
  ApiError: class ApiError extends Error {
    constructor(msg: string, public readonly status: number) { super(msg); }
  },
}));

const onchainMock = vi.hoisted(() => ({ signAndSubmit: vi.fn() }));
vi.mock('@/lib/onchain', () => ({ signAndSubmit: onchainMock.signAndSubmit }));

vi.mock('@/lib/auth-context', () => ({
  useAuth: () => ({ user: { stellarPublicKey: WALLET_A }, loading: false }),
}));

vi.mock('@/lib/use-require-auth', () => ({ useRequireAuth: () => {} }));
vi.mock('@/components/wallet-connect-button', () => ({
  WalletConnectButton: () => null,
}));
vi.mock('@/components/qr-scanner', () => ({ QrScanner: () => null }));
vi.mock('@/components/confirm-dialog', () => ({
  ConfirmDialog: ({ open, onConfirm, children }: { open: boolean; onConfirm: () => void; children: unknown }) =>
    open ? createElement('div', { 'data-testid': 'confirm-dialog' },
      createElement('button', { onClick: onConfirm, 'data-testid': 'confirm-btn' }, 'Confirm'),
      children,
    ) : null,
}));
vi.mock('@/lib/revoke-confirm', () => ({ describeRevokeTarget: () => 'Some ticket' }));

// ── Helpers ───────────────────────────────────────────────────────────────────

import VerifyPage from './page';

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const VERIFY_RESULT = {
  ticketId: 'tkt-1',
  eventName: 'Galaxy Fest',
  tier: 'VIP',
  seat: 'A1',
  ownerName: 'Ada',
  status: 'VALID' as const,
  onChainOwner: WALLET_A,
};

let container: HTMLDivElement;
let root: Root;

beforeEach(() => {
  vi.clearAllMocks();
  walletMock.currentWalletAddress.mockResolvedValue(WALLET_A);
  onchainMock.signAndSubmit.mockResolvedValue(undefined);
  container = document.createElement('div');
  document.body.appendChild(container);
  root = createRoot(container);
});

afterEach(async () => {
  await act(async () => root.unmount());
  container.remove();
});

async function render() {
  await act(async () => root.render(createElement(VerifyPage)));
}

async function lookupTicket() {
  // Fill in the code and submit the form to trigger lookup.
  apiFetchMock.mockResolvedValueOnce(VERIFY_RESULT);
  const input = container.querySelector<HTMLInputElement>('input[placeholder="Ticket code"]')!;
  await act(async () => {
    const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')?.set;
    setter?.call(input, 'ABC123');
    input.dispatchEvent(new Event('input', { bubbles: true }));
  });
  const form = container.querySelector('form')!;
  await act(async () => {
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
  });
}

function errorText(): string {
  return container.querySelector('[role="alert"]')?.textContent ?? '';
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('VerifyPage wallet mismatch check (#237)', () => {
  it('calls signAndSubmit on check-in when wallets match', async () => {
    await render();
    await lookupTicket();

    apiFetchMock.mockResolvedValueOnce({ unsignedXdr: 'xdr' }); // /check-in
    apiFetchMock.mockResolvedValueOnce({}); // /confirm-check-in

    const checkInBtn = container.querySelector<HTMLButtonElement>('button[class*="text-sm"]');
    await act(async () => { checkInBtn?.click(); });

    expect(onchainMock.signAndSubmit).toHaveBeenCalledTimes(1);
  });

  it('blocks check-in and shows mismatch error when Freighter has a different account', async () => {
    walletMock.currentWalletAddress.mockResolvedValue(WALLET_B);

    await render();
    await lookupTicket();

    const checkInBtn = Array.from(container.querySelectorAll<HTMLButtonElement>('button'))
      .find((b) => b.textContent?.includes('Check in'));
    await act(async () => { checkInBtn?.click(); });

    expect(onchainMock.signAndSubmit).not.toHaveBeenCalled();
    expect(errorText()).toMatch(/wallet mismatch/i);
    expect(errorText()).toContain(WALLET_B);
  });

  it('blocks revoke and shows mismatch error when Freighter has a different account', async () => {
    walletMock.currentWalletAddress.mockResolvedValue(WALLET_B);

    await render();
    await lookupTicket();

    // Open confirm dialog first (revoke requires confirmation).
    const revokeBtn = Array.from(container.querySelectorAll<HTMLButtonElement>('button'))
      .find((b) => b.textContent?.includes('Revoke'));
    await act(async () => { revokeBtn?.click(); });

    // Confirm in the dialog — this triggers handleRevoke.
    const confirmBtn = container.querySelector<HTMLButtonElement>('[data-testid="confirm-btn"]');
    await act(async () => { confirmBtn?.click(); });

    expect(onchainMock.signAndSubmit).not.toHaveBeenCalled();
    expect(errorText()).toMatch(/wallet mismatch/i);
    expect(errorText()).toContain(WALLET_B);
  });

  it('shows the expected key in the mismatch error', async () => {
    walletMock.currentWalletAddress.mockResolvedValue(WALLET_B);

    await render();
    await lookupTicket();

    const checkInBtn = Array.from(container.querySelectorAll<HTMLButtonElement>('button'))
      .find((b) => b.textContent?.includes('Check in'));
    await act(async () => { checkInBtn?.click(); });

    expect(errorText()).toContain(WALLET_A); // expected key
    expect(errorText()).toContain(WALLET_B); // actual Freighter key
  });
});
