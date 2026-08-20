import { afterEach, describe, expect, it, vi } from 'vitest';
import { apiFetch, ApiError } from './api';

describe('apiFetch', () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  it('returns the parsed JSON body on success', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve({ id: '1' }),
    }) as unknown as typeof fetch;

    const result = await apiFetch<{ id: string }>('/events', { auth: false });
    expect(result).toEqual({ id: '1' });
  });

  it('returns undefined for a 204 No Content response', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 204,
      json: () => Promise.resolve(undefined),
    }) as unknown as typeof fetch;

    const result = await apiFetch('/tickets/1/cancel-resale', { method: 'POST', auth: false });
    expect(result).toBeUndefined();
  });

  it('throws ApiError with the backend message on a non-2xx response', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 403,
      statusText: 'Forbidden',
      json: () => Promise.resolve({ message: 'You are not a member of this organization' }),
    }) as unknown as typeof fetch;

    await expect(apiFetch('/organizations/1', { auth: false })).rejects.toMatchObject({
      status: 403,
      message: 'You are not a member of this organization',
    });
  });

  it('joins an array of validation messages into one string', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 400,
      statusText: 'Bad Request',
      json: () => Promise.resolve({ message: ['name must be longer', 'slug is required'] }),
    }) as unknown as typeof fetch;

    await expect(apiFetch('/organizations', { auth: false })).rejects.toBeInstanceOf(ApiError);
    try {
      await apiFetch('/organizations', { auth: false });
    } catch (err) {
      expect((err as ApiError).message).toBe('name must be longer, slug is required');
    }
  });
});
