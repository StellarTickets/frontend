'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './auth-context';

/** Where a signed-in user lands by default (matches the post-login redirect). */
export const DEFAULT_AUTHENTICATED_PATH = '/dashboard';

/**
 * Guest-only pages (/login, /register): once auth has finished loading, send
 * a signed-in user to their default page with `router.replace`, so the auth
 * form isn't left in history (#50).
 *
 * Returns true while the page should render nothing — auth still loading or a
 * redirect in flight — so the form never flashes for a signed-in user.
 */
export function useRedirectIfAuthenticated(to: string = DEFAULT_AUTHENTICATED_PATH): boolean {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) router.replace(to);
  }, [loading, user, router, to]);

  return loading || user !== null;
}
