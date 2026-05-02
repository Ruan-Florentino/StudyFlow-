import { useState } from 'react';
import { motion } from 'framer-motion';
import { Network, ArrowLeft, Check, Loader2 } from 'lucide-react';
import { useStore } from '../../../store';
import { aiService } from '../../../services/aiService';
import { AnimatedButton, GlassCard, cn } from '../../../components/UI';

interface LearningPathProps {
  onBack: () => void;
}

export function LearningPath({ onBack }: LearningPathProps) {
  const { learningPaths, setLearningPath, completeMilestone, level } = useStore();
  const [selectedSubject, setSelectedSubject] = useState('Matemática');
  const [loading, setLoading] = useState(false);

  const currentPath = learningPaths[selectedSubject];

  const generatePath = async () => {
    setLoading(true);
    try {
      const path = await aiService.generateLearningPath(selectedSubject, level);
      setLearningPath(selectedSubject, path);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-8 pb-32 animate-in slide-in-from-bottom duration-500">
      <header className="flex items-center gap-4">
        <AnimatedButton onClick={onBack} variant="secondary" className="p-2 rounded-full">
          <ArrowLeft size={20} />
        </AnimatedButton>
        <h2 className="text-2xl font-premium-title italic">Roteiro Adaptativo<span className="text-primary font-normal not-italic ml-1">.</span></h2>
      </header>

      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
        {['Matemática', 'Português', 'Física', 'Química', 'Biologia'].map(s => (
          <button
            key={s}
            onClick={() => setSelectedSubject(s)}
            className={cn(
              "px-4 py-2 rounded-full text-[10px] font-premium-mono font-bold uppercase tracking-widest border transition-all whitespace-nowrap",
              selectedSubject === s ? "bg-primary text-black border-primary" : "bg-white/5 border-white/10 text-text-secondary"
            )}
          >
            {s}
          </button>
        ))}
      </div>

      {!currentPath ? (
        <div className="flex flex-col items-center justify-center py-20 text-center space-y-6">
          <div className="w-20 h-20 rounded-3xl bg-white/5 flex items-center justify-center text-white/20 border border-white/10">
            <Network size={40} />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-bold">Gerar Roteiro de {selectedSubject}</h3>
            <p className="text-sm text-text-secondary max-w-[250px]">A IA criará um caminho personalizado baseado no seu nível atual.</p>
          </div>
          <AnimatedButton onClick={generatePath} disabled={loading} className="bg-primary text-black border-primary px-8">
            {loading ? <Loader2 className="animate-spin" /> : "Gerar com IA"}
          </AnimatedButton>
        </div>
      ) : (
        <div className="space-y-6 relative">
          <div className="absolute left-[27px] top-8 bottom-8 w-0.5 bg-white/5" />
          {currentPath.milestones.map((m: any, i: number) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="relative pl-14"
            >
              <div className={cn(
                "absolute left-0 w-14 h-14 rounded-2xl flex items-center justify-center border transition-all z-10",
                m.isCompleted ? "bg-primary/20 border-primary text-primary" : "bg-white/5 border-white/10 text-text-secondary"
              )}>
                {m.isCompleted ? <Check size={24} /> : <span className="font-premium-mono font-bold">{i + 1}</span>}
              </div>
              <GlassCard className={cn("p-5 space-y-2", m.isCompleted && "opacity-50")}>
                <h4 className="font-bold">{m.title}</h4>
                <p className="text-xs text-text-secondary">{m.description}</p>
                {!m.isCompleted && (
                  <div className="pt-2">
                    <div className="p-3 bg-primary/5 border border-primary/20 rounded-xl">
                      <p className="text-[10px] font-premium-mono font-bold text-primary uppercase tracking-widest mb-1">Desafio de Maestria</p>
                      <p className="text-[11px] text-text-secondary italic">{m.masteryChallenge}</p>
                    </div>
                    <AnimatedButton 
                      onClick={() => completeMilestone(selectedSubject, m.id)}
                      className="mt-3 w-full text-[10px] py-2 bg-primary/10 text-primary border-primary/20"
                    >
                      Concluir Desafio
                    </AnimatedButton>
                  </div>
                )}
              </GlassCard>
            </motion.div>
          ))}
          <AnimatedButton onClick={generatePath} variant="secondary" className="w-full text-xs opacity-50">
            Regerar Roteiro
          </AnimatedButton>
        </div>
      )}
    </div>
  );
}
