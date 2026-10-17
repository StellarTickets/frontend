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
      className="rounded-md border border-danger/30 bg-danger/10 px-3 py-2 text-sm text-danger"
    >
      {message}
    </p>
  );
}
