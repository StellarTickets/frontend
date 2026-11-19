import { act, createElement } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ParticleNetwork } from './particle-network';

let root: Root | undefined;
let container: HTMLDivElement | undefined;

afterEach(() => {
  if (root) act(() => root?.unmount());
  container?.remove();
  root = undefined;
  container = undefined;
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe('ParticleNetwork resizing', () => {
  it.each([
    ['shorter', [50]],
    ['taller', [200]],
    ['repeated and zero-height', [50, 0, 100, 200, 25]],
  ] as const)('keeps particles inside %s canvases without reseeding', (_, heights) => {
    vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true);
    vi.stubGlobal('devicePixelRatio', 1);
    let height = 100;
    let width = 100;
    let changeVisibility: (visible: boolean) => void = () => {};
    let changeMotion: (event: { matches: boolean }) => void = () => {};
    let resize = () => {};
    const frames = new Map<number, FrameRequestCallback>();
    let nextFrame = 0;
    const arc = vi.fn();
    const disconnectResize = vi.fn();
    const disconnectVisibility = vi.fn();
    const removeMotionListener = vi.fn();
    const context = {
      setTransform: vi.fn(), clearRect: vi.fn(), beginPath: vi.fn(),
      moveTo: vi.fn(), lineTo: vi.fn(), stroke: vi.fn(), arc, fill: vi.fn(),
    };
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(
      context as unknown as CanvasRenderingContext2D,
    );
    vi.spyOn(HTMLCanvasElement.prototype, 'getBoundingClientRect').mockImplementation(
      () => ({ width, height }) as DOMRect,
    );
    const random = vi.spyOn(Math, 'random').mockReturnValue(0.75);
    vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
      frames.set(++nextFrame, callback);
      return nextFrame;
    });
    vi.stubGlobal('cancelAnimationFrame', (id: number) => frames.delete(id));
    vi.stubGlobal('ResizeObserver', class {
      constructor(callback: () => void) { resize = callback; }
      observe() {}
      disconnect = disconnectResize;
    });
    vi.stubGlobal('IntersectionObserver', class {
      constructor(callback: (entries: { isIntersecting: boolean }[]) => void) {
        changeVisibility = (visible) => callback([{ isIntersecting: visible }]);
      }
      observe() {}
      disconnect = disconnectVisibility;
    });
    const motion = {
      matches: false,
      addEventListener: (_type: string, callback: typeof changeMotion) => { changeMotion = callback; },
      removeEventListener: removeMotionListener,
    };
    vi.stubGlobal('matchMedia', () => motion);

    container = document.createElement('div');
    document.body.append(container);
    root = createRoot(container);
    act(() => root?.render(createElement(ParticleNetwork)));
    const seededCalls = random.mock.calls.length;
    for (const [step, nextHeight] of heights.entries()) {
      height = nextHeight;
      act(() => resize());
      arc.mockClear();

      for (let i = 0; i < 10; i++) {
        const pending = [...frames.entries()];
        frames.clear();
        act(() => pending.forEach(([, callback]) => callback(i * 16)));
      }

      expect(random).toHaveBeenCalledTimes(seededCalls);
      expect(arc).toHaveBeenCalledTimes(600);
      if (step === 0) {
        expect(arc.mock.calls[0][1]).toBeCloseTo(0.75 * height + 0.075);
      }
      for (const [x, y] of arc.mock.calls) {
        expect(x).toBeGreaterThanOrEqual(0);
        expect(x).toBeLessThanOrEqual(100);
        expect(y).toBeGreaterThanOrEqual(0);
        expect(y).toBeLessThanOrEqual(height);
      }
    }

    width = 200;
    act(() => resize());
    expect(random).toHaveBeenCalledTimes(seededCalls + 60 * 4);

    act(() => changeVisibility(false));
    expect(frames.size).toBe(0);
    act(() => changeVisibility(true));
    act(() => changeVisibility(true));
    expect(frames.size).toBe(1);
    motion.matches = true;
    act(() => changeMotion(motion));
    expect(frames.size).toBe(0);
    motion.matches = false;
    act(() => changeMotion(motion));
    expect(frames.size).toBe(1);

    act(() => root?.unmount());
    root = undefined;
    expect(frames.size).toBe(0);
    expect(disconnectResize).toHaveBeenCalledOnce();
    expect(disconnectVisibility).toHaveBeenCalledOnce();
    expect(removeMotionListener).toHaveBeenCalledWith('change', expect.any(Function));
  });
});
