import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes } from 'react';

/** Shared control styling for dashboard form inputs and selects (#129, #302). */
export const FIELD_CONTROL_CLASS = 'rounded-md border border-border bg-surface px-3 py-2';

/**
 * A labelled form field: wraps its control in a <label> so clicking the text
 * focuses it, with the label text above and any hints/errors below.
 */
export function FormField({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      {label}
      {children}
    </label>
  );
}

/** Muted helper text under a field; pass `id` to reference it via aria-describedby. */
export function FieldHint({ id, children }: { id?: string; children: ReactNode }) {
  return (
    <span id={id} className="text-xs text-muted">
      {children}
    </span>
  );
}

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`${FIELD_CONTROL_CLASS} ${className ?? ''}`.trim()} />;
}

export function Select({ className, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={`${FIELD_CONTROL_CLASS} ${className ?? ''}`.trim()} />;
}
