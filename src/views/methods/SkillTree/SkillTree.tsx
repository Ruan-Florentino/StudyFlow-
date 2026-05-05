import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Trophy, Crown, PenTool, Loader2 } from 'lucide-react';
import { useStore } from '../../../store';
import { aiService } from '../../../services/aiService';
import { AnimatedButton, GlassCard, ProgressRing, cn } from '../../../components/UI';

interface SkillTreeProps {
  onBack: () => void;
}

export function SkillTree({ onBack }: SkillTreeProps) {
  const { mastery, startBossBattle } = useStore();
  const [loading, setLoading] = useState<string | null>(null);
  
  const subjects = Object.entries(mastery).map(([name, value]) => ({
    name,
    value,
    color: name === 'Matemática' ? 'bg-blue-500' : 
           name === 'Português' ? 'bg-red-500' :
           name === 'Física' ? 'bg-purple-500' :
           name === 'Química' ? 'bg-yellow-500' :
           name === 'Biologia' ? 'bg-green-500' : 'bg-gray-500'
  }));

  const handleBossBattle = async (subject: string) => {
    setLoading(subject);
    try {
      const questions = await aiService.generateBossBattle(subject);
      startBossBattle(subject, questions);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="app-shell-premium pt-6 md:pt-8 app-stack-premium pb-32 md:pb-36 animate-in slide-in-from-left duration-500">
      <header className="flex items-center gap-4">
        <AnimatedButton onClick={onBack} variant="secondary" className="p-2 rounded-full">
          <ArrowLeft size={20} />
        </AnimatedButton>
        <h2 className="text-2xl font-premium-title italic">Árvore de Habilidades<span className="text-primary font-normal not-italic ml-1">.</span></h2>
      </header>

      <div className="grid grid-cols-2 gap-4">
        {subjects.map((s, i) => (
          <motion.div
            key={s.name}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: i * 0.05 }}
          >
            <GlassCard className="p-4 flex flex-col items-center text-center space-y-3 relative overflow-hidden group">
              <div className={cn("absolute top-0 left-0 w-full h-1", s.color)} />
              <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                <ProgressRing progress={s.value} size={40} strokeWidth={3} />
                <div className="absolute text-[10px] font-bold">{Math.round(s.value)}%</div>
              </div>
              <div>
                <h4 className="text-sm font-bold">{s.name}</h4>
                <p className="text-[10px] text-text-secondary uppercase tracking-widest">Nível {Math.floor(s.value / 10) + 1}</p>
              </div>
              
              {s.value >= 30 && (
                <AnimatedButton 
                  onClick={() => handleBossBattle(s.name)}
                  disabled={!!loading}
                  className="w-full text-[8px] py-1 bg-red-500/10 text-red-500 border-red-500/20 group-hover:bg-red-500 group-hover:text-white transition-all"
                >
                  {loading === s.name ? <Loader2 size={10} className="animate-spin mx-auto" /> : "BOSS BATTLE"}
                </AnimatedButton>
              )}
            </GlassCard>
          </motion.div>
        ))}
      </div>

      <GlassCard className="p-6 space-y-4 border-primary/20 bg-primary/5">
        <h3 className="text-lg font-bold flex items-center gap-2">
          <Trophy className="text-primary" /> Próximos Desbloqueios
        </h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3 opacity-50">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
              <Crown size={16} />
            </div>
            <div className="flex-1">
              <p className="text-xs font-bold">Mestre da Lógica</p>
              <p className="text-[10px] text-text-secondary">Chegue a 80% em Matemática</p>
            </div>
          </div>
          <div className="flex items-center gap-3 opacity-50">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
              <PenTool size={16} />
            </div>
            <div className="flex-1">
              <p className="text-xs font-bold">Poliglota</p>
              <p className="text-[10px] text-text-secondary">Chegue a 80% em Inglês</p>
            </div>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
