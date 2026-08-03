'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { Logo } from './logo';

export function Navbar() {
  const { user, loading, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/">
          <Logo className="text-lg" />
        </Link>
        <div className="flex items-center gap-6 text-sm text-muted">
          <Link href="/about" className="hidden hover:text-foreground sm:inline">
            About
          </Link>
          <Link href="/security" className="hidden hover:text-foreground sm:inline">
            Security
          </Link>
          <Link href="/marketplace" className="hover:text-foreground">
            Marketplace
          </Link>
          {user && (
            <>
              <Link href="/dashboard" className="hover:text-foreground">
                Dashboard
              </Link>
              <Link href="/my-tickets" className="hover:text-foreground">
                My tickets
              </Link>
              <Link href="/verify" className="hover:text-foreground">
                Verify
              </Link>
            </>
          )}
          {!loading && !user && (
            <>
              <Link href="/login" className="hover:text-foreground">
                Log in
              </Link>
              <Link
                href="/register"
                className="rounded-md bg-gradient-sunset px-4 py-2 font-medium text-white shadow-lg shadow-violet/20 hover:opacity-90"
              >
                Get started
              </Link>
            </>
          )}
          {user && (
            <button onClick={logout} className="hover:text-foreground">
              Log out
            </button>
          )}
        </div>
      </nav>
    </header>
  );
}
