'use client';

import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { apiFetch, clearToken, getToken, setToken } from './api';
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
    // Anonymous visitors have no token, so this request can only 401. Firing it
    // on every first page load costs a round trip, logs a spurious auth failure
    // server-side, and reports a "failed" request in the browser console on a
    // perfectly normal visit. Nothing is lost by skipping it: the catch below
    // already resolves to the same null user.
    if (!getToken()) {
      setUser(null);
      return;
    }
    try {
      const me = await apiFetch<Me>('/users/me');
      setUser(me);
    } catch {
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
