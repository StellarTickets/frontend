import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, useState } from 'react';
import { createRoot, type Root } from 'react-dom/client';

const api = vi.hoisted(() => ({
  apiFetch: vi.fn(),
  clearToken: vi.fn(),
  getToken: vi.fn((): string | null => null),
}));

vi.mock('./api', async (importOriginal) => ({
  ...(await importOriginal<typeof import('./api')>()),
  apiFetch: api.apiFetch,
  clearToken: api.clearToken,
  getToken: api.getToken,
  setToken: vi.fn(),
}));

import { ApiError } from './api';
import { AuthProvider, useAuth } from './auth-context';

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

beforeEach(() => {
  vi.clearAllMocks();
  api.apiFetch.mockReset();
  api.getToken.mockReturnValue(null);
});

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

describe('AuthProvider failed refresh (#226)', () => {
  it('clears the stored token when /users/me returns 401', async () => {
    api.getToken.mockReturnValue('expired-token');
    api.apiFetch.mockRejectedValue(new ApiError('Unauthorized', 401));
    root = createRoot(document.createElement('div'));

    await act(async () => root.render(<AuthProvider><Consumer /></AuthProvider>));

    expect(api.clearToken).toHaveBeenCalledTimes(1);
    expect(seen.at(-1)).toMatchObject({ user: null, loading: false });
  });

  it('keeps the stored token when the refresh fails for another reason', async () => {
    api.getToken.mockReturnValue('valid-token');
    api.apiFetch.mockRejectedValue(new ApiError('Server error', 500));
    root = createRoot(document.createElement('div'));

    await act(async () => root.render(<AuthProvider><Consumer /></AuthProvider>));

    expect(api.clearToken).not.toHaveBeenCalled();
    expect(seen.at(-1)).toMatchObject({ user: null, loading: false });
  });
});
