'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './auth-context';

/** Where a signed-out user is sent from a protected page. */
export const LOGIN_PATH = '/login';

/**
 * Protected pages: once auth has finished loading, send a signed-out user to
 * /login with `router.replace` (#46). Using `push` left the protected URL in
 * history, so pressing Back from /login re-entered it and was immediately
 * pushed to /login again, trapping the Back button.
 *
 * Mirror of `useRedirectIfAuthenticated` for guest-only pages (#50).
 */
export function useRequireAuth(to: string = LOGIN_PATH): void {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.replace(to);
  }, [loading, user, router, to]);
}
