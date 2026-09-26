import { afterEach, describe, expect, it, vi } from 'vitest';
import { apiFetch, ApiError, NetworkError } from './api';

/** A fetch that never resolves on its own, only rejects when its signal aborts. */
function hangingFetch() {
  return vi.fn((_url: string, init?: RequestInit) =>
    new Promise((_resolve, reject) => {
      init?.signal?.addEventListener('abort', () => reject(init.signal?.reason ?? new DOMException('Aborted', 'AbortError')));
    }),
  ) as unknown as typeof fetch;
}

describe('apiFetch timeout & cancellation (#54)', () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  it('fails with a friendly NetworkError when the backend stalls past the timeout', async () => {
    global.fetch = hangingFetch();
    const err = await apiFetch('/events', { auth: false, timeoutMs: 20 }).catch((e) => e);
    expect(err).toBeInstanceOf(NetworkError);
    expect(err).toBeInstanceOf(ApiError);
    if (!(err instanceof ApiError)) throw err;
    expect(err.status).toBe(0);
    expect(err.message).toMatch(/took too long/);
  });

  it('wraps a network failure in a NetworkError', async () => {
    global.fetch = vi.fn().mockRejectedValue(new TypeError('Failed to fetch')) as unknown as typeof fetch;
    const err = await apiFetch('/events', { auth: false }).catch((e) => e);
    expect(err).toBeInstanceOf(NetworkError);
    if (!(err instanceof NetworkError)) throw err;
    expect(err.message).toMatch(/Could not reach the server/);
  });

  it('rethrows the AbortError when the caller cancels', async () => {
    global.fetch = hangingFetch();
    const controller = new AbortController();
    const pending = apiFetch('/events', { auth: false, signal: controller.signal });
    controller.abort();
    const err = await pending.catch((e) => e);
    expect(err).not.toBeInstanceOf(NetworkError);
    if (!(err instanceof Error)) throw err;
    expect(err.name).toBe('AbortError');
  });

  it('passes an AbortSignal to fetch by default', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, status: 200, json: () => Promise.resolve({}) });
    global.fetch = fetchMock as unknown as typeof fetch;
    await apiFetch('/events', { auth: false });
    expect(fetchMock.mock.calls[0][1].signal).toBeInstanceOf(AbortSignal);
  });
});
