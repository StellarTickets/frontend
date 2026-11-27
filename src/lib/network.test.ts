import { describe, expect, it, vi, beforeEach } from 'vitest';

// Mock the env module
vi.mock('./env', () => ({
  resolveEnv: vi.fn((name: string, value: string | undefined, fallback: string) => value ?? fallback),
}));

import { getNetworkInfo } from './network';
import { resolveEnv } from './env';

describe('getNetworkInfo', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns testnet with no mismatch for correct testnet configuration', () => {
    vi.mocked(resolveEnv).mockImplementation((name, value, fallback) => {
      if (name === 'NEXT_PUBLIC_STELLAR_NETWORK') return 'testnet';
      if (name === 'NEXT_PUBLIC_STELLAR_NETWORK_PASSPHRASE') return 'Test SDF Network ; September 2015';
      return fallback;
    });

    const result = getNetworkInfo();

    expect(result.name).toBe('testnet');
    expect(result.passphrase).toBe('Test SDF Network ; September 2015');
    expect(result.mismatch).toBe(false);
  });

  it('returns mainnet with no mismatch for correct mainnet configuration', () => {
    vi.mocked(resolveEnv).mockImplementation((name, value, fallback) => {
      if (name === 'NEXT_PUBLIC_STELLAR_NETWORK') return 'mainnet';
      if (name === 'NEXT_PUBLIC_STELLAR_NETWORK_PASSPHRASE') return 'Public Global Stellar Network ; September 2015';
      return fallback;
    });

    const result = getNetworkInfo();

    expect(result.name).toBe('mainnet');
    expect(result.passphrase).toBe('Public Global Stellar Network ; September 2015');
    expect(result.mismatch).toBe(false);
  });

  it('detects mismatch when network is testnet but passphrase is for mainnet', () => {
    vi.mocked(resolveEnv).mockImplementation((name, value, fallback) => {
      if (name === 'NEXT_PUBLIC_STELLAR_NETWORK') return 'testnet';
      if (name === 'NEXT_PUBLIC_STELLAR_NETWORK_PASSPHRASE') return 'Public Global Stellar Network ; September 2015';
      return fallback;
    });

    const result = getNetworkInfo();

    expect(result.name).toBe('testnet');
    expect(result.mismatch).toBe(true);
  });

  it('detects mismatch when network is mainnet but passphrase is for testnet', () => {
    vi.mocked(resolveEnv).mockImplementation((name, value, fallback) => {
      if (name === 'NEXT_PUBLIC_STELLAR_NETWORK') return 'mainnet';
      if (name === 'NEXT_PUBLIC_STELLAR_NETWORK_PASSPHRASE') return 'Test SDF Network ; September 2015';
      return fallback;
    });

    const result = getNetworkInfo();

    expect(result.name).toBe('mainnet');
    expect(result.mismatch).toBe(true);
  });

  it('handles custom network without mismatch detection', () => {
    vi.mocked(resolveEnv).mockImplementation((name, value, fallback) => {
      if (name === 'NEXT_PUBLIC_STELLAR_NETWORK') return 'custom';
      if (name === 'NEXT_PUBLIC_STELLAR_NETWORK_PASSPHRASE') return 'Custom Network Passphrase';
      return fallback;
    });

    const result = getNetworkInfo();

    expect(result.name).toBe('custom');
    expect(result.passphrase).toBe('Custom Network Passphrase');
    expect(result.mismatch).toBe(false); // Custom networks can't be validated
  });

  it('is case insensitive for network names', () => {
    vi.mocked(resolveEnv).mockImplementation((name, value, fallback) => {
      if (name === 'NEXT_PUBLIC_STELLAR_NETWORK') return 'TESTNET';
      if (name === 'NEXT_PUBLIC_STELLAR_NETWORK_PASSPHRASE') return 'Test SDF Network ; September 2015';
      return fallback;
    });

    const result = getNetworkInfo();

    expect(result.name).toBe('testnet');
    expect(result.mismatch).toBe(false);
  });
});
