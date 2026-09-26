'use client';

import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { apiFetch, clearToken, getToken, isUnauthorized, setToken } from './api';
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
    } catch (err) {
      // A 401 means the stored JWT is expired or invalid: drop it so later
      // requests stop sending a dead Authorization header (#42). Other
      // failures (network, 5xx) keep the token — the session may be fine.
      if (isUnauthorized(err)) clearToken();
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

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refresh }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
