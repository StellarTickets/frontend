import { describe, expect, it, vi } from 'vitest';

vi.mock('@stellar/freighter-api', () => ({
  isConnected: vi.fn(),
  requestAccess: vi.fn(),
  getAddress: vi.fn(),
  signTransaction: vi.fn(),
}));

import { isConnected, requestAccess, getAddress, signTransaction } from '@stellar/freighter-api';
import {
  connectWallet,
  currentWalletAddress,
  isFreighterInstalled,
  signTransaction as signTx,
  WalletError,
} from './wallet';

describe('isFreighterInstalled', () => {
  it('returns true when Freighter reports connected', async () => {
    vi.mocked(isConnected).mockResolvedValue({ isConnected: true });
    expect(await isFreighterInstalled()).toBe(true);
  });

  it('returns false when Freighter reports not connected', async () => {
    vi.mocked(isConnected).mockResolvedValue({ isConnected: false });
    expect(await isFreighterInstalled()).toBe(false);
  });
});

describe('connectWallet', () => {
  it('returns the address on success', async () => {
    vi.mocked(requestAccess).mockResolvedValue({ address: 'GABC' });
    expect(await connectWallet()).toBe('GABC');
  });

  it('throws WalletError when Freighter returns an error', async () => {
    vi.mocked(requestAccess).mockResolvedValue({
      address: '',
      error: { message: 'User declined access', code: -4 },
    });
    await expect(connectWallet()).rejects.toBeInstanceOf(WalletError);
  });
});

describe('currentWalletAddress', () => {
  it('returns the address when present', async () => {
    vi.mocked(getAddress).mockResolvedValue({ address: 'GABC' });
    expect(await currentWalletAddress()).toBe('GABC');
  });

  it('returns null when Freighter errors', async () => {
    vi.mocked(getAddress).mockResolvedValue({
      address: '',
      error: { message: 'not allowed', code: -3 },
    });
    expect(await currentWalletAddress()).toBeNull();
  });
});

describe('signTransaction', () => {
  it('returns the signed XDR on success', async () => {
    vi.mocked(signTransaction).mockResolvedValue({
      signedTxXdr: 'signed-xdr',
      signerAddress: 'GABC',
    });
    expect(await signTx('unsigned-xdr', 'GABC')).toBe('signed-xdr');
  });

  it('throws WalletError when signing is rejected', async () => {
    vi.mocked(signTransaction).mockResolvedValue({
      signedTxXdr: '',
      signerAddress: 'GABC',
      error: { message: 'Transaction signing was rejected', code: -4 },
    });
    await expect(signTx('unsigned-xdr', 'GABC')).rejects.toBeInstanceOf(WalletError);
  });
});
