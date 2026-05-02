import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, Shuffle, ChevronRight, Trophy } from 'lucide-react';
import { aiService } from '../../../services/aiService';
import { AnimatedButton, GlassCard } from '../../../components/UI';

interface InterleavingScreenProps {
  onBack: () => void;
}

export function InterleavingScreen({ onBack }: InterleavingScreenProps) {
  const [subjects, setSubjects] = useState(['', '', '']);
  const [loading, setLoading] = useState(false);
  const [quiz, setQuiz] = useState<{subject: string, question: string, options: string[], correctIndex: number, explanation: string}[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);

  const handleGenerate = async () => {
    const validSubjects = subjects.filter(s => s.trim() !== '');
    if (validSubjects.length < 2) {
      alert('Por favor, insira pelo menos 2 matérias para intercalar.');
      return;
    }
    setLoading(true);
    try {
      const res = await aiService.generateInterleavingQuiz(validSubjects);
      setQuiz(res);
      setCurrentIndex(0);
      setSelectedOption(null);
      setShowExplanation(false);
      setScore(0);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (index: number) => {
    if (selectedOption !== null) return;
    setSelectedOption(index);
    if (index === quiz[currentIndex].correctIndex) {
      setScore(s => s + 1);
    }
    setShowExplanation(true);
  };

  const nextQuestion = () => {
    if (currentIndex < quiz.length - 1) {
      setCurrentIndex(c => c + 1);
      setSelectedOption(null);
      setShowExplanation(false);
    } else {
      // Finished
      setCurrentIndex(c => c + 1);
    }
  };

  return (
    <div className="p-6 space-y-6 pb-28">
      <header className="flex items-center gap-4">
        <button onClick={onBack} className="p-2 bg-white/5 rounded-xl border border-white/10">
          <ChevronLeft size={20} />
        </button>
        <h2 className="text-2xl font-bold">Interleaving</h2>
      </header>

      {quiz.length === 0 ? (
        <div className="space-y-6">
          <GlassCard className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-text-secondary uppercase">Quais matérias deseja intercalar?</label>
              {subjects.map((sub, i) => (
                <input 
                  key={i}
                  value={sub}
                  onChange={(e) => {
                    const newSubs = [...subjects];
                    newSubs[i] = e.target.value;
                    setSubjects(newSubs);
                  }}
                  placeholder={`Matéria ${i + 1}`}
                  className="w-full bg-card border border-border rounded-2xl p-4 outline-none focus:border-primary mb-2"
                />
              ))}
            </div>
            <AnimatedButton onClick={handleGenerate} className="w-full py-4 text-black" glow disabled={loading}>
              {loading ? 'Gerando Quiz Misto...' : 'Iniciar Sessão'}
              <Shuffle size={18} />
            </AnimatedButton>
          </GlassCard>
        </div>
      ) : currentIndex < quiz.length ? (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
          <div className="flex justify-between items-center">
            <div className="px-3 py-1 bg-orange-500/10 border border-orange-500/20 rounded-full text-[10px] font-bold text-orange-500 uppercase tracking-widest">
              {quiz[currentIndex].subject}
            </div>
            <p className="text-[10px] font-premium-mono font-bold text-text-secondary uppercase tracking-[0.3em]">
              {currentIndex + 1} / {quiz.length}
            </p>
          </div>
          
          <h3 className="text-xl font-bold leading-relaxed">{quiz[currentIndex].question}</h3>

          <div className="space-y-3">
            {quiz[currentIndex].options.map((opt, i) => {
              let style = "border-white/10 bg-white/5 hover:border-white/20";
              if (selectedOption !== null) {
                if (i === quiz[currentIndex].correctIndex) {
                  style = "border-primary bg-primary/10 text-primary";
                } else if (i === selectedOption) {
                  style = "border-red-500 bg-red-500/10 text-red-500";
                } else {
                  style = "opacity-30 border-white/5 bg-transparent";
                }
              }
              return (
                <button
                  key={i}
                  onClick={() => handleAnswer(i)}
                  disabled={selectedOption !== null}
                  className={`w-full p-4 rounded-2xl border text-left transition-all flex items-start gap-3 ${style}`}
                >
                  <span className="w-6 h-6 rounded-lg bg-white/5 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                    {String.fromCharCode(65 + i)}
                  </span>
                  <span className="text-sm font-medium leading-relaxed">{opt}</span>
                </button>
              );
            })}
          </div>

          {showExplanation && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
              <GlassCard className="p-5 border-primary/20 bg-primary/5">
                <h4 className="text-[10px] font-bold text-primary uppercase tracking-widest mb-2">Explicação</h4>
                <p className="text-sm text-white/90 leading-relaxed">{quiz[currentIndex].explanation}</p>
              </GlassCard>
              <AnimatedButton onClick={nextQuestion} className="w-full py-4 text-black" glow>
                {currentIndex === quiz.length - 1 ? 'Ver Resultado' : 'Próxima Pergunta'}
                <ChevronRight size={18} />
              </AnimatedButton>
            </motion.div>
          )}
        </motion.div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 space-y-6 text-center">
          <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center text-primary shadow-[0_0_20px_rgba(0,255,148,0.2)]">
            <Trophy size={48} />
          </div>
          <div className="space-y-2">
            <h2 className="text-3xl font-bold">Sessão Concluída!</h2>
            <p className="text-text-secondary">Você acertou {score} de {quiz.length} questões.</p>
          </div>
          <AnimatedButton onClick={() => { setQuiz([]); setSubjects(['', '', '']); }} className="w-full max-w-xs py-4 text-black" glow>
            Nova Sessão
          </AnimatedButton>
        </div>
      )}
    </div>
  );
}
