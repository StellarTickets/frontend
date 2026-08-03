'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { Logo } from './logo';

export function Navbar() {
  const { user, loading, logout } = useAuth();

  return (
    <header className="sticky top-4 z-40 px-4">
      <nav className="mx-auto flex max-w-5xl items-center justify-between rounded-full border border-border-bright bg-surface/90 px-5 py-2.5 shadow-2xl shadow-black/60 backdrop-blur-lg">
        <Link href="/">
          <Logo className="text-base" />
        </Link>
        <div className="flex items-center gap-5 text-sm text-muted">
          <Link href="/about" className="hidden hover:text-foreground md:inline">
            About
          </Link>
          <Link href="/security" className="hidden hover:text-foreground md:inline">
            Security
          </Link>
          <Link href="/marketplace" className="hover:text-foreground">
            Marketplace
          </Link>
          {user && (
            <>
              <Link href="/dashboard" className="hidden hover:text-foreground sm:inline">
                Dashboard
              </Link>
              <Link href="/my-tickets" className="hidden hover:text-foreground sm:inline">
                My tickets
              </Link>
              <Link href="/verify" className="hover:text-foreground">
                Verify
              </Link>
            </>
          )}
          {!loading && !user && (
            <Link href="/login" className="hover:text-foreground">
              Log in
            </Link>
          )}
          {user && (
            <button onClick={logout} className="hover:text-foreground">
              Log out
            </button>
          )}
          {!loading && !user && (
            <Link
              href="/register"
              className="rounded-full bg-gradient-sunset px-4 py-1.5 font-medium text-white shadow-lg shadow-violet/20 hover:opacity-90"
            >
              Get started
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
