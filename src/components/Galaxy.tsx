import React, { useEffect, useRef } from 'react';

export interface GalaxyProps {
  density?: number;
  glowIntensity?: number;
  starSpeed?: number;
  mouseRepulsion?: boolean;
  twinkleIntensity?: number;
  lightMode?: boolean;
  className?: string;
  paused?: boolean;
}

interface Star {
  x: number;
  y: number;
  z: number;
  size: number;
  baseAlpha: number;
  alpha: number;
  twinklePhase: number;
  twinkleSpeed: number;
  vx: number;
  vy: number;
  originX: number;
  originY: number;
  hue: number;
}

export const Galaxy: React.FC<GalaxyProps> = ({
  density = 1,
  glowIntensity = 0.3,
  starSpeed = 0.5,
  mouseRepulsion = true,
  twinkleIntensity = 0.3,
  lightMode = false,
  className = '',
  paused = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const starsRef = useRef<Star[]>([]);
  const mouseRef = useRef<{ x: number; y: number; active: boolean }>({ x: -1000, y: -1000, active: false });
  const animFrameIdRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = canvas.parentElement?.clientWidth || 600);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 600);

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width: w, height: h } = entry.contentRect;
        if (w && h && (canvas.width !== w || canvas.height !== h)) {
          width = canvas.width = Math.floor(w);
          height = canvas.height = Math.floor(h);
          initStars();
        }
      }
    });

    if (canvas.parentElement) {
      resizeObserver.observe(canvas.parentElement);
    }

    // Initialize stars array
    const initStars = () => {
      const baseCount = Math.floor((width * height) / 3200);
      const count = Math.max(60, Math.floor(baseCount * density));
      const stars: Star[] = [];

      for (let i = 0; i < count; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        const z = Math.random() * 0.8 + 0.2; // depth factor (0.2 to 1.0)
        // Subtle monochrome with occasional faint lime or cyan tint
        const rand = Math.random();
        const hue = rand > 0.85 ? 84 : rand > 0.7 ? 190 : 0; // 84 = lime, 190 = cyan, 0 = monochrome

        stars.push({
          x,
          y,
          z,
          size: (Math.random() * 1.6 + 0.5) * z,
          baseAlpha: Math.random() * 0.5 + 0.25,
          alpha: Math.random() * 0.5 + 0.25,
          twinklePhase: Math.random() * Math.PI * 2,
          twinkleSpeed: Math.random() * 0.03 + 0.01,
          vx: 0,
          vy: 0,
          originX: x,
          originY: y,
          hue,
        });
      }
      starsRef.current = stars;
    };

    initStars();

    // Mouse handlers
    const handleMouseMove = (e: MouseEvent) => {
      if (!mouseRepulsion) return;
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        active: true,
      };
    };

    const handleMouseLeave = () => {
      mouseRef.current = { x: -1000, y: -1000, active: false };
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!mouseRepulsion || e.touches.length === 0) return;
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
        active: true,
      };
    };

    const handleTouchEnd = () => {
      mouseRef.current = { x: -1000, y: -1000, active: false };
    };

    const parent = canvas.parentElement;
    if (parent) {
      parent.addEventListener('mousemove', handleMouseMove);
      parent.addEventListener('mouseleave', handleMouseLeave);
      parent.addEventListener('touchmove', handleTouchMove, { passive: true });
      parent.addEventListener('touchend', handleTouchEnd);
    }

    // Animation loop
    let lastTime = performance.now();

    const render = (time: number) => {
      const dt = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      if (!paused) {
        // Clear background
        if (lightMode) {
          ctx.fillStyle = '#F4EFE6';
          ctx.fillRect(0, 0, width, height);
        } else {
          // Deep cosmic black / charcoal gradient with atmospheric depth
          const bgGrad = ctx.createRadialGradient(
            width * 0.5,
            height * 0.45,
            width * 0.1,
            width * 0.5,
            height * 0.5,
            Math.max(width, height) * 0.8
          );
          bgGrad.addColorStop(0, '#10141A');
          bgGrad.addColorStop(0.5, '#0B0D11');
          bgGrad.addColorStop(1, '#050608');
          ctx.fillStyle = bgGrad;
          ctx.fillRect(0, 0, width, height);

          // Atmospheric nebula glow (lime and subtle cyan deep accents)
          if (glowIntensity > 0) {
            // Subtle MFT lime nebula glow near bottom-left/center
            const limeGlow = ctx.createRadialGradient(
              width * 0.45,
              height * 0.65,
              10,
              width * 0.45,
              height * 0.65,
              width * 0.5
            );
            limeGlow.addColorStop(0, `rgba(132, 204, 22, ${0.08 * glowIntensity})`);
            limeGlow.addColorStop(0.6, `rgba(132, 204, 22, ${0.02 * glowIntensity})`);
            limeGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
            ctx.fillStyle = limeGlow;
            ctx.fillRect(0, 0, width, height);

            // Subtle cyan nebula glow near top-right
            const cyanGlow = ctx.createRadialGradient(
              width * 0.7,
              height * 0.25,
              10,
              width * 0.7,
              height * 0.25,
              width * 0.45
            );
            cyanGlow.addColorStop(0, `rgba(34, 211, 238, ${0.06 * glowIntensity})`);
            cyanGlow.addColorStop(0.5, `rgba(34, 211, 238, ${0.015 * glowIntensity})`);
            cyanGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
            ctx.fillStyle = cyanGlow;
            ctx.fillRect(0, 0, width, height);
          }
        }

        const stars = starsRef.current;
        const mouse = mouseRef.current;
        const repulsionRadius = 90;
        const repulsionForce = 35;

        for (let i = 0; i < stars.length; i++) {
          const s = stars[i];

          // Star drift movement
          s.originY -= starSpeed * s.z * 18 * dt;
          if (s.originY < -10) {
            s.originY = height + 10;
            s.originX = Math.random() * width;
          }

          // Twinkle effect
          s.twinklePhase += s.twinkleSpeed;
          const twinkle = Math.sin(s.twinklePhase) * twinkleIntensity;
          s.alpha = Math.max(0.08, Math.min(1, s.baseAlpha + twinkle));

          // Mouse repulsion physics
          if (mouseRepulsion && mouse.active) {
            const dx = s.x - mouse.x;
            const dy = s.y - mouse.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < repulsionRadius && dist > 0) {
              const factor = (1 - dist / repulsionRadius) * repulsionForce;
              s.vx += (dx / dist) * factor * dt * 10;
              s.vy += (dy / dist) * factor * dt * 10;
            }
          }

          // Ease velocity towards zero and position towards origin
          s.vx *= 0.92;
          s.vy *= 0.92;
          s.x += s.vx;
          s.y += s.vy;
          s.x += (s.originX - s.x) * 0.05;
          s.y += (s.originY - s.y) * 0.05;

          // Draw star
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);

          if (s.hue === 84) {
            // Faint lime star
            ctx.fillStyle = `rgba(163, 230, 53, ${s.alpha * 0.9})`;
          } else if (s.hue === 190) {
            // Faint cyan star
            ctx.fillStyle = `rgba(103, 232, 249, ${s.alpha * 0.85})`;
          } else {
            // Crisp white/monochrome star
            ctx.fillStyle = lightMode
              ? `rgba(30, 41, 59, ${s.alpha * 0.4})`
              : `rgba(240, 244, 250, ${s.alpha})`;
          }
          ctx.fill();

          // Subtle glow on brighter foreground stars
          if (!lightMode && s.z > 0.7 && s.alpha > 0.45 && glowIntensity > 0) {
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.size * 2.2, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${s.alpha * 0.15 * glowIntensity})`;
            ctx.fill();
          }
        }
      }

      animFrameIdRef.current = requestAnimationFrame(render);
    };

    animFrameIdRef.current = requestAnimationFrame(render);

    return () => {
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
      resizeObserver.disconnect();
      if (parent) {
        parent.removeEventListener('mousemove', handleMouseMove);
        parent.removeEventListener('mouseleave', handleMouseLeave);
        parent.removeEventListener('touchmove', handleTouchMove);
        parent.removeEventListener('touchend', handleTouchEnd);
      }
    };
  }, [density, glowIntensity, starSpeed, mouseRepulsion, twinkleIntensity, lightMode, paused]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 pointer-events-none w-full h-full ${className}`}
      aria-hidden="true"
    />
  );
};
