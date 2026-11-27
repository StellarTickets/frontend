import { TransactionBuilder } from "@stellar/stellar-sdk";
import { signTransaction } from "./wallet";

export class TransactionMismatchError extends Error {}

/**
 * Compares the unsigned and signed XDR envelopes to ensure the wallet
 * didn't modify the transaction operations, source account, or fee.
 * Throws TransactionMismatchError if they don't match.
 */
function validateSignedTransaction(
  unsignedXdr: string,
  signedXdr: string,
): void {
  try {
    const unsignedTx = TransactionBuilder.fromXDR(
      unsignedXdr,
      "Test SDF Network ; September 2015",
    );
    const signedTx = TransactionBuilder.fromXDR(
      signedXdr,
      "Test SDF Network ; September 2015",
    );

    // Compare source account
    if (unsignedTx.source !== signedTx.source) {
      throw new TransactionMismatchError(
        "Transaction source account mismatch: wallet returned a different source account",
      );
    }

    // Compare fee
    if (unsignedTx.fee !== signedTx.fee) {
      throw new TransactionMismatchError(
        "Transaction fee mismatch: wallet returned a different fee",
      );
    }

    // Compare sequence number
    if (unsignedTx.sequence !== signedTx.sequence) {
      throw new TransactionMismatchError(
        "Transaction sequence mismatch: wallet returned a different sequence number",
      );
    }

    // Compare operations count
    if (unsignedTx.operations.length !== signedTx.operations.length) {
      throw new TransactionMismatchError(
        "Transaction operations mismatch: wallet returned a different number of operations",
      );
    }

    // Compare each operation
    for (let i = 0; i < unsignedTx.operations.length; i++) {
      const unsignedOp = unsignedTx.operations[i];
      const signedOp = signedTx.operations[i];

      if (unsignedOp.type !== signedOp.type) {
        throw new TransactionMismatchError(
          `Operation ${i} type mismatch: wallet returned a different operation type`,
        );
      }

      // Deep comparison of operation properties
      const unsignedOpJson = JSON.stringify(unsignedOp);
      const signedOpJson = JSON.stringify(signedOp);

      if (unsignedOpJson !== signedOpJson) {
        throw new TransactionMismatchError(
          `Operation ${i} mismatch: wallet returned a different operation`,
        );
      }
    }

    // Compare memo
    const unsignedMemo = JSON.stringify(unsignedTx.memo);
    const signedMemo = JSON.stringify(signedTx.memo);
    if (unsignedMemo !== signedMemo) {
      throw new TransactionMismatchError(
        "Transaction memo mismatch: wallet returned a different memo",
      );
    }

    // Compare timebounds
    const unsignedTimeBounds = JSON.stringify(unsignedTx.timeBounds);
    const signedTimeBounds = JSON.stringify(signedTx.timeBounds);
    if (unsignedTimeBounds !== signedTimeBounds) {
      throw new TransactionMismatchError(
        "Transaction timebounds mismatch: wallet returned different timebounds",
      );
    }
  } catch (error) {
    if (error instanceof TransactionMismatchError) {
      throw error;
    }
    throw new TransactionMismatchError(
      `Failed to validate signed transaction: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
}

/**
 * Every on-chain write in this app is build-unsigned-XDR → wallet-sign →
 * submit-signed-XDR. This just wires those three steps together so page
 * components don't repeat them.
 *
 * Now includes validation to ensure the signed XDR matches the unsigned XDR
 * before calling confirm, preventing a compromised or buggy wallet from
 * submitting modified transactions.
 */
export async function signAndSubmit<T>(
  unsignedXdr: string,
  signerAddress: string,
  confirm: (signedXdr: string) => Promise<T>,
): Promise<T> {
  const signedXdr = await signTransaction(unsignedXdr, signerAddress);

  // Validate that the signed transaction matches the unsigned one
  validateSignedTransaction(unsignedXdr, signedXdr);

  return confirm(signedXdr);
}
