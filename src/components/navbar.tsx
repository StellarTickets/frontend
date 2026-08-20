'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { Logo } from './logo';

interface NavLink {
  href: string;
  label: string;
  authOnly?: boolean;
  guestOnly?: boolean;
}

const LINKS: NavLink[] = [
  { href: '/about', label: 'About' },
  { href: '/security', label: 'Security' },
  { href: '/marketplace', label: 'Marketplace' },
  { href: '/dashboard', label: 'Dashboard', authOnly: true },
  { href: '/my-tickets', label: 'My tickets', authOnly: true },
  { href: '/verify', label: 'Verify', authOnly: true },
];

function useScrolled(threshold = 8) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > threshold);
    }
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [threshold]);
  return scrolled;
}

export function Navbar() {
  const { user, loading, logout } = useAuth();
  const pathname = usePathname();
  const scrolled = useScrolled();
  const [menuOpen, setMenuOpen] = useState(false);

  // Close the mobile menu on navigation. Adjusted during render (React's
  // documented pattern for resetting state on a prop change) rather than in
  // an effect, since the Navbar itself never remounts across route changes.
  const [lastPathname, setLastPathname] = useState(pathname);
  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setMenuOpen(false);
  }

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  const visibleLinks = LINKS.filter((link) => !link.authOnly || user);

  return (
    <header className="sticky top-4 z-50 px-4">
      <nav
        className={`mx-auto flex max-w-5xl items-center justify-between rounded-full border backdrop-blur-lg transition-all duration-300 ${
          scrolled
            ? 'border-border-bright bg-surface/95 px-5 py-2 shadow-2xl shadow-black/70'
            : 'border-border bg-surface/70 px-5 py-2.5 shadow-lg shadow-black/40'
        }`}
      >
        <Link href="/" onClick={() => setMenuOpen(false)}>
          <Logo className="text-base" />
        </Link>

        <div className="hidden items-center gap-5 text-sm text-muted md:flex">
          {visibleLinks.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative py-1 transition-colors hover:text-foreground ${
                  active ? 'font-medium text-foreground' : ''
                }`}
              >
                {link.label}
                {active && (
                  <span className="absolute right-0 -bottom-1 left-0 h-0.5 rounded-full bg-gradient-sunset" />
                )}
              </Link>
            );
          })}
        </div>

        <div className="hidden items-center gap-4 text-sm text-muted md:flex">
          {user && (
            <button onClick={logout} className="hover:text-foreground">
              Log out
            </button>
          )}
          {!loading && !user && (
            <>
              <Link href="/login" className="hover:text-foreground">
                Log in
              </Link>
              <Link
                href="/register"
                className="rounded-full bg-gradient-sunset px-4 py-1.5 font-medium text-white shadow-lg shadow-violet/20 hover:opacity-90"
              >
                Get started
              </Link>
            </>
          )}
        </div>

        <button
          onClick={() => setMenuOpen((v) => !v)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          className="flex h-9 w-9 items-center justify-center rounded-full text-foreground md:hidden"
        >
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      <div
        className={`mx-auto max-w-5xl overflow-hidden transition-all duration-300 md:hidden ${
          menuOpen ? 'mt-3 max-h-[28rem] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="flex flex-col gap-1 rounded-3xl border border-border-bright bg-surface/95 p-4 shadow-2xl shadow-black/70 backdrop-blur-lg">
          {visibleLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-xl px-4 py-3 text-sm transition-colors hover:bg-background ${
                pathname === link.href ? 'font-medium text-foreground' : 'text-muted'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="mt-2 flex flex-col gap-2 border-t border-border pt-3">
            {user && (
              <button
                onClick={logout}
                className="rounded-xl px-4 py-3 text-left text-sm text-muted hover:bg-background hover:text-foreground"
              >
                Log out
              </button>
            )}
            {!loading && !user && (
              <>
                <Link
                  href="/login"
                  className="rounded-xl px-4 py-3 text-sm text-muted hover:bg-background hover:text-foreground"
                >
                  Log in
                </Link>
                <Link
                  href="/register"
                  className="rounded-full bg-gradient-sunset px-4 py-3 text-center text-sm font-medium text-white shadow-lg shadow-violet/20"
                >
                  Get started
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
