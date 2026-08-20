import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { clearToken, getToken, setToken } from './api';

/**
 * jsdom (via Vitest 4 + Node 22) doesn't reliably attach `window.localStorage`
 * out of the box in this combination, so we provide a minimal in-memory
 * stand-in — this exercises the same `getItem`/`setItem`/`removeItem`
 * contract `src/lib/api.ts` relies on, just not jsdom's own implementation.
 */
function installLocalStorageStub() {
  const store = new Map<string, string>();
  Object.defineProperty(window, 'localStorage', {
    configurable: true,
    value: {
      getItem: (key: string) => store.get(key) ?? null,
      setItem: (key: string, value: string) => {
        store.set(key, value);
      },
      removeItem: (key: string) => {
        store.delete(key);
      },
    },
  });
}

describe('token storage', () => {
  beforeEach(() => {
    installLocalStorageStub();
  });

  afterEach(() => {
    clearToken();
  });

  it('returns null when no token has been set', () => {
    expect(getToken()).toBeNull();
  });

  it('round-trips a token through localStorage', () => {
    setToken('abc.def.ghi');
    expect(getToken()).toBe('abc.def.ghi');
  });

  it('clears the token', () => {
    setToken('abc.def.ghi');
    clearToken();
    expect(getToken()).toBeNull();
  });
});
