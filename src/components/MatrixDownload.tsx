import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Download, ChevronLeft, Cpu, CheckCircle2 } from 'lucide-react';
import { GlassCard, AnimatedButton, cn } from './UI';
import { useStore } from '../store/useStore';

const SUBJECTS = [
  'Física Quântica', 'Direito Constitucional', 'Neurociência Aplicada', 
  'Engenharia Aeroespacial', 'Filosofia Antiga', 'Inteligência Artificial',
  'Mandarim Fluente', 'Kung Fu (Estilo Garça)', 'Matemática Avançada'
];

export const MatrixDownload = ({ onBack }: { onBack: () => void }) => {
  const [selectedSubject, setSelectedSubject] = useState(SUBJECTS[0]);
  const [isDownloading, setIsDownloading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { addXP } = useStore();

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*';
    const fontSize = 14;
    const columns = canvas.width / fontSize;
    const drops: number[] = [];
    for (let x = 0; x < columns; x++) drops[x] = 1;

    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.fillStyle = '#0F0';
      ctx.font = fontSize + 'px monospace';

      for (let i = 0; i < drops.length; i++) {
        const text = letters.charAt(Math.floor(Math.random() * letters.length));
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975)
          drops[i] = 0;
        drops[i]++;
      }
    };

    const interval = setInterval(draw, 33);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isDownloading && progress < 100) {
      const timer = setInterval(() => {
        setProgress(p => {
          if (p >= 100) {
            clearInterval(timer);
            setIsDownloading(false);
            setIsComplete(true);
            addXP(10000); // 10k XP
            return 100;
          }
          return p + Math.random() * 2;
        });
      }, 50);
      return () => clearInterval(timer);
    }
  }, [isDownloading, progress, addXP]);

  const startDownload = () => {
    setIsDownloading(true);
    setProgress(0);
    setIsComplete(false);
  };

  return (
    <div className="p-6 space-y-8 pb-32 min-h-screen bg-black relative overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 z-0 opacity-40" />
      
      <header className="flex items-center gap-4 relative z-10">
        <AnimatedButton onClick={onBack} variant="secondary" className="p-2 rounded-full border-green-500/30 text-green-400 hover:bg-green-500/10">
          <ChevronLeft size={20} />
        </AnimatedButton>
        <h2 className="text-3xl font-premium-title italic text-green-500 drop-shadow-[0_0_15px_rgba(34,197,94,0.8)]">
          Download Direto<span className="text-white font-normal not-italic ml-1">.</span>
        </h2>
      </header>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-[60vh] space-y-8">
        {!isDownloading && !isComplete && (
          <GlassCard className="p-8 border-green-500/30 bg-black/80 backdrop-blur-md w-full max-w-md space-y-6">
            <div className="text-center space-y-2">
              <Cpu size={48} className="mx-auto text-green-500 mb-4" />
              <h3 className="text-xl font-bold text-white font-mono uppercase tracking-widest">Selecione o Pacote</h3>
              <p className="text-sm text-green-400/70 font-mono">Conecte-se à interface neural para transferência direta.</p>
            </div>
            
            <select 
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full bg-green-950/30 border border-green-500/50 rounded-xl p-4 text-green-400 font-mono focus:outline-none focus:border-green-400"
            >
              {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>

            <AnimatedButton onClick={startDownload} className="w-full py-4 bg-green-600 hover:bg-green-500 text-black font-bold font-mono tracking-widest uppercase shadow-[0_0_20px_rgba(34,197,94,0.4)]">
              <Download size={20} className="mr-2" /> Iniciar Transferência
            </AnimatedButton>
          </GlassCard>
        )}

        {isDownloading && (
          <div className="w-full max-w-2xl space-y-4">
            <div className="flex justify-between text-green-400 font-mono text-sm uppercase tracking-widest">
              <span>Baixando: {selectedSubject}</span>
              <span>{Math.floor(progress)}%</span>
            </div>
            <div className="h-4 w-full bg-green-950/50 rounded-full overflow-hidden border border-green-500/30">
              <motion.div 
                className="h-full bg-green-500 shadow-[0_0_20px_rgba(34,197,94,0.8)]"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-center text-xs text-green-500/50 font-mono animate-pulse">
              Sobrescrevendo vias neurais... Por favor, não desconecte.
            </p>
          </div>
        )}

        {isComplete && (
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
            <GlassCard className="p-8 border-green-500/50 bg-green-900/20 backdrop-blur-md w-full max-w-md text-center space-y-6">
              <CheckCircle2 size={64} className="mx-auto text-green-400 drop-shadow-[0_0_20px_rgba(34,197,94,0.8)]" />
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-white font-mono uppercase tracking-widest">Download Concluído</h3>
                <p className="text-green-400 font-mono">Eu sei {selectedSubject}.</p>
              </div>
              <AnimatedButton onClick={() => setIsComplete(false)} variant="secondary" className="w-full py-4 border-green-500/50 text-green-400 font-mono uppercase tracking-widest">
                Novo Download
              </AnimatedButton>
            </GlassCard>
          </motion.div>
        )}
      </div>
    </div>
  );
};
