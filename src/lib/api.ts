const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';
const TOKEN_KEY = 'stellartickets.token';

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * The request never got a usable response: it timed out or the network
 * failed. Extends ApiError (status 0) so existing `instanceof ApiError`
 * handling, e.g. actionErrorMessage, surfaces its friendly message.
 */
export class NetworkError extends ApiError {
  constructor(message: string) {
    super(message, 0);
    this.name = 'NetworkError';
  }
}

/** Default per-request timeout; override with `RequestOptions.timeoutMs`. */
export const DEFAULT_TIMEOUT_MS = 15_000;

export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string) {
  window.localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  window.localStorage.removeItem(TOKEN_KEY);
}

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  body?: unknown;
  auth?: boolean;
  /** Caller-controlled cancellation (e.g. on unmount). Aborting rethrows the original AbortError. */
  signal?: AbortSignal;
  /** Milliseconds before the request fails with a NetworkError. Defaults to DEFAULT_TIMEOUT_MS; 0 disables. */
  timeoutMs?: number;
}

function isAbortError(err: unknown): boolean {
  return err instanceof Error && (err.name === 'AbortError' || err.name === 'TimeoutError');
}

/** Backend BigInt fields (prices, chain ids) arrive as JSON strings/numbers depending on Nest's serializer; kept as strings end-to-end. */
export async function apiFetch<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, auth = true, signal, timeoutMs = DEFAULT_TIMEOUT_MS } = options;
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };

  if (auth) {
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  // Combine the caller's signal with the timeout so a stalled backend can't
  // leave the UI in a loading state forever (#54).
  const timeoutSignal = timeoutMs > 0 ? AbortSignal.timeout(timeoutMs) : undefined;
  const signals = [signal, timeoutSignal].filter((s): s is AbortSignal => s !== undefined);
  const combined = signals.length > 1 ? AbortSignal.any(signals) : signals[0];

  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal: combined,
    });
  } catch (err) {
    // A deliberate cancel by the caller is not an error to show the user.
    if (signal?.aborted) throw err;
    if (timeoutSignal?.aborted || isAbortError(err)) {
      throw new NetworkError('The server took too long to respond. Please try again.');
    }
    throw new NetworkError('Could not reach the server. Check your connection and try again.');
  }

  if (!res.ok) {
    const payload = await res.json().catch(() => null);
    const message = Array.isArray(payload?.message)
      ? payload.message.join(', ')
      : (payload?.message ?? res.statusText);
    throw new ApiError(message, res.status);
  }

  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}
