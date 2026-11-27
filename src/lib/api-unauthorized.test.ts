import { describe, expect, it } from 'vitest';
import { ApiError, isUnauthorized, NetworkError } from './api';

describe('isUnauthorized (#42)', () => {
  it('is true only for a 401 ApiError', () => {
    expect(isUnauthorized(new ApiError('Unauthorized', 401))).toBe(true);
  });

  it('keeps the token for other failures', () => {
    expect(isUnauthorized(new ApiError('Forbidden', 403))).toBe(false);
    expect(isUnauthorized(new ApiError('Server error', 500))).toBe(false);
    expect(isUnauthorized(new NetworkError('Could not reach the server.'))).toBe(false);
    expect(isUnauthorized(new Error('boom'))).toBe(false);
  });
});
