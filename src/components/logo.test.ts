// @vitest-environment node

import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { ImageResponse } from 'next/og';
import { LogoMark, LogoMarkForImageResponse } from './logo';

describe('LogoMark gradients', () => {
  it('uses a unique gradient id for each normal React instance', () => {
    const markup = renderToStaticMarkup(
      createElement('div', null, createElement(LogoMark), createElement(LogoMark)),
    );
    const ids = [...markup.matchAll(/<linearGradient id="([^"]+)"/g)].map((match) => match[1]);
    const references = [...markup.matchAll(/fill="url\(#([^)]*)\)"/g)].map((match) => match[1]);

    expect(ids).toHaveLength(2);
    expect(new Set(ids).size).toBe(2);
    expect(references).toEqual(ids);
  });

  it('renders through ImageResponse without React hooks', async () => {
    const response = new ImageResponse(
      createElement(LogoMarkForImageResponse, { size: 60, gradientId: 'st-test-image-grad' }),
      { width: 120, height: 120 },
    );
    const image = new Uint8Array(await response.arrayBuffer());

    expect(Array.from(image.slice(0, 8))).toEqual([137, 80, 78, 71, 13, 10, 26, 10]);
  });
});
