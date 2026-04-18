import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { Activity, ChevronLeft, Zap, Brain, Cpu } from 'lucide-react';
import { GlassCard, AnimatedButton, cn } from './UI';
import { useStore } from '../store/useStore';

export const NeuralSync = ({ onBack }: { onBack: () => void }) => {
  const { xp, level, mastery } = useStore();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [syncLevel, setSyncLevel] = useState(0);

  useEffect(() => {
    const totalMastery = Object.values(mastery).reduce((a, b) => a + b, 0) / (Object.keys(mastery).length || 1);
    setSyncLevel(Math.min(100, (xp / 1000) + totalMastery + (level * 5)));
  }, [xp, level, mastery]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];
    const particleCount = 50 + Math.floor(syncLevel / 2);

    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;

      constructor() {
        this.x = Math.random() * canvas!.width;
        this.y = Math.random() * canvas!.height;
        this.vx = (Math.random() - 0.5) * (1 + syncLevel / 20);
        this.vy = (Math.random() - 0.5) * (1 + syncLevel / 20);
        this.size = Math.random() * 2 + 1;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > canvas!.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas!.height) this.vy *= -1;
      }

      draw() {
        ctx!.beginPath();
        ctx!.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(0, 255, 148, ${0.3 + (syncLevel / 200)})`;
        ctx!.fill();
      }
    }

    const init = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach((p, i) => {
        p.update();
        p.draw();

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 100 + (syncLevel)) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(0, 255, 148, ${(1 - dist / (100 + syncLevel)) * 0.2})`;
            ctx.stroke();
          }
        }
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    init();
    animate();

    const handleResize = () => {
      init();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [syncLevel]);

  return (
    <div className="p-6 space-y-8 pb-32 min-h-screen bg-black relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent opacity-50" />
      
      <header className="flex items-center gap-4 relative z-10">
        <AnimatedButton onClick={onBack} variant="secondary" className="p-2 rounded-full border-primary/30 text-primary hover:bg-primary/10">
          <ChevronLeft size={20} />
        </AnimatedButton>
        <h2 className="text-3xl font-premium-title italic text-primary drop-shadow-[0_0_15px_rgba(0,255,148,0.8)]">
          Sincronização Neural<span className="text-white font-normal not-italic ml-1">.</span>
        </h2>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative z-10">
        <GlassCard className="lg:col-span-2 h-[60vh] relative overflow-hidden border-primary/20 bg-black/40">
          <canvas ref={canvasRef} className="w-full h-full" />
          <div className="absolute top-6 left-6 space-y-1">
            <p className="text-[10px] uppercase tracking-[0.3em] text-primary font-bold">Status da Rede</p>
            <h3 className="text-xl font-bold text-white">Interface Cortical Ativa</h3>
          </div>
          <div className="absolute bottom-6 right-6 text-right">
            <p className="text-[10px] uppercase tracking-[0.3em] text-white/30 font-bold">Frequência</p>
            <h3 className="text-2xl font-premium-mono font-bold text-primary">{Math.round(syncLevel * 1.2)} Hz</h3>
          </div>
        </GlassCard>

        <div className="space-y-6">
          <GlassCard className="p-6 border-primary/20 bg-primary/5">
            <div className="flex items-center gap-3 text-primary mb-4">
              <Activity size={24} />
              <h3 className="font-bold uppercase tracking-widest text-sm">Nível de Sincronia</h3>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <span className="text-4xl font-premium-title italic text-white">{Math.round(syncLevel)}%</span>
                <span className="text-[10px] text-primary font-mono uppercase">Otimizado</span>
              </div>
              <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }} 
                  animate={{ width: `${syncLevel}%` }} 
                  className="h-full bg-primary shadow-[0_0_15px_rgba(0,255,148,0.8)]" 
                />
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-6 border-white/10 bg-white/5 space-y-4">
            <div className="flex items-center gap-3 text-blue-400">
              <Brain size={20} />
              <h4 className="text-xs font-bold uppercase tracking-widest">Capacidade Cognitiva</h4>
            </div>
            <p className="text-xs text-text-secondary leading-relaxed">
              Sua rede neural está operando em um estado de fluxo avançado. A retenção de informações está {syncLevel > 80 ? '300%' : '150%'} acima da média humana.
            </p>
          </GlassCard>

          <GlassCard className="p-6 border-white/10 bg-white/5 space-y-4">
            <div className="flex items-center gap-3 text-purple-400">
              <Cpu size={20} />
              <h4 className="text-xs font-bold uppercase tracking-widest">Processamento Paralelo</h4>
            </div>
            <p className="text-xs text-text-secondary leading-relaxed">
              Múltiplos domínios de conhecimento estão sendo integrados simultaneamente. A arquitetura de sua mente está se tornando multidimensional.
            </p>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};
