export function FormError({
  message,
  id = 'form-error',
}: {
  message: string | null;
  id?: string;
}) {
  if (!message) return null;
  return (
    <p
      id={id}
      role="alert"
      aria-live="assertive"
      className="rounded-md border border-red-900/50 bg-red-950/40 px-3 py-2 text-sm text-red-300"
    >
      {message}
    </p>
  );
}
