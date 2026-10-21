import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { FormError } from './form-error';

describe('FormError', () => {
  it('renders an assertive alert with a stable id', () => {
    const markup = renderToStaticMarkup(
      createElement(FormError, { message: 'Invalid credentials', id: 'login-form-error' }),
    );

    expect(markup).toContain('id="login-form-error"');
    expect(markup).toContain('role="alert"');
    expect(markup).toContain('aria-live="assertive"');
    expect(markup).toContain('Invalid credentials');
  });

  it('renders nothing when there is no error', () => {
    expect(renderToStaticMarkup(createElement(FormError, { message: null }))).toBe('');
  });
});
