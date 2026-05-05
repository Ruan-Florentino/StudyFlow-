import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, Zap, Brain, ChevronRight } from 'lucide-react';
import { aiService } from '../../../services/aiService';
import { AnimatedButton, GlassCard } from '../../../components/UI';

interface ActiveRecallScreenProps {
  onBack: () => void;
}

export function ActiveRecallScreen({ onBack }: ActiveRecallScreenProps) {
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<{question: string, answer: string}[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    try {
      const res = await aiService.generateActiveRecall(topic);
      setQuestions(res);
      setCurrentIndex(0);
      setShowAnswer(false);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(c => c + 1);
      setShowAnswer(false);
    } else {
      setQuestions([]);
      setTopic('');
    }
  };

  return (
    <div className="app-shell-premium pt-6 md:pt-8 space-y-6 pb-28">
      <header className="flex items-center gap-4">
        <button onClick={onBack} className="p-2 bg-white/5 rounded-xl border border-white/10">
          <ChevronLeft size={20} />
        </button>
        <h2 className="text-2xl font-bold">Active Recall</h2>
      </header>

      {questions.length === 0 ? (
        <div className="space-y-6">
          <GlassCard className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-text-secondary uppercase">Qual tema você quer forçar a memória?</label>
              <input 
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Ex: Ciclo de Krebs, Segunda Guerra..."
                className="w-full bg-card border border-border rounded-2xl p-4 outline-none focus:border-primary"
              />
            </div>
            <AnimatedButton onClick={handleGenerate} className="w-full py-4 text-black" glow disabled={loading}>
              {loading ? 'Gerando Perguntas...' : 'Iniciar Sessão'}
              <Zap size={18} />
            </AnimatedButton>
          </GlassCard>
        </div>
      ) : (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
          <div className="text-center space-y-2">
            <p className="text-[10px] font-premium-mono font-bold text-primary uppercase tracking-[0.3em]">
              PERGUNTA {currentIndex + 1} DE {questions.length}
            </p>
            <h3 className="text-2xl font-bold leading-relaxed">{questions[currentIndex].question}</h3>
          </div>

          {!showAnswer ? (
            <div className="space-y-6">
              <div className="p-8 border-2 border-dashed border-white/10 rounded-3xl text-center text-text-secondary">
                <Brain size={48} className="mx-auto mb-4 opacity-50" />
                <p className="font-medium">Tente lembrar da resposta mentalmente ou em voz alta.</p>
              </div>
              <AnimatedButton onClick={() => setShowAnswer(true)} className="w-full py-4 text-black" glow>
                Revelar Resposta
              </AnimatedButton>
            </div>
          ) : (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
              <GlassCard className="p-6 border-primary/30 bg-primary/5">
                <h4 className="text-xs font-bold text-primary uppercase tracking-widest mb-2">Resposta Ideal</h4>
                <p className="text-lg text-white/90 leading-relaxed">{questions[currentIndex].answer}</p>
              </GlassCard>
              
              <div className="flex gap-3">
                <AnimatedButton onClick={nextQuestion} className="flex-1 py-4 text-black" glow>
                  {currentIndex === questions.length - 1 ? 'Finalizar Sessão' : 'Próxima Pergunta'}
                  <ChevronRight size={18} />
                </AnimatedButton>
              </div>
            </motion.div>
          )}
        </motion.div>
      )}
    </div>
  );
}
