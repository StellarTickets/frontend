import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { ConfirmDialog } from './confirm-dialog';

// React's act() environment flag for a non-RTL setup.
(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

let host: HTMLDivElement;
let root: Root;

function renderDialog(props: Partial<Parameters<typeof ConfirmDialog>[0]> = {}) {
  const onConfirm = props.onConfirm ?? vi.fn();
  const onCancel = props.onCancel ?? vi.fn();
  act(() => {
    root.render(
      <ConfirmDialog
        open
        title="Publish this event on-chain?"
        confirmLabel="Confirm and publish"
        onConfirm={onConfirm}
        onCancel={onCancel}
        {...props}
      >
        The resale cap and organizer royalty can&apos;t be changed after publishing.
      </ConfirmDialog>,
    );
  });
  return { onConfirm, onCancel };
}

const dialog = () => document.querySelector<HTMLElement>('[role="alertdialog"]');
const button = (name: string) =>
  Array.from(document.querySelectorAll('button')).find((b) => b.textContent === name)!;

beforeEach(() => {
  host = document.createElement('div');
  document.body.appendChild(host);
  root = createRoot(host);
});

afterEach(() => {
  act(() => root.unmount());
  host.remove();
});

describe('ConfirmDialog (#278)', () => {
  it('renders nothing while closed', () => {
    renderDialog({ open: false });
    expect(dialog()).toBeNull();
  });

  it('is an accessible modal labelled by its title and described by its body', () => {
    renderDialog();
    const el = dialog()!;
    expect(el.getAttribute('aria-modal')).toBe('true');
    expect(document.getElementById(el.getAttribute('aria-labelledby')!)?.textContent).toBe(
      'Publish this event on-chain?',
    );
    expect(document.getElementById(el.getAttribute('aria-describedby')!)?.textContent).toContain(
      "can't be changed after publishing",
    );
  });

  it('focuses Cancel (the safe choice) when it opens', () => {
    renderDialog();
    expect(document.activeElement).toBe(button('Cancel'));
  });

  it('only calls onConfirm from the confirm button', () => {
    const { onConfirm, onCancel } = renderDialog();
    act(() => button('Confirm and publish').click());
    expect(onConfirm).toHaveBeenCalledTimes(1);
    expect(onCancel).not.toHaveBeenCalled();
  });

  it('cancels on the Cancel button and on Escape, without confirming', () => {
    const { onConfirm, onCancel } = renderDialog();
    act(() => button('Cancel').click());
    act(() => {
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    });
    expect(onCancel).toHaveBeenCalledTimes(2);
    expect(onConfirm).not.toHaveBeenCalled();
  });

  it('ignores Escape and disables Cancel while loading', () => {
    const { onCancel } = renderDialog({ loading: true, loadingLabel: 'Publishing…' });
    act(() => {
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    });
    expect(onCancel).not.toHaveBeenCalled();
    expect(button('Cancel').disabled).toBe(true);
    expect(button('Publishing…').getAttribute('aria-busy')).toBe('true');
  });

  it('keeps Tab focus inside the dialog', () => {
    renderDialog();
    button('Confirm and publish').focus();
    act(() => {
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true }));
    });
    expect(document.activeElement).toBe(button('Cancel'));
  });
});
