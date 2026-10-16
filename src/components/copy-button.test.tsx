import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';

const copyToClipboard = vi.fn<(text: string) => Promise<boolean>>();
vi.mock('@/lib/clipboard', () => ({ copyToClipboard: (t: string) => copyToClipboard(t) }));

import { CopyButton } from './copy-button';

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

let host: HTMLDivElement;
let root: Root;

beforeEach(() => {
  vi.useFakeTimers();
  copyToClipboard.mockReset();
  host = document.createElement('div');
  document.body.appendChild(host);
  root = createRoot(host);
});

afterEach(() => {
  act(() => root.unmount());
  host.remove();
  vi.useRealTimers();
});

function render(value = 'GATE-1234', label = 'Copy gate code') {
  act(() => root.render(<CopyButton value={value} label={label} />));
  return {
    button: host.querySelector('button')!,
    status: host.querySelector('[role="status"]')!,
  };
}

async function click(button: HTMLButtonElement) {
  await act(async () => {
    button.click();
  });
}

describe('CopyButton (#242)', () => {
  it('is a labelled button with an empty polite live region at rest', () => {
    const { button, status } = render();
    expect(button.getAttribute('type')).toBe('button');
    expect(button.getAttribute('aria-label')).toBe('Copy gate code');
    expect(status.getAttribute('aria-live')).toBe('polite');
    expect(status.textContent).toBe('');
  });

  it('copies the value in one click and announces "Copied"', async () => {
    copyToClipboard.mockResolvedValue(true);
    const { button, status } = render('GATE-1234');
    await click(button);
    expect(copyToClipboard).toHaveBeenCalledWith('GATE-1234');
    expect(status.textContent).toBe('Copied');
  });

  it('announces "Copy failed" when the clipboard is unavailable', async () => {
    copyToClipboard.mockResolvedValue(false);
    const { button, status } = render();
    await click(button);
    expect(status.textContent).toBe('Copy failed');
  });

  it('clears the announcement after 2 seconds', async () => {
    copyToClipboard.mockResolvedValue(true);
    const { button, status } = render();
    await click(button);
    expect(status.textContent).toBe('Copied');
    act(() => {
      vi.advanceTimersByTime(2000);
    });
    expect(status.textContent).toBe('');
  });
});
