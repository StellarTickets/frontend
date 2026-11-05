import { afterEach, describe, expect, it, vi } from 'vitest';
import { resolveEnv } from './env';

const originalNodeEnv = process.env.NODE_ENV;

afterEach(() => {
  vi.stubEnv('NODE_ENV', originalNodeEnv ?? 'test');
});

describe('resolveEnv', () => {
  it('returns the value when it is set, regardless of NODE_ENV', () => {
    vi.stubEnv('NODE_ENV', 'production');
    expect(resolveEnv('X', 'https://api.example.com', 'http://localhost:3000')).toBe(
      'https://api.example.com',
    );
  });

  it('falls back to the dev default outside production', () => {
    vi.stubEnv('NODE_ENV', 'development');
    expect(resolveEnv('X', undefined, 'http://localhost:3000')).toBe('http://localhost:3000');
  });

  it('falls back to the dev default in test', () => {
    vi.stubEnv('NODE_ENV', 'test');
    expect(resolveEnv('X', undefined, 'http://localhost:3000')).toBe('http://localhost:3000');
  });

  it('throws instead of silently falling back when missing in production', () => {
    vi.stubEnv('NODE_ENV', 'production');
    expect(() => resolveEnv('NEXT_PUBLIC_API_URL', undefined, 'http://localhost:3000')).toThrow(
      /NEXT_PUBLIC_API_URL/,
    );
  });

  it('treats an empty string the same as missing', () => {
    vi.stubEnv('NODE_ENV', 'production');
    expect(() => resolveEnv('NEXT_PUBLIC_API_URL', '', 'http://localhost:3000')).toThrow(
      /NEXT_PUBLIC_API_URL/,
    );
  });
});
