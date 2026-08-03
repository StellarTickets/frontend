# Wallet integration

Freighter only, via `@stellar/freighter-api`. `src/lib/wallet.ts` wraps
four calls:

- `isFreighterInstalled` — checks the extension is present
- `connectWallet` — prompts account access, returns the address
- `currentWalletAddress` — silently reads the already-approved address
- `signTransaction` — signs an unsigned XDR against a specific network
  passphrase and signer address

Adding a second wallet provider (e.g. Albedo, xBull) would mean
extending this module with a provider abstraction — nothing else in
the app talks to Freighter directly, so the blast radius of that
change is contained to `wallet.ts` and `WalletConnectButton`.
