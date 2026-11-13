"use client";

import { useEffect, useRef, useCallback } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  alpha: number;
}

interface TrailPoint {
  x: number;
  y: number;
  vx: number;
  vy: number;
  timestamp: number;
}

/**
 * Premium Futuristic Cursor Trail Effect
 * Creates a flowing, energy-like trail that follows the cursor
 * with electric lime glow matching Dev Battle's color scheme
 */
export function CursorTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const mouseRef = useRef({ x: 0, y: 0, prevX: 0, prevY: 0 });
  const trailPointsRef = useRef<TrailPoint[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const lastTimeRef = useRef(Date.now());
  const isActiveRef = useRef(false);

  // Check if device supports hover (not touch-only)
  const isTouchDevice = useCallback(() => {
    return (
      "ontouchstart" in window ||
      navigator.maxTouchPoints > 0 ||
      // @ts-ignore
      navigator.msMaxTouchPoints > 0
    );
  }, []);

  // Check for reduced motion preference
  const prefersReducedMotion = useCallback(() => {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  // Initialize canvas
  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.scale(dpr, dpr);
    }
  }, []);

  // Calculate velocity and create trail point
  const addTrailPoint = useCallback((x: number, y: number) => {
    const now = Date.now();
    const deltaTime = (now - lastTimeRef.current) / 1000;
    lastTimeRef.current = now;

    const vx = (x - mouseRef.current.prevX) / deltaTime;
    const vy = (y - mouseRef.current.prevY) / deltaTime;

    mouseRef.current.prevX = x;
    mouseRef.current.prevY = y;

    trailPointsRef.current.push({
      x,
      y,
      vx,
      vy,
      timestamp: now,
    });

    // Keep only recent points (last 150ms)
    const cutoff = now - 150;
    trailPointsRef.current = trailPointsRef.current.filter(
      (p) => p.timestamp > cutoff
    );

    // Emit particles based on velocity
    const speed = Math.sqrt(vx * vx + vy * vy);
    if (speed > 100 && Math.random() > 0.7) {
      const particle: Particle = {
        x,
        y,
        vx: vx * 0.1 + (Math.random() - 0.5) * 50,
        vy: vy * 0.1 + (Math.random() - 0.5) * 50,
        life: 1,
        maxLife: 0.3 + Math.random() * 0.3,
        size: 2 + Math.random() * 3,
        alpha: 1,
      };
      particlesRef.current.push(particle);
    }
  }, []);

  // Draw a glowing line segment
  const drawGlowingLine = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      x1: number,
      y1: number,
      x2: number,
      y2: number,
      width: number,
      alpha: number
    ) => {
      // Outer glow
      ctx.strokeStyle = `rgba(183, 255, 60, ${alpha * 0.15})`;
      ctx.lineWidth = width * 3;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();

      // Middle glow
      ctx.strokeStyle = `rgba(183, 255, 60, ${alpha * 0.4})`;
      ctx.lineWidth = width * 1.8;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();

      // Core
      ctx.strokeStyle = `rgba(183, 255, 60, ${alpha * 0.9})`;
      ctx.lineWidth = width;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();

      // Bright core highlight
      ctx.strokeStyle = `rgba(255, 255, 255, ${alpha * 0.6})`;
      ctx.lineWidth = width * 0.4;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    },
    []
  );

  // Main animation loop
  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    ctx.clearRect(0, 0, rect.width, rect.height);

    const now = Date.now();
    const deltaTime = (now - lastTimeRef.current) / 1000;

    // Draw flowing trail using smooth curves
    if (trailPointsRef.current.length > 1) {
      const points = trailPointsRef.current;
      const totalPoints = points.length;

      for (let i = 1; i < totalPoints; i++) {
        const p1 = points[i - 1];
        const p2 = points[i];
        
        // Calculate age factor (newer = more visible)
        const age = (now - p2.timestamp) / 150;
        const alpha = Math.max(0, 1 - age);

        // Calculate width based on velocity and position in trail
        const speed = Math.sqrt(p2.vx * p2.vx + p2.vy * p2.vy);
        const speedFactor = Math.min(speed / 1000, 1);
        const positionFactor = i / totalPoints;
        const width = (2 + speedFactor * 4) * alpha * positionFactor;

        if (alpha > 0.01 && width > 0.1) {
          drawGlowingLine(ctx, p1.x, p1.y, p2.x, p2.y, width, alpha);
        }
      }
    }

    // Update and draw particles
    particlesRef.current = particlesRef.current.filter((particle) => {
      particle.life -= deltaTime;
      if (particle.life <= 0) return false;

      // Update position
      particle.x += particle.vx * deltaTime;
      particle.y += particle.vy * deltaTime;

      // Apply drag
      particle.vx *= 0.95;
      particle.vy *= 0.95;

      // Calculate alpha
      particle.alpha = particle.life / particle.maxLife;

      // Draw particle with glow
      const gradient = ctx.createRadialGradient(
        particle.x,
        particle.y,
        0,
        particle.x,
        particle.y,
        particle.size * 2
      );
      gradient.addColorStop(0, `rgba(183, 255, 60, ${particle.alpha * 0.8})`);
      gradient.addColorStop(0.5, `rgba(183, 255, 60, ${particle.alpha * 0.4})`);
      gradient.addColorStop(1, `rgba(183, 255, 60, 0)`);

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size * 2, 0, Math.PI * 2);
      ctx.fill();

      return true;
    });

    // Keep particles count reasonable
    if (particlesRef.current.length > 100) {
      particlesRef.current = particlesRef.current.slice(-80);
    }

    animationFrameRef.current = requestAnimationFrame(animate);
  }, [drawGlowingLine]);

  // Mouse move handler
  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      mouseRef.current.x = x;
      mouseRef.current.y = y;

      if (!isActiveRef.current) {
        mouseRef.current.prevX = x;
        mouseRef.current.prevY = y;
        isActiveRef.current = true;
      }

      addTrailPoint(x, y);
    },
    [addTrailPoint]
  );

  // Handle resize
  const handleResize = useCallback(() => {
    initCanvas();
  }, [initCanvas]);

  useEffect(() => {
    // Don't run on touch devices or if reduced motion is preferred
    if (isTouchDevice() || prefersReducedMotion()) {
      return;
    }

    initCanvas();

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("resize", handleResize);

    // Start animation
    lastTimeRef.current = Date.now();
    animate();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [
    animate,
    handleMouseMove,
    handleResize,
    initCanvas,
    isTouchDevice,
    prefersReducedMotion,
  ]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-50"
      style={{
        width: "100%",
        height: "100%",
      }}
    />
  );
}
