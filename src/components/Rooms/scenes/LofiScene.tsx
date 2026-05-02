import React from 'react';
import { motion } from 'motion/react';

export const LofiScene = () => {
  return (
    <div className="absolute inset-0 overflow-hidden bg-[#0f172a]">
      <svg className="w-full h-full" viewBox="0 0 1000 1000" preserveAspectRatio="xMidYMid slice">
        <defs>
          <radialGradient id="lampGlowLofi" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fef3c7" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#fef3c7" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Janela */}
        <rect x="100" y="100" width="800" height="600" fill="#020617" stroke="#1e293b" strokeWidth="20" />
        
        {/* Luzes da Cidade */}
        {[...Array(30)].map((_, i) => (
          <circle
            key={i}
            cx={150 + Math.random() * 700}
            cy={150 + Math.random() * 500}
            r={2 + Math.random() * 4}
            fill={i % 2 === 0 ? '#fde68a' : '#3b82f6'}
            fillOpacity="0.3"
          />
        ))}

        {/* Chuva na Janela */}
        {[...Array(60)].map((_, i) => (
          <motion.line
            key={i}
            x1={100 + Math.random() * 800}
            y1={100}
            x2={0}
            y2={20}
            stroke="#94a3b8"
            strokeOpacity="0.2"
            strokeWidth="1"
            animate={{
              y1: [100, 700],
              y2: [120, 720]
            }}
            transition={{
              duration: 0.4 + Math.random() * 0.3,
              repeat: Infinity,
              ease: "linear",
              delay: Math.random() * 1
            }}
          />
        ))}

        {/* Gotas Escorrendo */}
        {[...Array(10)].map((_, i) => (
          <motion.path
            key={`drop-${i}`}
            d={`M ${150 + Math.random() * 700} ${150 + Math.random() * 100} Q ${150} ${150} ${150} ${170}`}
            stroke="#94a3b8"
            strokeOpacity="0.3"
            strokeWidth="2"
            fill="none"
            animate={{
              y: [0, 400],
              opacity: [0, 0.3, 0]
            }}
            transition={{
              duration: 4 + Math.random() * 4,
              repeat: Infinity,
              ease: "linear",
              delay: Math.random() * 5
            }}
          />
        ))}

        {/* Mesa (Silhueta) */}
        <rect x="0" y="700" width="1000" height="300" fill="#020617" />
        
        {/* Luminária de Mesa */}
        <g transform="translate(150, 600)">
          <path d="M 0 100 Q 0 0 50 0 L 100 0 Q 150 0 150 100" fill="none" stroke="#1e293b" strokeWidth="8" />
          <circle cx="150" cy="100" r="80" fill="url(#lampGlowLofi)">
             <animate attributeName="opacity" values="0.2;0.4;0.2" dur="5s" repeatCount="indefinite" />
          </circle>
          <rect x="130" y="80" width="40" height="40" fill="#1e293b" rx="5" />
        </g>

        {/* Planta (Silhueta) */}
        <path d="M 850 700 Q 800 600 850 500 Q 900 600 850 700" fill="#020617" stroke="#1e293b" strokeWidth="2" />
        <path d="M 850 700 Q 900 650 950 600 Q 900 750 850 700" fill="#020617" stroke="#1e293b" strokeWidth="2" />
      </svg>
    </div>
  );
};
