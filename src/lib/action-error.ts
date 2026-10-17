import { ApiError } from './api';
import { WalletError } from './wallet';

/**
 * User-facing message for a failed wallet-backed action. API and wallet errors
 * (rejected Freighter popup, locked extension, wrong network) carry an
 * actionable message; anything else falls back to `fallback`.
 */
export function actionErrorMessage(err: unknown, fallback: string): string {
  if ((err instanceof ApiError || err instanceof WalletError) && err.message) {
    return err.message;
  }
  return fallback;
}
