import {
  isConnected,
  requestAccess,
  getAddress,
  signTransaction as freighterSignTransaction,
} from '@stellar/freighter-api';

const NETWORK_PASSPHRASE =
  process.env.NEXT_PUBLIC_STELLAR_NETWORK_PASSPHRASE ?? 'Test SDF Network ; September 2015';

export class WalletError extends Error {}

export async function isFreighterInstalled(): Promise<boolean> {
  const { isConnected: connected } = await isConnected();
  return connected;
}

/** Prompts the Freighter extension for account access and returns the selected public key. */
export async function connectWallet(): Promise<string> {
  const result = await requestAccess();
  if (result.error) {
    throw new WalletError(result.error.message ?? 'Could not connect to Freighter');
  }
  return result.address;
}

export async function currentWalletAddress(): Promise<string | null> {
  const result = await getAddress();
  if (result.error || !result.address) return null;
  return result.address;
}

/** Signs an unsigned XDR envelope returned by the backend's `build*Tx` endpoints. */
export async function signTransaction(unsignedXdr: string, signerAddress: string): Promise<string> {
  const result = await freighterSignTransaction(unsignedXdr, {
    networkPassphrase: NETWORK_PASSPHRASE,
    address: signerAddress,
  });
  if (result.error) {
    throw new WalletError(result.error.message ?? 'Transaction signing was rejected');
  }
  return result.signedTxXdr;
}
