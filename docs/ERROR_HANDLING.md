# Error handling

`src/lib/api.ts`'s `apiFetch` throws `ApiError` (carrying the HTTP
status and the backend's message, joining validation-error arrays into
one string) for any non-2xx response. Every page that calls it wraps
the call in `try/catch` and renders the message via the shared
`FormError` component — there's no global error boundary yet, so an
unhandled throw outside those call sites would hit Next's default
error page.
