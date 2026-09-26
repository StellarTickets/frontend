'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { apiFetch, ApiError } from '@/lib/api';
import {
  connectWallet,
  FREIGHTER_INSTALL_URL,
  isFreighterInstalled,
  WalletError,
} from '@/lib/wallet';
import { CopyButton } from './copy-button';

export function WalletConnectButton() {
  const { user, refresh } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);
  // null while the extension check is still running.
  const [freighterInstalled, setFreighterInstalled] = useState<boolean | null>(null);

  useEffect(() => {
    let cancelled = false;
    isFreighterInstalled().then((installed) => {
      if (!cancelled) setFreighterInstalled(installed);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  if (!user) return null;

  if (user.stellarPublicKey) {
    return (
      <p className="flex items-center gap-1 text-sm text-muted">
        Wallet connected:{' '}
        <span className="font-mono text-foreground" title={user.stellarPublicKey}>
          {user.stellarPublicKey.slice(0, 6)}…{user.stellarPublicKey.slice(-6)}
        </span>
        <CopyButton value={user.stellarPublicKey} label="Copy wallet address" />
      </p>
    );
  }

  async function handleConnect() {
    setError(null);
    setConnecting(true);
    try {
      const address = await connectWallet();
      await apiFetch('/users/me/wallet', { method: 'PATCH', body: { stellarPublicKey: address } });
      await refresh();
    } catch (err) {
      if (err instanceof WalletError) setError(err.message);
      else if (err instanceof ApiError) setError(err.message);
      else setError('Could not connect your wallet. Is Freighter installed?');
    } finally {
      setConnecting(false);
    }
  }

  if (freighterInstalled === false) {
    return (
      <div className="flex flex-col items-start gap-2">
        <a
          href={FREIGHTER_INSTALL_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-md border border-border px-4 py-2 text-sm font-medium hover:bg-surface"
        >
          Install Freighter wallet
        </a>
        <p className="text-sm text-muted">
          The Freighter browser extension is required to connect a Stellar wallet.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-start gap-2">
      <button
        onClick={handleConnect}
        disabled={connecting}
        className="rounded-md border border-border px-4 py-2 text-sm font-medium hover:bg-surface disabled:opacity-50"
      >
        {connecting ? 'Connecting…' : 'Connect Freighter wallet'}
      </button>
      {error && <p className="text-sm text-red-300">{error}</p>}
    </div>
  );
}
