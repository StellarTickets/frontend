import { createElement } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { act } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const push = vi.fn();
const replace = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push, replace }),
}));

const authState: { user: unknown; loading: boolean } = { user: null, loading: false };
vi.mock('./auth-context', () => ({
  useAuth: () => authState,
}));

import { LOGIN_PATH, useRequireAuth } from './use-require-auth';

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

function Probe({ to }: { to?: string }) {
  useRequireAuth(to);
  return null;
}

let container: HTMLDivElement;
let root: Root;

function renderProbe(to?: string) {
  act(() => {
    root.render(createElement(Probe, { to }));
  });
}

beforeEach(() => {
  push.mockReset();
  replace.mockReset();
  authState.user = null;
  authState.loading = false;
  container = document.createElement('div');
  document.body.appendChild(container);
  root = createRoot(container);
});

afterEach(() => {
  act(() => root.unmount());
  container.remove();
});

describe('useRequireAuth (#46)', () => {
  it('replaces (not pushes) to /login for a signed-out user', () => {
    renderProbe();
    expect(replace).toHaveBeenCalledWith(LOGIN_PATH);
    expect(LOGIN_PATH).toBe('/login');
    // push would leave the protected page in history and trap the Back button.
    expect(push).not.toHaveBeenCalled();
  });

  it('does not redirect while auth is still loading', () => {
    authState.loading = true;
    renderProbe();
    expect(replace).not.toHaveBeenCalled();
    expect(push).not.toHaveBeenCalled();
  });

  it('does not redirect a signed-in user', () => {
    authState.user = { id: 'u1' };
    renderProbe();
    expect(replace).not.toHaveBeenCalled();
    expect(push).not.toHaveBeenCalled();
  });

  it('redirects once loading finishes without a user', () => {
    authState.loading = true;
    renderProbe();
    expect(replace).not.toHaveBeenCalled();

    authState.loading = false;
    renderProbe();
    expect(replace).toHaveBeenCalledTimes(1);
    expect(replace).toHaveBeenCalledWith('/login');
  });

  it('supports a custom destination', () => {
    renderProbe('/login?next=%2Fverify');
    expect(replace).toHaveBeenCalledWith('/login?next=%2Fverify');
  });
});
