import React, { useState } from 'react';
import { 
  ChevronLeft, 
  Sparkles 
} from 'lucide-react';
import Markdown from 'react-markdown';
import { useStore } from '../../../store';
import { aiService } from '../../../services/aiService';
import { 
  GlassCard, 
  AnimatedButton, 
  ProgressRing 
} from '../../../components/UI';
import { Exam, Question } from '../shared';

interface ExamResultsProps {
  exam: Exam;
  questions: Question[];
  answers: Record<number, number>;
  onReview: () => void;
  onClose: () => void;
}

export const ExamResults = ({ 
  exam, 
  questions, 
  answers, 
  onReview, 
  onClose 
}: ExamResultsProps) => {
  const [loading, setLoading] = useState(false);
  const [aiReview, setAiReview] = useState('');
  const [showAiReview, setShowAiReview] = useState(false);
  const [isSavingNote, setIsSavingNote] = useState(false);
  const { addNote } = useStore();

  let correctCount = 0;
  questions.forEach((q, i) => {
    if (answers[i] === q.resposta) correctCount++;
  });
  const score = (correctCount / questions.length) * 100;

  const handleGenerateAIReview = async () => {
    const wrongTopics = Array.from(new Set(
      questions.filter((q, i) => answers[i] !== q.resposta).map(q => q.assunto || q.materia)
    ));
    setLoading(true);
    try {
      const review = await aiService.suggestReview(wrongTopics);
      setAiReview(review);
      setShowAiReview(true);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveNote = () => {
    setIsSavingNote(true);
    addNote({
      id: Math.random().toString(36).substr(2, 9),
      title: `Revisão: ${exam.nome}`,
      content: aiReview,
      subject: exam.materias[0] || 'Geral',
      updatedAt: new Date().toISOString()
    });
    setTimeout(() => setIsSavingNote(false), 2000);
  };

  if (loading) {
    return (
      <div className="app-shell-premium pt-6 md:pt-8 flex flex-col items-center justify-center min-h-[60vh] space-y-4 text-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-primary font-bold animate-pulse">Gerando Plano de Revisão IA Personalizado...</p>
      </div>
    );
  }

  if (showAiReview && aiReview) {
    return (
      <div className="app-shell-premium pt-6 md:pt-8 space-y-6 pb-32 md:pb-36">
        <header className="flex items-center gap-4">
          <button onClick={() => setShowAiReview(false)} className="p-2 bg-white/5 rounded-xl border border-white/10">
            <ChevronLeft size={20} />
          </button>
          <div>
            <h2 className="text-xl font-bold">Plano de Revisão IA</h2>
            <p className="text-[10px] text-primary font-bold uppercase tracking-widest">Personalizado para seus erros</p>
          </div>
        </header>

        <GlassCard className="p-6 prose prose-invert prose-sm max-w-none">
          <Markdown>{aiReview}</Markdown>
        </GlassCard>

        <div className="flex gap-3">
          <AnimatedButton 
            onClick={handleSaveNote} 
            variant="secondary" 
            className="flex-1"
            disabled={isSavingNote}
          >
            {isSavingNote ? 'Salvo!' : 'Salvar no Caderno'}
          </AnimatedButton>
          <AnimatedButton onClick={() => setShowAiReview(false)} className="flex-1">Voltar</AnimatedButton>
        </div>
      </div>
    );
  }

  return (
    <div className="app-shell-premium pt-6 md:pt-8 app-stack-premium text-center pb-32 md:pb-36">
      <div className="space-y-2">
        <h2 className="text-3xl font-black italic">RESULTADO</h2>
        <p className="text-text-secondary uppercase text-xs font-bold tracking-widest">{exam.nome}</p>
      </div>

      <div className="relative flex justify-center">
        <ProgressRing progress={score} size={200} strokeWidth={15} />
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-black">{correctCount}/{questions.length}</span>
          <span className="text-[10px] text-text-secondary font-bold uppercase">Acertos</span>
        </div>
      </div>

      <div className="space-y-4">
        <GlassCard className="text-left space-y-4">
          <h3 className="font-bold border-b border-white/5 pb-2 text-sm uppercase tracking-widest opacity-60">Análise de Desempenho</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-text-secondary">Questões Respondidas</span>
              <span className="font-bold">{Object.keys(answers).length} / {questions.length}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-text-secondary">Nível de Dificuldade</span>
              <span className="font-bold text-primary">{exam.nivel}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-text-secondary">XP Ganho</span>
              <span className="font-bold text-primary">+{correctCount * 50} XP</span>
            </div>
          </div>
        </GlassCard>
        
        <div className="flex gap-3">
          <AnimatedButton onClick={onReview} variant="secondary" className="flex-1">Revisar Erros</AnimatedButton>
          <AnimatedButton onClick={onClose} className="flex-1">Concluir</AnimatedButton>
        </div>

        {score < 100 && (
          <div className="pt-4 border-t border-white/5">
            <AnimatedButton 
              onClick={handleGenerateAIReview}
              className="w-full py-4 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20"
              glow
            >
              <Sparkles size={18} className="mr-2" />
              Gerar Plano de Revisão IA
            </AnimatedButton>
          </div>
        )}
      </div>
    </div>
  );
};
