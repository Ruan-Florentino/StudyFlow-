import React from 'react';
import { motion, useReducedMotion } from 'motion/react';

export const FlorestaScene = () => {
  const reduceMotion = useReducedMotion() ?? false;

  return (
    <div className="absolute inset-0 overflow-hidden bg-[#064e3b]">
      <svg className="w-full h-full" viewBox="0 0 1000 1000" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="sunRay" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fef3c7" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#fef3c7" stopOpacity="0" />
          </linearGradient>
        </defs>

        {[...Array(8)].map((_, i) => (
          <path
            key={`tree-back-${i}`}
            d={`M ${i * 150} 1000 L ${i * 150 + 75} 300 L ${i * 150 + 150} 1000 Z`}
            fill="#065f46"
            fillOpacity="0.4"
          />
        ))}

        {[...Array(4)].map((_, i) => (
          <motion.rect
            key={`ray-${i}`}
            x={-200 + i * 300}
            y="-500"
            width="150"
            height="2000"
            fill="url(#sunRay)"
            transform="rotate(30)"
            animate={reduceMotion ? { opacity: 0.55 } : { opacity: [0.4, 0.7, 0.4] }}
            transition={
              reduceMotion ? { duration: 0 } : { duration: 4 + i, repeat: Infinity, ease: 'easeInOut' }
            }
          />
        ))}

        {[300, 700].map((x, i) => (
          <g key={`tree-front-${i}`}>
            <rect x={x} y="400" width="40" height="600" fill="#451a03" />
            {[500, 600, 700].map((y, j) => (
              <motion.circle
                key={`leaves-${i}-${j}`}
                cx={x + 20}
                cy={y - 150}
                r={60 + j * 20}
                fill="#065f46"
                animate={reduceMotion ? { skewX: 0 } : { skewX: [-2, 2, -2] }}
                transition={
                  reduceMotion ? { duration: 0 } : { duration: 3 + j, repeat: Infinity, ease: 'easeInOut' }
                }
              />
            ))}
          </g>
        ))}

        {[...Array(20)].map((_, i) => (
          <motion.circle
            key={`firefly-${i}`}
            cx={Math.random() * 1000}
            cy={Math.random() * 1000}
            r={1.5 + Math.random() * 1.5}
            fill="#fcd34d"
            animate={
              reduceMotion
                ? { x: 0, y: 0, opacity: 0.45 }
                : {
                    x: [0, (Math.random() - 0.5) * 100, 0],
                    y: [0, (Math.random() - 0.5) * 100, 0],
                    opacity: [0, 0.8, 0],
                  }
            }
            transition={
              reduceMotion
                ? { duration: 0 }
                : {
                    duration: 3 + Math.random() * 4,
                    repeat: Infinity,
                    delay: Math.random() * 5,
                  }
            }
          />
        ))}

        {[...Array(10)].map((_, i) => (
          <motion.path
            key={`leaf-${i}`}
            d="M 0 0 Q 5 10 0 20 Q -5 10 0 0"
            fill="#065f46"
            stroke="#064e3b"
            strokeWidth="1"
            animate={
              reduceMotion
                ? { y: 200, x: 0, rotate: 0, opacity: 0.5 }
                : {
                    y: [0, 1000],
                    x: [0, Math.sin(i) * 100],
                    rotate: [0, 360],
                  }
            }
            transition={
              reduceMotion
                ? { duration: 0 }
                : {
                    duration: 8 + Math.random() * 10,
                    repeat: Infinity,
                    ease: 'linear',
                    delay: Math.random() * 10,
                  }
            }
            style={{ x: Math.random() * 1000, y: -20 }}
          />
        ))}
      </svg>
    </div>
  );
};
