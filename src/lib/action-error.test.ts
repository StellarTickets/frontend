import { describe, expect, it, vi } from 'vitest';

vi.mock('@stellar/freighter-api', () => ({
  isConnected: vi.fn(),
  requestAccess: vi.fn(),
  getAddress: vi.fn(),
  signTransaction: vi.fn(),
}));

import { actionErrorMessage } from './action-error';
import { ApiError } from './api';
import { WalletError } from './wallet';

describe('actionErrorMessage', () => {
  it('surfaces ApiError messages', () => {
    expect(actionErrorMessage(new ApiError('Listing sold out', 409), 'fallback')).toBe(
      'Listing sold out',
    );
  });

  it('surfaces WalletError messages', () => {
    expect(
      actionErrorMessage(new WalletError('User declined access'), 'fallback'),
    ).toBe('User declined access');
  });

  it('falls back for unknown errors', () => {
    expect(actionErrorMessage(new Error('boom'), 'fallback')).toBe('fallback');
    expect(actionErrorMessage('nope', 'fallback')).toBe('fallback');
  });

  it('falls back when a known error has an empty message', () => {
    expect(actionErrorMessage(new WalletError(''), 'fallback')).toBe('fallback');
  });
});
