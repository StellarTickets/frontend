import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { Logo, LogoMark, LogoMarkImage } from './logo';

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

let host: HTMLDivElement;
let root: Root;

beforeEach(() => {
  host = document.createElement('div');
  document.body.appendChild(host);
  root = createRoot(host);
});

afterEach(() => {
  act(() => root.unmount());
  host.remove();
});

// ── Issue #395 ────────────────────────────────────────────────────────────────

describe('LogoMark accessibility (#395)', () => {
  it('has role="img" and aria-label="StellarTickets" when standalone', () => {
    act(() => { root.render(<LogoMark />); });
    const mark = host.querySelector<HTMLElement>('[role="img"]');
    expect(mark).not.toBeNull();
    expect(mark!.getAttribute('aria-label')).toBe('StellarTickets');
  });

  it('the "ST" span is aria-hidden so the label is not read twice', () => {
    act(() => { root.render(<LogoMark />); });
    const span = host.querySelector<HTMLElement>('span');
    expect(span!.getAttribute('aria-hidden')).toBe('true');
  });

  it('is aria-hidden when used as a decorative mark (aria-hidden prop)', () => {
    act(() => { root.render(<LogoMark aria-hidden="true" />); });
    const wrapper = host.firstElementChild as HTMLElement;
    expect(wrapper.getAttribute('aria-hidden')).toBe('true');
    expect(wrapper.getAttribute('role')).toBeNull();
    expect(wrapper.getAttribute('aria-label')).toBeNull();
  });

  it('Logo hides the mark so AT reads only "StellarTickets"', () => {
    act(() => { root.render(<Logo />); });
    // The LogoMark wrapper must be aria-hidden inside Logo.
    const hiddenMark = host.querySelector<HTMLElement>('[aria-hidden="true"]');
    expect(hiddenMark).not.toBeNull();
    // The visible text "StellarTickets" must still be in the tree.
    expect(host.textContent).toContain('StellarTickets');
    // There must be no role="img" inside Logo — the mark is decorative there.
    expect(host.querySelector('[role="img"]')).toBeNull();
  });
});

describe('LogoMarkImage (satori path)', () => {
  it('passes role and aria-label through to the wrapper div', () => {
    act(() => {
      root.render(<LogoMarkImage role="img" aria-label="StellarTickets" />);
    });
    const div = host.firstElementChild as HTMLElement;
    expect(div.getAttribute('role')).toBe('img');
    expect(div.getAttribute('aria-label')).toBe('StellarTickets');
  });

  it('passes aria-hidden through to the wrapper div', () => {
    act(() => {
      root.render(<LogoMarkImage aria-hidden="true" />);
    });
    const div = host.firstElementChild as HTMLElement;
    expect(div.getAttribute('aria-hidden')).toBe('true');
  });

  it('renders with no aria attributes by default (satori use case)', () => {
    act(() => { root.render(<LogoMarkImage />); });
    const div = host.firstElementChild as HTMLElement;
    expect(div.getAttribute('role')).toBeNull();
    expect(div.getAttribute('aria-label')).toBeNull();
    expect(div.getAttribute('aria-hidden')).toBeNull();
  });
});
