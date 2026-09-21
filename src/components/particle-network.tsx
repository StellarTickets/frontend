'use client';

import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

const PARTICLE_COUNT = 60;
const LINK_DISTANCE = 130;

/** A subtle animated dot-network in the hero background — decorative only. */
export function ParticleNetwork() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let particles: Particle[] = [];
    let frameId: number | null = null;
    let visible = true;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    function resize() {
      const rect = canvas!.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas!.width = width * devicePixelRatio;
      canvas!.height = height * devicePixelRatio;
      ctx!.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
    }

    function seed() {
      particles = Array.from({ length: PARTICLE_COUNT }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
      }));
    }

    function tick() {
      frameId = null;
      if (reducedMotion.matches || !visible) return;

      ctx!.clearRect(0, 0, width, height);

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;
      }

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i];
          const b = particles[j];
          const dist = Math.hypot(a.x - b.x, a.y - b.y);
          if (dist < LINK_DISTANCE) {
            ctx!.strokeStyle = `rgba(167, 139, 250, ${0.18 * (1 - dist / LINK_DISTANCE)})`;
            ctx!.lineWidth = 1;
            ctx!.beginPath();
            ctx!.moveTo(a.x, a.y);
            ctx!.lineTo(b.x, b.y);
            ctx!.stroke();
          }
        }
      }

      for (const p of particles) {
        ctx!.fillStyle = 'rgba(244, 114, 182, 0.5)';
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, 1.6, 0, Math.PI * 2);
        ctx!.fill();
      }

      frameId = requestAnimationFrame(tick);
    }

    function stop() {
      if (frameId !== null) {
        cancelAnimationFrame(frameId);
        frameId = null;
      }
    }

    function start() {
      if (frameId === null && !reducedMotion.matches && visible) {
        frameId = requestAnimationFrame(tick);
      }
    }

    function onMotionPreferenceChange(event: MediaQueryListEvent) {
      if (event.matches) {
        stop();
      } else {
        start();
      }
    }

    resize();
    seed();
    if (!reducedMotion.matches) start();

    const observer = new ResizeObserver(() => {
      resize();
      seed();
    });
    observer.observe(canvas);

    reducedMotion.addEventListener('change', onMotionPreferenceChange);

    const visibilityObserver = 'IntersectionObserver' in window
      ? new IntersectionObserver((entries) => {
          const entry = entries[0];
          if (!entry) return;
          visible = entry.isIntersecting;
          if (visible) start();
          else stop();
        })
      : null;
    visibilityObserver?.observe(canvas);

    return () => {
      stop();
      reducedMotion.removeEventListener('change', onMotionPreferenceChange);
      observer.disconnect();
      visibilityObserver?.disconnect();
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden="true" />;
}
