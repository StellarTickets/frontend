import { resolveEnv } from './env';

export type NetworkInfo = {
  name: string;
  passphrase: string;
  mismatch: boolean;
};

/**
 * Returns the configured Stellar network and checks if the network name
 * matches the passphrase. A mismatch indicates configuration error.
 */
export function getNetworkInfo(): NetworkInfo {
  const name = resolveEnv(
    'NEXT_PUBLIC_STELLAR_NETWORK',
    process.env.NEXT_PUBLIC_STELLAR_NETWORK,
    'testnet',
  ).toLowerCase();

  const passphrase = resolveEnv(
    'NEXT_PUBLIC_STELLAR_NETWORK_PASSPHRASE',
    process.env.NEXT_PUBLIC_STELLAR_NETWORK_PASSPHRASE,
    'Test SDF Network ; September 2015',
  );

  // Check if the network name matches the passphrase
  const mismatch = !isPassphraseMatchingNetwork(name, passphrase);

  return { name, passphrase, mismatch };
}

function isPassphraseMatchingNetwork(network: string, passphrase: string): boolean {
  const normalizedNetwork = network.toLowerCase().trim();
  const normalizedPassphrase = passphrase.toLowerCase();

  // Known network passphrases
  const knownNetworks: Record<string, string[]> = {
    testnet: ['test sdf network ; september 2015'],
    mainnet: ['public global stellar network ; september 2015'],
    futurenet: ['test sdf future network ; october 2022'],
  };

  const expectedPhrases = knownNetworks[normalizedNetwork];
  if (!expectedPhrases) {
    // Unknown network, cannot validate - assume custom network is correct
    return true;
  }

  return expectedPhrases.some((phrase) => normalizedPassphrase.includes(phrase));
}
