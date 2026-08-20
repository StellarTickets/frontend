import type { InputHTMLAttributes } from 'react';
import type { LucideIcon } from 'lucide-react';

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon: LucideIcon;
  hint?: string;
}

export function TextField({ label, icon: Icon, hint, className, ...props }: TextFieldProps) {
  return (
    <label className="flex flex-col gap-1.5 text-sm">
      <span className="font-medium text-foreground">{label}</span>
      <span className="relative flex items-center">
        <Icon className="pointer-events-none absolute left-3.5 h-4 w-4 text-muted" />
        <input
          {...props}
          className={`w-full rounded-xl border border-border bg-background py-2.5 pr-3.5 pl-11 text-foreground transition-colors outline-none focus:border-violet focus:ring-2 focus:ring-violet/20 ${className ?? ''}`}
        />
      </span>
      {hint && <span className="text-xs text-muted">{hint}</span>}
    </label>
  );
}
