import React, { useState } from 'react';
import { useStore } from '../../store';
import { useAppNavigation } from '../../app/router/useAppNavigation';
import { useAllQuestions } from '../../hooks/useQuestions';
import { QuestionsLoadingSkeleton } from '../../components/shared/QuestionsLoadingSkeleton';
import { QuestionsLoadError } from '../../components/shared/QuestionsLoadError';
import { 
  ExamsHub, 
  ExamCreator, 
  ExamRunner, 
  ExamResults, 
  ExamReview,
  ExamHistory,
  Exam
} from './index';
import { ChevronLeft } from 'lucide-react';
import { clsx } from 'clsx';
import { AnimatedButton, Header } from '../../components/UI';
import { Brain } from 'lucide-react';

export const ExamsView = () => {
  const { questions: ALL_QUESTIONS, loading: qLoading, error: qError } = useAllQuestions();
  const { goBack, goTo } = useAppNavigation();
  const [view, setView] = useState<'list' | 'plan' | 'simulado' | 'history'>('list');
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
  
  // Simulado State
  const [simStep, setSimStep] = useState<'setup' | 'runner' | 'results' | 'review'>('setup');
  const [questions, setQuestions] = useState<any[]>([]);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [loading, setLoading] = useState(false);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const { addToHistory, addXP } = useStore();

  const handleSelectExam = (exam: Exam, targetView: 'plan' | 'simulado') => {
    setSelectedExam(exam);
    setView(targetView);
    if (targetView === 'simulado') {
      setSimStep('setup');
      setQuestions([]);
      setAnswers({});
      setSelectedTopics([]);
    }
  };

  const startSimulado = async () => {
    if (!selectedExam || !ALL_QUESTIONS) return;
    setLoading(true);
    try {
      let filtered = ALL_QUESTIONS.filter(q => q && q.prova === selectedExam.nome);
      if (selectedTopics.length > 0) {
        filtered = filtered.filter(q => selectedTopics.includes(q.assunto) || selectedTopics.includes(q.materia));
      }
      const res = filtered.length > 0 ? filtered : ALL_QUESTIONS.filter(q => q && selectedExam.materias.includes(q.materia)).slice(0, 15);
      const shuffled = [...res].sort(() => Math.random() - 0.5).slice(0, 15);
      setQuestions(shuffled);
      setSimStep('runner');
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const finishSimulado = () => {
    questions.forEach((q, i) => {
      if (answers[i] !== undefined) {
        addToHistory({
          questionId: q.id,
          userAnswer: answers[i],
          isCorrect: answers[i] === q.resposta,
          timestamp: new Date().toISOString(),
          timeSpent: 30
        });
      }
    });

    let correct = 0;
    questions.forEach((q, i) => {
      if (answers[i] === q.resposta) correct++;
    });
    addXP(correct * 50);
    setSimStep('results');
  };

  if (qLoading) return <QuestionsLoadingSkeleton />;
  if (qError) return <QuestionsLoadError error={qError} />;

  if (view === 'history') {
    return <ExamHistory onBack={() => setView('list')} />;
  }

  if (view === 'plan' && selectedExam) {
    return <ExamCreator exam={selectedExam} onBack={() => setView('list')} />;
  }

  if (view === 'simulado' && selectedExam) {
    if (loading) {
      return (
        <div className="app-shell-premium pt-6 md:pt-8 flex flex-col items-center justify-center min-h-[60vh] space-y-4">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-primary font-bold animate-pulse text-center">IA Montando Simulado Estratégico...</p>
        </div>
      );
    }

    if (simStep === 'setup') {
      return (
        <div className="app-shell-premium pt-6 md:pt-8 app-stack-premium pb-32 md:pb-36">
          <header className="flex items-center gap-4">
            <button onClick={() => setView('list')} className="p-2 bg-white/5 rounded-xl border border-white/10">
              <ChevronLeft size={20} />
            </button>
            <div>
              <h2 className="text-2xl font-premium-title italic">CONFIGURAR SIMULADO</h2>
              <p className="text-xs text-text-secondary uppercase font-bold tracking-widest">{selectedExam.nome}</p>
            </div>
          </header>

          <div className="space-y-6">
            <div className="space-y-4">
              <label className="text-[10px] font-premium-mono font-bold text-primary uppercase tracking-[0.3em]">Focar em Tópicos Específicos?</label>
              <div className="flex flex-wrap gap-2">
                {selectedExam.materias.map(m => (
                  <button
                    key={m}
                    onClick={() => setSelectedTopics(prev => prev.includes(m) ? prev.filter(t => t !== m) : [...prev, m])}
                    className={clsx(
                      "px-4 py-2 rounded-xl border text-[10px] font-bold uppercase tracking-widest transition-all",
                      selectedTopics.includes(m) ? "bg-primary text-black border-primary" : "bg-white/5 text-text-secondary border-white/10"
                    )}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-primary/5 border border-primary/20 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <Brain size={20} className="text-primary" />
                </div>
                <div>
                  <p className="text-[10px] font-premium-mono font-bold text-primary uppercase tracking-widest">IA Strategy Engine</p>
                  <p className="text-sm font-bold text-white">Simulação Adaptativa</p>
                </div>
              </div>
              <p className="text-[10px] text-text-secondary leading-relaxed uppercase font-bold tracking-widest opacity-60">
                A IA selecionará as questões com base no peso histórico de cada tópico na prova {selectedExam.nome}.
              </p>
            </div>

            <AnimatedButton onClick={startSimulado} className="w-full py-5 text-xs font-premium-mono font-bold uppercase tracking-[0.3em]" glow>
              Gerar Simulado Personalizado
            </AnimatedButton>
          </div>
        </div>
      );
    }

    if (simStep === 'runner') {
      return (
        <ExamRunner 
          exam={selectedExam}
          questions={questions}
          answers={answers}
          onAnswer={(idx, opt) => setAnswers(prev => ({ ...prev, [idx]: opt }))}
          onFinish={finishSimulado}
          onBack={() => setSimStep('setup')}
        />
      );
    }

    if (simStep === 'results') {
      return (
        <ExamResults 
          exam={selectedExam}
          questions={questions}
          answers={answers}
          onReview={() => setSimStep('review')}
          onClose={() => setView('list')}
        />
      );
    }

    if (simStep === 'review') {
      return (
        <ExamReview 
          questions={questions}
          answers={answers}
          onBack={() => setSimStep('results')}
        />
      );
    }
  }

  return (
    <div className="relative">
       <div className="absolute top-8 right-8 z-10 flex gap-2">
         <button onClick={() => setView('history')} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[9px] font-bold uppercase tracking-widest text-text-secondary hover:text-primary transition-colors">Histórico</button>
       </div>
       <ExamsHub onSelectExam={handleSelectExam} />
    </div>
  );
};

