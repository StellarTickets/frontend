# Forms

No form library (no react-hook-form/formik) — every form is plain
controlled `useState` + a submit handler that calls `apiFetch`
directly, since the forms in this app are short (login, register,
create event, issue ticket) and don't need field-level async
validation or complex conditional logic. Native HTML validation
attributes (`required`, `pattern`, `minLength`) provide the first
line of defense before the request even goes out; the backend's
`class-validator` DTOs are the real source of truth.
