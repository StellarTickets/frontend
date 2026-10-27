import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Button, buttonClassName } from './button';

function render(props: Parameters<typeof Button>[0]): HTMLButtonElement {
  const host = document.createElement('div');
  host.innerHTML = renderToStaticMarkup(createElement(Button, props));
  return host.querySelector('button')!;
}

describe('buttonClassName', () => {
  it('defaults to the primary md style', () => {
    const cls = buttonClassName();
    expect(cls).toContain('bg-gradient-action');
    expect(cls).toContain('rounded-md px-4 py-2');
  });

  it('maps variants and sizes', () => {
    expect(buttonClassName({ variant: 'secondary' })).toContain('border-border');
    expect(buttonClassName({ variant: 'danger' })).toContain('text-red-300');
    expect(buttonClassName({ size: 'sm' })).toContain('px-3 py-2 text-sm');
    expect(buttonClassName({ size: 'lg' })).toContain('rounded-xl px-4 py-3');
  });

  it('appends caller classes', () => {
    expect(buttonClassName({ className: 'mt-2' }).endsWith(' mt-2')).toBe(true);
  });
});

describe('action gradient contrast', () => {
  it('keeps white text at WCAG AA contrast across the CSS gradient', () => {
    const css = readFileSync('src/app/globals.css', 'utf8');
    const declaration = css.match(/--gradient-action:\s*linear-gradient\([^;]+\);/i)?.[0];
    expect(declaration).toBeDefined();

    const stops = [...declaration!.matchAll(/(#[\da-f]{6})\s+([\d.]+)%/gi)].map((match) => ({
      position: Number(match[2]) / 100,
      color: [1, 3, 5].map((offset) => Number.parseInt(match[1].slice(offset, offset + 2), 16)),
    }));
    expect(stops.length).toBeGreaterThanOrEqual(2);
    expect(stops[0].position).toBe(0);
    expect(stops.at(-1)?.position).toBe(1);

    const linearise = (channel: number) => {
      const srgb = channel / 255;
      return srgb <= 0.04045 ? srgb / 12.92 : ((srgb + 0.055) / 1.055) ** 2.4;
    };
    const luminance = (color: number[]) =>
      0.2126 * linearise(color[0]) + 0.7152 * linearise(color[1]) + 0.0722 * linearise(color[2]);

    let minimumContrast = Number.POSITIVE_INFINITY;
    for (let index = 0; index < stops.length - 1; index += 1) {
      const start = stops[index];
      const end = stops[index + 1];
      for (let sample = 0; sample <= 1000; sample += 1) {
        const progress = sample / 1000;
        const color = start.color.map((channel, component) =>
          channel + (end.color[component] - channel) * progress,
        );
        minimumContrast = Math.min(minimumContrast, 1.05 / (luminance(color) + 0.05));
      }
    }

    expect(minimumContrast).toBeGreaterThanOrEqual(4.5);
  });
});

describe('Button', () => {
  it('defaults to type="button" and is not busy', () => {
    const btn = render({ children: 'Go' });
    expect(btn.type).toBe('button');
    expect(btn.disabled).toBe(false);
    expect(btn.hasAttribute('aria-busy')).toBe(false);
  });

  it('loading disables the button and sets aria-busy', () => {
    const btn = render({ loading: true, children: 'Saving…' });
    expect(btn.disabled).toBe(true);
    expect(btn.getAttribute('aria-busy')).toBe('true');
  });

  it('respects an explicit disabled without marking busy', () => {
    const btn = render({ disabled: true, children: 'Go' });
    expect(btn.disabled).toBe(true);
    expect(btn.hasAttribute('aria-busy')).toBe(false);
  });

  it('passes through type="submit"', () => {
    expect(render({ type: 'submit', children: 'Send' }).type).toBe('submit');
  });
});
