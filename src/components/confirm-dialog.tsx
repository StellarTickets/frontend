'use client';

import { useEffect, useId, useRef, type ReactNode } from 'react';
import { Button } from '@/components/button';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  children: ReactNode;
  confirmLabel: string;
  cancelLabel?: string;
  /** Shown on the confirm button while `loading`. */
  loadingLabel?: string;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

/**
 * Modal confirmation for hard-to-reverse actions (#278, #103).
 *
 * role="alertdialog" + aria-modal, labelled by the title and described by the
 * body. Focus starts on Cancel (the safe choice), Tab is kept inside the
 * dialog, Escape or a backdrop click cancels, and focus returns to whatever
 * opened the dialog when it closes.
 */
export function ConfirmDialog({
  open,
  title,
  children,
  confirmLabel,
  cancelLabel = 'Cancel',
  loadingLabel,
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const titleId = useId();
  const bodyId = useId();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const opener = document.activeElement as HTMLElement | null;
    panelRef.current?.querySelector<HTMLElement>('[data-autofocus]')?.focus();

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape' && !loading) {
        e.preventDefault();
        onCancel();
        return;
      }
      if (e.key !== 'Tab' || !panelRef.current) return;
      const focusable = Array.from(
        panelRef.current.querySelectorAll<HTMLElement>('button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])'),
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      opener?.focus?.();
    };
  }, [open, loading, onCancel]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && !loading) onCancel();
      }}
    >
      <div
        ref={panelRef}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={bodyId}
        className="w-full max-w-lg rounded-lg border border-border bg-surface p-6 shadow-xl"
      >
        <h2 id={titleId} className="font-heading text-lg font-bold">
          {title}
        </h2>
        <div id={bodyId} className="mt-2 text-sm text-muted">
          {children}
        </div>
        <div className="mt-6 flex flex-wrap justify-end gap-3">
          <Button data-autofocus variant="secondary" onClick={onCancel} disabled={loading}>
            {cancelLabel}
          </Button>
          <Button onClick={onConfirm} loading={loading}>
            {loading && loadingLabel ? loadingLabel : confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
