import { describe, expect, it, vi } from "vitest";
import {
  TransactionBuilder,
  Networks,
  Keypair,
  Operation,
  Account,
  BASE_FEE,
  Asset,
} from "@stellar/stellar-sdk";

// Create helper to generate test XDRs
function createTestTransaction(
  sourceKeypair: Keypair = Keypair.random(),
): string {
  const account = new Account(sourceKeypair.publicKey(), "1234567890");
  const transaction = new TransactionBuilder(account, {
    fee: BASE_FEE,
    networkPassphrase: Networks.TESTNET,
  })
    .addOperation(
      Operation.payment({
        destination: Keypair.random().publicKey(),
        asset: Asset.native(),
        amount: "10",
      }),
    )
    .setTimeout(30)
    .build();
  return transaction.toXDR();
}

function signTestTransaction(xdr: string, signerKeypair: Keypair): string {
  const transaction = TransactionBuilder.fromXDR(xdr, Networks.TESTNET);
  transaction.sign(signerKeypair);
  return transaction.toXDR();
}

vi.mock("./wallet", () => ({
  signTransaction: vi.fn(async (unsignedXdr: string) => {
    // Mock that properly signs the transaction
    const keypair = Keypair.random();
    return signTestTransaction(unsignedXdr, keypair);
  }),
}));

import { signAndSubmit, TransactionMismatchError } from "./onchain";

describe("signAndSubmit", () => {
  it("signs the unsigned XDR, validates it, then passes the signed XDR to confirm", async () => {
    const unsignedXdr = createTestTransaction();
    const confirm = vi.fn(async (signedXdr: string) => ({
      txHash: `hash-for-${signedXdr}`,
    }));

    const result = await signAndSubmit(unsignedXdr, "GADDRESS", confirm);

    expect(confirm).toHaveBeenCalled();
    expect(result.txHash).toMatch(/^hash-for-/);
  });

  it("propagates a signing rejection without calling confirm", async () => {
    const { signTransaction } = await import("./wallet");
    vi.mocked(signTransaction).mockRejectedValueOnce(
      new Error("User declined access"),
    );
    const confirm = vi.fn();
    const unsignedXdr = createTestTransaction();

    await expect(
      signAndSubmit(unsignedXdr, "GADDRESS", confirm),
    ).rejects.toThrow("User declined access");
    expect(confirm).not.toHaveBeenCalled();
  });

  it("throws TransactionMismatchError when operations are modified", async () => {
    const { signTransaction } = await import("./wallet");
    const sourceKeypair = Keypair.random();
    const unsignedXdr = createTestTransaction(sourceKeypair);

    // Create a modified transaction with different operation
    const account = new Account(sourceKeypair.publicKey(), "1234567890");
    const modifiedTx = new TransactionBuilder(account, {
      fee: BASE_FEE,
      networkPassphrase: Networks.TESTNET,
    })
      .addOperation(
        Operation.payment({
          destination: Keypair.random().publicKey(),
          asset: Asset.native(),
          amount: "999", // Different amount
        }),
      )
      .setTimeout(30)
      .build();
    modifiedTx.sign(sourceKeypair);
    const modifiedXdr = modifiedTx.toXDR();

    vi.mocked(signTransaction).mockResolvedValueOnce(modifiedXdr);
    const confirm = vi.fn();

    await expect(
      signAndSubmit(unsignedXdr, "GADDRESS", confirm),
    ).rejects.toThrow(TransactionMismatchError);
    expect(confirm).not.toHaveBeenCalled();
  });

  it("throws TransactionMismatchError when fee is modified", async () => {
    const { signTransaction } = await import("./wallet");
    const sourceKeypair = Keypair.random();
    const unsignedXdr = createTestTransaction(sourceKeypair);

    // Create a modified transaction with different fee
    const account = new Account(sourceKeypair.publicKey(), "1234567890");
    const modifiedTx = new TransactionBuilder(account, {
      fee: "200", // Different fee
      networkPassphrase: Networks.TESTNET,
    })
      .addOperation(
        Operation.payment({
          destination: Keypair.random().publicKey(),
          asset: Asset.native(),
          amount: "10",
        }),
      )
      .setTimeout(30)
      .build();
    modifiedTx.sign(sourceKeypair);
    const modifiedXdr = modifiedTx.toXDR();

    vi.mocked(signTransaction).mockResolvedValueOnce(modifiedXdr);
    const confirm = vi.fn();

    await expect(
      signAndSubmit(unsignedXdr, "GADDRESS", confirm),
    ).rejects.toThrow(TransactionMismatchError);
    expect(confirm).not.toHaveBeenCalled();
  });
});
