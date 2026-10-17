import { describe, expect, it } from 'vitest';
import { createElement, Fragment } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { LogoMark } from './logo';

describe('LogoMark', () => {
  it('gives each instance its own gradient id (#318)', () => {
    const html = renderToStaticMarkup(
      createElement(Fragment, null, createElement(LogoMark), createElement(LogoMark)),
    );

    const ids = [...html.matchAll(/<linearGradient id="([^"]+)"/g)].map((m) => m[1]);
    const fills = [...html.matchAll(/fill="url\(#([^)]+)\)"/g)].map((m) => m[1]);

    expect(ids).toHaveLength(2);
    expect(ids[0]).not.toBe(ids[1]);
    // Each shape points at its own gradient, not the other instance's.
    expect(fills).toEqual(ids);
  });
});
