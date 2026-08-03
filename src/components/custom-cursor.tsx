'use client';

import { useEffect, useRef } from 'react';

/** A small mix-blend-mode dot that follows the pointer, layered on top of the real cursor — not a replacement for it. */
export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!canHover || reducedMotion || !dotRef.current) return;

    dotRef.current.style.opacity = '1';

    function handleMove(e: MouseEvent) {
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
      }
    }
    function handleOver(e: MouseEvent) {
      const target = e.target as HTMLElement;
      const interactive = target.closest('a, button, input, select, textarea, summary');
      if (dotRef.current) {
        dotRef.current.style.width = interactive ? '28px' : '10px';
        dotRef.current.style.height = interactive ? '28px' : '10px';
      }
    }
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseover', handleOver);
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseover', handleOver);
    };
  }, []);

  return <div ref={dotRef} className="cursor-dot" style={{ opacity: 0 }} />;
}
