'use client';

import { useEffect, useRef } from 'react';

export default function Stars({ center }: { center?: { x: number, y: number } }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let stars: { x: number; y: number; vx: number; vy: number; size: number; alpha: number }[] = [];
    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    let centerX = center && center.x ? center.x : width / 2;
    let centerY = center && center.y ? center.y : height / 2;

    function resetStar(star: { x: number; y: number; vx: number; vy: number; size: number; alpha: number }) {
      const angle = Math.random() * 2 * Math.PI;
      const radius = Math.random() * 1000;
      star.x = Math.cos(angle) * radius;
      star.y = Math.sin(angle) * radius;
      const speed = 1.2;
      star.vx = Math.cos(angle) * speed;
      star.vy = Math.sin(angle) * speed;
      star.size = Math.random() * 1.5 + 0.5;
      star.alpha = 1;
    }

    for (let i = 0; i < 500; i++) {
      let star = { x: 0, y: 0, vx: 0, vy: 0, size: 1, alpha: 1 };
      resetStar(star);
      stars.push(star);
    }

    function draw() {
      if (!ctx) return;
      
      ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
      ctx.fillRect(0, 0, width, height);

      ctx.save();
      centerX = center && center.x ? center.x : width / 2;
      centerY = center && center.y ? center.y : height / 2;
      ctx.translate(centerX, centerY);
      stars.forEach(star => {
        star.x += star.vx * 4;
        star.y += star.vy * 4;
        star.size += 0.01;
        star.alpha -= 0.003;

        ctx.beginPath();
        ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`;
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();

        if (star.alpha <= 0 || Math.abs(star.x) > width || Math.abs(star.y) > height) {
          resetStar(star);
        }
      });
      ctx.restore();

      requestAnimationFrame(draw);
    }

    draw();

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [center]);

  return (
    <canvas
      ref={canvasRef}
      id="warp"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 0,
        pointerEvents: 'none'
      }}
    />
  );
} 