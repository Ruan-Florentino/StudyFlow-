import React, { useEffect, useRef, useState } from 'react';

export const Entropy = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDead, setIsDead] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let opacity = 1;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    const draw = () => {
      if (opacity <= 0.01) {
        setIsDead(true);
        return;
      }

      const imageData = ctx.createImageData(canvas.width, canvas.height);
      const data = imageData.data;
      
      for (let i = 0; i < data.length; i += 4) {
        const noise = Math.random() * 255;
        data[i] = noise;     // red
        data[i + 1] = noise; // green
        data[i + 2] = noise; // blue
        data[i + 3] = 255 * opacity; // alpha
      }
      
      ctx.putImageData(imageData, 0, 0);
      opacity -= 0.002; // Slowly fade out
      
      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  if (isDead) {
    return <div className="fixed inset-0 z-[100008] bg-black cursor-none" />;
  }

  return (
    <div className="fixed inset-0 z-[100008] bg-black cursor-none overflow-hidden">
      <canvas ref={canvasRef} className="w-full h-full block" />
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none mix-blend-difference">
        <h1 className="text-white text-4xl md:text-6xl font-serif tracking-widest uppercase opacity-50">
          Entropia Máxima
        </h1>
      </div>
    </div>
  );
};
