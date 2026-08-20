import { describe, expect, it, vi } from 'vitest';

vi.mock('./wallet', () => ({
  signTransaction: vi.fn(async (unsignedXdr: string) => `signed:${unsignedXdr}`),
}));

import { signAndSubmit } from './onchain';

describe('signAndSubmit', () => {
  it('signs the unsigned XDR then passes the signed XDR to confirm', async () => {
    const confirm = vi.fn(async (signedXdr: string) => ({ txHash: `hash-for-${signedXdr}` }));

    const result = await signAndSubmit('unsigned-xdr', 'GADDRESS', confirm);

    expect(confirm).toHaveBeenCalledWith('signed:unsigned-xdr');
    expect(result).toEqual({ txHash: 'hash-for-signed:unsigned-xdr' });
  });

  it('propagates a signing rejection without calling confirm', async () => {
    const { signTransaction } = await import('./wallet');
    vi.mocked(signTransaction).mockRejectedValueOnce(new Error('User declined access'));
    const confirm = vi.fn();

    await expect(signAndSubmit('unsigned-xdr', 'GADDRESS', confirm)).rejects.toThrow(
      'User declined access',
    );
    expect(confirm).not.toHaveBeenCalled();
  });
});
