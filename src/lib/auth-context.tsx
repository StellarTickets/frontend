'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { apiFetch, clearToken, getToken, isUnauthorized, setToken, TOKEN_KEY } from './api';
import { useRouter, usePathname } from 'next/navigation';
import { apiFetch, clearToken, getToken, setOnUnauthorized, setToken } from './api';
import type { Me } from './types';

interface AuthResponse {
  accessToken: string;
  user: { id: string; email: string; name: string; role: string };
}

interface AuthContextValue {
  user: Me | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Me | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const refresh = useCallback(async () => {
    // No stored token: we're signed out, so skip the /users/me round-trip
    // that would only fail on every page load (#42).
    if (!getToken()) {
      setUser(null);
      return;
    }
    try {
      const me = await apiFetch<Me>('/users/me');
      setUser(me);
    } catch {
      // apiFetch already clears the token and fires onUnauthorized on 401.
      // Other failures (network, 5xx) keep the token — the session may be fine.
      setUser(null);
    }
  }, []);

  useEffect(() => {
    async function run() {
      await refresh();
      setLoading(false);
    }
    void run();
  }, [refresh]);

  // Sync auth state across browser tabs: when another tab logs in or out it
  // writes/removes the token key in localStorage, which fires a 'storage'
  // event in every *other* tab. We re-evaluate the session so the UI matches.
  useEffect(() => {
    function handleStorage(e: StorageEvent) {
      if (e.key !== TOKEN_KEY) return;
      if (e.newValue === null) {
        // Token removed in another tab — sign out here too.
        setUser(null);
      } else {
        // Token added or replaced in another tab — refresh to pick up the new user.
        void refresh();
      }
    }
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [refresh]);
  // Register the apiFetch 401 handler so any authenticated request that gets
  // a 401 outside of AuthProvider's own refresh() call also clears the session
  // and bounces the user to /login?next= (#225).
  useEffect(() => {
    setOnUnauthorized(() => {
      setUser(null);
      const next = encodeURIComponent(pathname ?? '/');
      router.replace(`/login?next=${next}`);
    });
    return () => setOnUnauthorized(null);
  }, [router, pathname]);

  const login = useCallback(
    async (email: string, password: string) => {
      const res = await apiFetch<AuthResponse>('/auth/login', {
        method: 'POST',
        body: { email, password },
        auth: false,
      });
      setToken(res.accessToken);
      await refresh();
    },
    [refresh],
  );

  const register = useCallback(
    async (email: string, password: string, name: string) => {
      const res = await apiFetch<AuthResponse>('/auth/register', {
        method: 'POST',
        body: { email, password, name },
        auth: false,
      });
      setToken(res.accessToken);
      await refresh();
    },
    [refresh],
  );

  const logout = useCallback(() => {
    clearToken();
    setUser(null);
  }, []);

  // A fresh object every render would re-render every useAuth() consumer
  // whenever AuthProvider's parent re-renders, even with no auth change (#52, #306).
  const value = useMemo(
    () => ({ user, loading, login, register, logout, refresh }),
    [user, loading, login, register, logout, refresh],
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
