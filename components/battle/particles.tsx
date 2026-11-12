"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";

/** Slow drifting lime motes. Kept sparse and low-alpha so it reads as atmosphere, not decoration. */
export function Particles({ count = 28, className }: { count?: number; className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas || reduce) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let w = 0, h = 0, raf = 0;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const resize = () => {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    const ps = Array.from({ length: count }, () => ({
      x: Math.random(), y: Math.random(), r: 0.6 + Math.random() * 1.4,
      vx: (Math.random() - 0.5) * 0.00008, vy: -0.00004 - Math.random() * 0.00008, a: 0.15 + Math.random() * 0.4,
    }));
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(48, now - last);
      last = now;
      ctx.clearRect(0, 0, w, h);
      for (const p of ps) {
        p.x += p.vx * dt; p.y += p.vy * dt;
        if (p.y < -0.02) { p.y = 1.02; p.x = Math.random(); }
        if (p.x < -0.02) p.x = 1.02; if (p.x > 1.02) p.x = -0.02;
        ctx.beginPath();
        ctx.arc(p.x * w, p.y * h, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(183,247,0,${p.a})`;
        ctx.fill();
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, [count, reduce]);

  return <canvas ref={ref} aria-hidden className={className ?? "pointer-events-none absolute inset-0 h-full w-full"} />;
}

/** One-shot burst of lime and white confetti for a win. */
export function Confetti({ active }: { active: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const reduce = useReducedMotion();
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas || !active || reduce) return;
    const ctx = canvas.getContext("2d")!;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const w = (canvas.width = canvas.clientWidth * dpr);
    const h = (canvas.height = canvas.clientHeight * dpr);
    const colors = ["#B7F700", "#D0FF33", "#FFFFFF", "#B7F700"];
    const bits = Array.from({ length: 140 }, () => ({
      x: w / 2 + (Math.random() - 0.5) * w * 0.2,
      y: h * 0.32,
      vx: (Math.random() - 0.5) * 18 * dpr,
      vy: (-8 - Math.random() * 14) * dpr,
      s: (3 + Math.random() * 5) * dpr,
      rot: Math.random() * Math.PI,
      vr: (Math.random() - 0.5) * 0.3,
      c: colors[Math.floor(Math.random() * colors.length)]!,
      life: 1,
    }));
    let raf = 0;
    const tick = () => {
      ctx.clearRect(0, 0, w, h);
      let alive = 0;
      for (const b of bits) {
        b.vy += 0.35 * dpr; b.vx *= 0.985; b.x += b.vx; b.y += b.vy; b.rot += b.vr; b.life -= 0.006;
        if (b.life <= 0 || b.y > h + 20) continue;
        alive++;
        ctx.save();
        ctx.globalAlpha = Math.max(0, b.life);
        ctx.translate(b.x, b.y);
        ctx.rotate(b.rot);
        ctx.fillStyle = b.c;
        ctx.fillRect(-b.s / 2, -b.s / 4, b.s, b.s / 2);
        ctx.restore();
      }
      if (alive) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, reduce]);
  return <canvas ref={ref} aria-hidden className="pointer-events-none absolute inset-0 h-full w-full" />;
}
