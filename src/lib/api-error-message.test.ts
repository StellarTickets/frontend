import { describe, expect, it, vi } from 'vitest';

vi.mock('@stellar/freighter-api', () => ({
  isConnected: vi.fn(),
  requestAccess: vi.fn(),
  getAddress: vi.fn(),
  signTransaction: vi.fn(),
}));

import { ApiError, getErrorMessage } from './api';
import { WalletError } from './wallet';

describe('getErrorMessage', () => {
  it('surfaces ApiError messages', () => {
    expect(getErrorMessage(new ApiError('Listing sold out', 409), 'fallback')).toBe(
      'Listing sold out',
    );
  });

  it('surfaces WalletError messages', () => {
    expect(getErrorMessage(new WalletError('User declined access'), 'fallback')).toBe(
      'User declined access',
    );
  });

  it('falls back for unknown errors', () => {
    expect(getErrorMessage(new Error('boom'), 'fallback')).toBe('fallback');
    expect(getErrorMessage('nope', 'fallback')).toBe('fallback');
  });

  it('falls back when a known error has an empty message', () => {
    expect(getErrorMessage(new WalletError(''), 'fallback')).toBe('fallback');
    expect(getErrorMessage(new ApiError('', 500), 'fallback')).toBe('fallback');
  });
});
