import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

export const Confetti = ({ trigger, duration = 3000 }: { trigger: number, duration?: number }) => {
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (trigger > 0) {
      setIsActive(true);
      
      const fire = () => {
        // A simple lightweight particle system instead of heavy canvas libraries
        const container = document.getElementById('confetti-container');
        if (!container) return;
        
        container.innerHTML = '';
        
        const colors = ['#00E88F', '#F59E0B', '#8B5CF6', '#F43F5E', '#06B6D4'];
        
        for (let i = 0; i < 70; i++) {
          const p = document.createElement('div');
          p.style.position = 'absolute';
          p.style.width = `${Math.random() * 8 + 4}px`;
          p.style.height = `${Math.random() * 8 + 4}px`;
          p.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
          p.style.left = '50%';
          p.style.top = '100%';
          p.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
          p.style.pointerEvents = 'none';
          
          container.appendChild(p);
          
          const angle = Math.random() * Math.PI * 2;
          const velocity = 10 + Math.random() * 20;
          const tx = Math.cos(angle) * velocity * 20;
          const ty = Math.sin(angle) * velocity * 20 - 400;
          
          p.animate([
            { transform: 'translate(0, 0) rotate(0deg)', opacity: 1 },
            { transform: `translate(${tx}px, ${ty}px) rotate(${Math.random() * 720}deg)`, opacity: 0 }
          ], {
            duration: 1000 + Math.random() * 1500,
            easing: 'cubic-bezier(0.25, 1, 0.5, 1)',
            fill: 'forwards'
          });
        }
      };

      fire();
      
      const timer = setTimeout(() => {
        setIsActive(false);
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [trigger, duration]);

  if (!isActive || typeof document === 'undefined') return null;

  return createPortal(
    <div id="confetti-container" className="absolute inset-0 z-[999] pointer-events-none overflow-hidden" />,
    document.getElementById('root-wrapper') || document.body
  );
};
