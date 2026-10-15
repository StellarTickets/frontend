import { afterEach, describe, expect, it, vi } from 'vitest';
import { act, useState } from 'react';
import { createRoot, type Root } from 'react-dom/client';

vi.mock('./api', () => ({
  apiFetch: vi.fn(),
  clearToken: vi.fn(),
  getToken: () => null,
  isUnauthorized: () => false,
  setToken: vi.fn(),
}));

import { AuthProvider, useAuth } from './auth-context';

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const seen: unknown[] = [];

function Consumer() {
  seen.push(useAuth());
  return null;
}

function Parent() {
  const [n, setN] = useState(0);
  return (
    <AuthProvider>
      <button onClick={() => setN(n + 1)}>{n}</button>
      <Consumer />
    </AuthProvider>
  );
}

let root: Root;
afterEach(() => act(() => root.unmount()));

describe('AuthProvider (#306)', () => {
  it('keeps the context value stable when an unrelated parent state changes', async () => {
    const container = document.createElement('div');
    root = createRoot(container);
    await act(async () => root.render(<Parent />));
    const before = seen.at(-1);

    await act(async () => container.querySelector('button')!.click());
    expect(container.textContent).toBe('1');

    expect(seen.at(-1)).toBe(before);
  });
});
