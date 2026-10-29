import React, { useEffect, useRef } from 'react';

interface HeroRingParticlesProps {
  className?: string;
}

/**
 * Interactive Ring Particles component inspired by CSS Houdini PaintWorklet
 * & Antigravity physics.
 * 
 * Features:
 * 1. Checks and registers CSS.paintWorklet ('css-houdini-ringparticles') where supported.
 * 2. Provides an interactive HTML5 Canvas fallback that follows mouse coordinates on hover
 *    and smoothly returns to center (50%, 50%) on pointerleave.
 * 3. Renders subtle floating glowing bubbles and floating anti-gravity dots throughout
 *    the hero background to create depth without distracting from text.
 * 4. Respects prefers-reduced-motion.
 */
export const HeroRingParticles: React.FC<HeroRingParticlesProps> = ({
  className = 'absolute inset-0 pointer-events-none',
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 1. CSS Houdini PaintWorklet Registration (Progressive Enhancement)
    if (typeof CSS !== 'undefined' && 'paintWorklet' in CSS && (CSS as any).paintWorklet?.addModule) {
      try {
        (CSS as any).paintWorklet.addModule(
          'https://unpkg.com/css-houdini-ringparticles/dist/ringparticles.js'
        ).catch(() => {
          // Non-fatal if offline or blocked by CDN policy
        });
      } catch {
        // Ignore
      }
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let animId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    // Ring target and current physics (normalized 0..100)
    const ring = {
      x: 50,
      y: 50,
      tx: 50,
      ty: 50,
      vx: 0,
      vy: 0,
      radius: 110,
      targetRadius: 110,
      thickness: 45,
      isInteractive: false,
    };

    // Particles on the interactive ring
    const RING_PARTICLE_COUNT = 85;
    interface RingParticle {
      angle: number;
      distOffset: number;
      speed: number;
      size: number;
      alpha: number;
      color: string;
      waveOffset: number;
    }

    const ringColors = [
      'rgba(132, 204, 22, ',  // MFT Lime
      'rgba(101, 163, 13, ',  // Deep Lime
      'rgba(16, 185, 129, ',  // Emerald
      'rgba(217, 249, 157, ', // Pale Lime
      'rgba(245, 158, 11, ',  // Warm Amber
    ];

    const ringParticles: RingParticle[] = [];
    for (let i = 0; i < RING_PARTICLE_COUNT; i++) {
      ringParticles.push({
        angle: (i / RING_PARTICLE_COUNT) * Math.PI * 2,
        distOffset: (Math.random() - 0.5) * ring.thickness,
        speed: (0.003 + Math.random() * 0.006) * (Math.random() > 0.5 ? 1 : -1),
        size: 1.2 + Math.random() * 2.4,
        alpha: 0.25 + Math.random() * 0.65,
        color: ringColors[Math.floor(Math.random() * ringColors.length)],
        waveOffset: Math.random() * Math.PI * 2,
      });
    }

    // Background floating buoyant bubbles & glowing dots
    const BUBBLE_COUNT = 45;
    interface Bubble {
      x: number;
      y: number;
      radius: number;
      speedY: number;
      speedX: number;
      wobbleSpeed: number;
      wobbleAngle: number;
      alpha: number;
      baseAlpha: number;
      color: string;
      hasRim: boolean;
    }

    const bubbles: Bubble[] = [];
    for (let i = 0; i < BUBBLE_COUNT; i++) {
      const radius = 1.5 + Math.random() * 4.5;
      const alpha = 0.15 + Math.random() * 0.45;
      bubbles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius,
        speedY: -(0.25 + Math.random() * 0.65), // gentle upward anti-gravity drift
        speedX: (Math.random() - 0.5) * 0.2,
        wobbleSpeed: 0.015 + Math.random() * 0.025,
        wobbleAngle: Math.random() * Math.PI * 2,
        alpha,
        baseAlpha: alpha,
        color: ringColors[Math.floor(Math.random() * ringColors.length)],
        hasRim: Math.random() > 0.4,
      });
    }

    // Pointer event listeners on the hero section container
    const heroElement = canvas.parentElement;

    const handlePointerMove = (e: PointerEvent) => {
      if (!heroElement) return;
      const rect = heroElement.getBoundingClientRect();
      const clientX = e.clientX - rect.left;
      const clientY = e.clientY - rect.top;

      const normX = (clientX / rect.width) * 100;
      const normY = (clientY / rect.height) * 100;

      ring.tx = Math.max(5, Math.min(95, normX));
      ring.ty = Math.max(5, Math.min(95, normY));
      ring.targetRadius = 140; // Expand ring on hover
      ring.isInteractive = true;

      // Update CSS properties for Houdini PaintWorklet
      heroElement.style.setProperty('--ring-x', `${normX}`);
      heroElement.style.setProperty('--ring-y', `${normY}`);
      heroElement.style.setProperty('--ring-interactive', '1');
    };

    const handlePointerLeave = () => {
      if (!heroElement) return;
      // Return smoothly to center (50%, 50%)
      ring.tx = 50;
      ring.ty = 50;
      ring.targetRadius = 110;
      ring.isInteractive = false;

      // Update CSS properties for Houdini PaintWorklet
      heroElement.style.setProperty('--ring-x', '50');
      heroElement.style.setProperty('--ring-y', '50');
      heroElement.style.setProperty('--ring-interactive', '0');
    };

    if (heroElement) {
      heroElement.addEventListener('pointermove', handlePointerMove);
      heroElement.addEventListener('pointerleave', handlePointerLeave);
    }

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };

    window.addEventListener('resize', handleResize);

    let time = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      time += 0.02;

      // 1. Render Background Floating Bubbles & Glowing Micro-dots
      for (let i = 0; i < bubbles.length; i++) {
        const b = bubbles[i];
        b.y += b.speedY;
        b.x += b.speedX + Math.sin(b.wobbleAngle) * 0.35;
        b.wobbleAngle += b.wobbleSpeed;

        // Breathing alpha
        b.alpha = b.baseAlpha * (0.75 + Math.sin(b.wobbleAngle) * 0.25);

        // Wrap around bottom
        if (b.y < -20) {
          b.y = height + 15;
          b.x = Math.random() * width;
        }
        if (b.x < -20) b.x = width + 15;
        if (b.x > width + 20) b.x = -15;

        // Draw soft bubble glow
        const glowRad = b.radius * 2.8;
        const grad = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, glowRad);
        grad.addColorStop(0, `${b.color}${b.alpha})`);
        grad.addColorStop(0.5, `${b.color}${b.alpha * 0.4})`);
        grad.addColorStop(1, `${b.color}0)`);

        ctx.beginPath();
        ctx.fillStyle = grad;
        ctx.arc(b.x, b.y, glowRad, 0, Math.PI * 2);
        ctx.fill();

        // Bubble delicate contour rim
        if (b.hasRim && b.radius > 2.5) {
          ctx.beginPath();
          ctx.strokeStyle = `${b.color}${b.alpha * 0.6})`;
          ctx.lineWidth = 0.8;
          ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
          ctx.stroke();

          // Small specular highlight
          ctx.beginPath();
          ctx.fillStyle = `rgba(255, 255, 255, ${b.alpha * 0.8})`;
          ctx.arc(b.x - b.radius * 0.35, b.y - b.radius * 0.35, b.radius * 0.25, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Solid luminous core
          ctx.beginPath();
          ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(1, b.alpha * 1.3)})`;
          ctx.arc(b.x, b.y, b.radius * 0.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // 2. Physics Lerp for Interactive Ring Center (follows mouse & glides back to center)
      const lerpSpeed = ring.isInteractive ? 0.08 : 0.04;
      ring.x += (ring.tx - ring.x) * lerpSpeed;
      ring.y += (ring.ty - ring.y) * lerpSpeed;
      ring.radius += (ring.targetRadius - ring.radius) * 0.06;

      const ringCenterX = (ring.x / 100) * width;
      const ringCenterY = (ring.y / 100) * height;

      // Draw faint harmonic guide orbit ring behind particles
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(132, 204, 22, 0.08)';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 8]);
      ctx.arc(ringCenterX, ringCenterY, ring.radius, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw faint secondary expanding ripple ring
      const rippleRadius = ring.radius * (1 + (Math.sin(time * 1.5) + 1) * 0.12);
      ctx.beginPath();
      ctx.strokeStyle = `rgba(132, 204, 22, ${0.05 + Math.sin(time * 1.5) * 0.03})`;
      ctx.lineWidth = 1.2;
      ctx.arc(ringCenterX, ringCenterY, rippleRadius, 0, Math.PI * 2);
      ctx.stroke();

      // 3. Render Ring Particles
      for (let i = 0; i < ringParticles.length; i++) {
        const p = ringParticles[i];
        p.angle += p.speed;

        // Wave modulation around radius
        const wave = Math.sin(p.angle * 4 + time * 2 + p.waveOffset) * 9;
        const currentRadius = ring.radius + p.distOffset + wave;

        const px = ringCenterX + Math.cos(p.angle) * currentRadius;
        const py = ringCenterY + Math.sin(p.angle) * currentRadius;

        // Draw particle glow
        const pGrad = ctx.createRadialGradient(px, py, 0, px, py, p.size * 2.8);
        pGrad.addColorStop(0, `${p.color}${p.alpha})`);
        pGrad.addColorStop(0.6, `${p.color}${p.alpha * 0.4})`);
        pGrad.addColorStop(1, `${p.color}0)`);

        ctx.beginPath();
        ctx.fillStyle = pGrad;
        ctx.arc(px, py, p.size * 2.8, 0, Math.PI * 2);
        ctx.fill();

        // Bright particle core
        ctx.beginPath();
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(1, p.alpha * 1.4)})`;
        ctx.arc(px, py, p.size * 0.6, 0, Math.PI * 2);
        ctx.fill();

        // Connect immediate neighboring particles with glowing energetic strands
        if (i > 0 && i % 2 === 0) {
          const prev = ringParticles[i - 1];
          const prevWave = Math.sin(prev.angle * 4 + time * 2 + prev.waveOffset) * 9;
          const prevRad = ring.radius + prev.distOffset + prevWave;
          const prevX = ringCenterX + Math.cos(prev.angle) * prevRad;
          const prevY = ringCenterY + Math.sin(prev.angle) * prevRad;

          const dx = px - prevX;
          const dy = py - prevY;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 45) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(132, 204, 22, ${(1 - dist / 45) * 0.2})`;
            ctx.lineWidth = 0.8;
            ctx.moveTo(prevX, prevY);
            ctx.lineTo(px, py);
            ctx.stroke();
          }
        }
      }

      if (!reducedMotion) {
        animId = requestAnimationFrame(render);
      }
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      if (heroElement) {
        heroElement.removeEventListener('pointermove', handlePointerMove);
        heroElement.removeEventListener('pointerleave', handlePointerLeave);
      }
    };
  }, []);

  return (
    <div ref={containerRef} className={className} aria-hidden="true">
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
};
