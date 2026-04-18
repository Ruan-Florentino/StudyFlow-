import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft } from 'lucide-react';

export const TheMirror = ({ onBack }: { onBack: () => void }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  useEffect(() => {
    let stream: MediaStream | null = null;
    
    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setHasPermission(true);
      } catch (err) {
        setHasPermission(false);
      }
    };

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[99999] bg-black text-white flex flex-col items-center justify-center overflow-hidden">
      <button onClick={onBack} className="absolute top-8 left-8 text-white/30 hover:text-white z-50 transition-colors">
        <ChevronLeft size={24} />
      </button>

      {hasPermission === true && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 4 }}
          className="absolute inset-0"
        >
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            muted 
            className="w-full h-full object-cover opacity-30 grayscale mix-blend-screen"
            style={{ transform: 'scaleX(-1)' }}
          />
        </motion.div>
      )}

      <div className="relative z-10 text-center space-y-8 p-8">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2, duration: 2 }}
          className="font-serif italic text-5xl md:text-7xl"
        >
          O Espelho
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 4, duration: 2 }}
          className="text-sm md:text-base tracking-[0.3em] uppercase opacity-60 max-w-xl mx-auto leading-relaxed"
        >
          {hasPermission === false 
            ? "A reflexão foi negada. Mas você sabe quem está aí."
            : "Procuramos o conhecimento nas estrelas, nos livros e no código. Mas o universo que você tanto tenta entender está olhando de volta para você."}
        </motion.p>
      </div>
    </div>
  );
};
