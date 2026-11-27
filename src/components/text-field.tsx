import type { InputHTMLAttributes } from "react";
import type { LucideIcon } from "lucide-react";

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon: LucideIcon;
  hint?: string;
  error?: string;
}

export function TextField({
  label,
  icon: Icon,
  hint,
  error,
  className,
  id,
  ...props
}: TextFieldProps) {
  // Generate a unique id for the input if not provided
  const inputId = id || `textfield-${label.toLowerCase().replace(/\s+/g, "-")}`;
  const hintId = hint ? `${inputId}-hint` : undefined;
  const errorId = error ? `${inputId}-error` : undefined;

  // Build aria-describedby from hint and error ids
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <div className="flex flex-col gap-1.5 text-sm">
      <label htmlFor={inputId} className="font-medium text-foreground">
        {label}
      </label>
      <span className="relative flex items-center">
        <Icon className="pointer-events-none absolute left-3.5 h-4 w-4 text-muted" />
        <input
          {...props}
          id={inputId}
          aria-describedby={describedBy}
          aria-invalid={error ? true : undefined}
          className={`w-full rounded-xl border border-border bg-background py-2.5 pr-3.5 pl-11 text-foreground transition-colors outline-none focus:border-violet focus:ring-2 focus:ring-violet ${error ? "border-red-500" : ""} ${className ?? ""}`}
        />
      </span>
      {hint && (
        <span id={hintId} className="text-xs text-muted">
          {hint}
        </span>
      )}
      {error && (
        <span id={errorId} className="text-xs text-red-500">
          {error}
        </span>
      )}
    </div>
  );
}
