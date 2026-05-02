import React from 'react';
import { motion } from 'motion/react';

export const LareiraScene = () => {
  return (
    <div className="absolute inset-0 overflow-hidden bg-[#1c1917]">
      <svg className="w-full h-full" viewBox="0 0 1000 1000" preserveAspectRatio="xMidYMid slice">
        <defs>
          <radialGradient id="fireGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ea580c" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#ea580c" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Lareira de Pedra */}
        <rect x="300" y="500" width="400" height="400" fill="#292524" />
        <rect x="350" y="550" width="300" height="350" fill="#000" />
        
        {/* Glow do Fogo */}
        <motion.circle 
          cx="500" cy="750" r="200" fill="url(#fireGlow)"
          animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.1, 1] }}
          transition={{ duration: 3, repeat: Infinity }}
        />

        {/* Lenha */}
        <rect x="420" y="820" width="160" height="30" fill="#451a03" rx="5" transform="rotate(-10, 500, 835)" />
        <rect x="420" y="820" width="160" height="30" fill="#451a03" rx="5" transform="rotate(10, 500, 835)" />

        {/* Chamas */}
        {[...Array(5)].map((_, i) => (
          <motion.path
            key={i}
            d="M 450 820 Q 500 700 550 820 Z"
            fill={['#facc15', '#f97316', '#ef4444'][i % 3]}
            fillOpacity="0.8"
            animate={{
              d: [
                `M ${450+i*10} 820 Q ${500} ${700-i*20} ${550-i*10} 820 Z`,
                `M ${460+i*10} 820 Q ${520} ${720-i*20} ${540-i*10} 820 Z`,
                `M ${450+i*10} 820 Q ${500} ${700-i*20} ${550-i*10} 820 Z`,
              ],
              scaleY: [1, 1.2, 1],
              skewX: [-5, 5, -5]
            }}
            transition={{
              duration: 0.5 + Math.random() * 0.5,
              repeat: Infinity,
              delay: i * 0.1
            }}
            style={{ transformOrigin: 'bottom' }}
          />
        ))}

        {/* Faíscas */}
        {[...Array(12)].map((_, i) => (
          <motion.circle
            key={i}
            cx={450 + Math.random() * 100}
            cy={800}
            r={1 + Math.random() * 2}
            fill="#fbbf24"
            animate={{
              y: [0, -200],
              x: [0, (Math.random() - 0.5) * 50],
              opacity: [1, 0]
            }}
            transition={{
              duration: 1 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 3
            }}
          />
        ))}

        {/* Janela com Neve */}
        <rect x="50" y="100" width="200" height="300" fill="#0c0a09" stroke="#451a03" strokeWidth="10" />
        {[...Array(20)].map((_, i) => (
          <motion.circle
            key={`snow-${i}`}
            cx={60 + Math.random() * 180}
            cy={110 + Math.random() * 280}
            r="2"
            fill="white"
            fillOpacity="0.6"
            animate={{
              y: [0, 20],
              x: [0, 5],
              opacity: [0.6, 0]
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2
            }}
          />
        ))}
      </svg>
    </div>
  );
};
