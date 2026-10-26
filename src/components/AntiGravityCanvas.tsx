import React, { useEffect, useRef } from 'react';

interface AntiGravityCanvasProps {
  className?: string;
  variant?: 'light' | 'dark' | 'lime';
  particleCount?: number;
}

export const AntiGravityCanvas: React.FC<AntiGravityCanvasProps> = ({
  className = 'absolute inset-0 pointer-events-none',
  variant = 'lime',
  particleCount = 55,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Check reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    // Particle definition
    interface Particle {
      x: number;
      y: number;
      radius: number;
      baseRadius: number;
      speedY: number;
      speedX: number;
      alpha: number;
      baseAlpha: number;
      pulseSpeed: number;
      angle: number;
      hue: number;
    }

    const particles: Particle[] = [];

    const getColors = () => {
      if (variant === 'dark') {
        return { r: 35, g: 37, b: 42, lineR: 35, lineG: 37, lineB: 42 };
      }
      if (variant === 'light') {
        return { r: 163, g: 230, b: 53, lineR: 132, lineG: 204, lineB: 22 };
      }
      // default lime
      return { r: 132, g: 204, b: 22, lineR: 163, lineG: 230, lineB: 53 };
    };

    const colors = getColors();

    for (let i = 0; i < particleCount; i++) {
      const radius = 1.2 + Math.random() * 2.8;
      const alpha = 0.2 + Math.random() * 0.65;
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius,
        baseRadius: radius,
        speedY: -(0.35 + Math.random() * 0.95), // Upward anti-gravity drift
        speedX: (Math.random() - 0.5) * 0.35,
        alpha,
        baseAlpha: alpha,
        pulseSpeed: 0.02 + Math.random() * 0.03,
        angle: Math.random() * Math.PI * 2,
        hue: Math.random() > 0.4 ? 84 : 100, // shades of electric lime/emerald
      });
    }

    // Mouse tracking for subtle interactive breeze
    let mouse = { x: -9999, y: -9999, active: false };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active = true;
    };

    const handleMouseLeave = () => {
      mouse.active = false;
    };

    const parent = canvas.parentElement;
    if (parent) {
      parent.addEventListener('mousemove', handleMouseMove);
      parent.addEventListener('mouseleave', handleMouseLeave);
    }

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };

    window.addEventListener('resize', handleResize);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw subtle connecting constellation strands between close droplets
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 85) {
            const lineAlpha = (1 - dist / 85) * 0.18 * Math.min(particles[i].alpha, particles[j].alpha);
            ctx.beginPath();
            ctx.strokeStyle = `rgba(${colors.lineR}, ${colors.lineG}, ${colors.lineB}, ${lineAlpha})`;
            ctx.lineWidth = 0.8;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Update and draw anti-gravity droplets
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Anti-gravity upward flow
        p.y += p.speedY;
        p.x += p.speedX + Math.sin(p.angle) * 0.35;
        p.angle += p.pulseSpeed;

        // Mouse gentle repulsion / buoyancy
        if (mouse.active) {
          const mdx = p.x - mouse.x;
          const mdy = p.y - mouse.y;
          const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
          if (mdist < 120) {
            const force = (1 - mdist / 120) * 1.8;
            p.x += (mdx / mdist) * force;
            p.y -= force * 0.6; // extra lift
          }
        }

        // Breathing pulse effect
        p.alpha = p.baseAlpha * (0.7 + Math.sin(p.angle) * 0.3);

        // Wrap around bottom when reached top
        if (p.y < -15) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < -15) p.x = width + 10;
        if (p.x > width + 15) p.x = -10;

        // Draw glowing droplet
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius * 2.5);
        gradient.addColorStop(0, `rgba(${colors.r}, ${colors.g}, ${colors.b}, ${p.alpha})`);
        gradient.addColorStop(0.45, `rgba(${colors.r}, ${colors.g}, ${colors.b}, ${p.alpha * 0.55})`);
        gradient.addColorStop(1, `rgba(${colors.r}, ${colors.g}, ${colors.b}, 0)`);

        ctx.beginPath();
        ctx.fillStyle = gradient;
        ctx.arc(p.x, p.y, p.radius * 2.5, 0, Math.PI * 2);
        ctx.fill();

        // Droplet bright center point
        ctx.beginPath();
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(1, p.alpha * 1.2)})`;
        ctx.arc(p.x, p.y, p.radius * 0.5, 0, Math.PI * 2);
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      if (parent) {
        parent.removeEventListener('mousemove', handleMouseMove);
        parent.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, [particleCount, variant]);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
};
