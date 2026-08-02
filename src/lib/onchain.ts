import { signTransaction } from './wallet';

/**
 * Every on-chain write in this app is build-unsigned-XDR → wallet-sign →
 * submit-signed-XDR. This just wires those three steps together so page
 * components don't repeat them.
 */
export async function signAndSubmit<T>(
  unsignedXdr: string,
  signerAddress: string,
  confirm: (signedXdr: string) => Promise<T>,
): Promise<T> {
  const signedXdr = await signTransaction(unsignedXdr, signerAddress);
  return confirm(signedXdr);
}
