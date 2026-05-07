import React, { useState } from 'react';
import { 
  ChevronLeft, 
  Sparkles, 
  FileText, 
  Target, 
  Zap, 
  Brain, 
  Calendar 
} from 'lucide-react';
import { useStore } from '../../../store';
import { aiService } from '../../../services/aiService';
import { 
  GlassCard, 
  AnimatedButton, 
  Badge 
} from '../../../components/UI';
import { Exam } from '../shared';

interface ExamCreatorProps {
  exam: Exam;
  onBack: () => void;
}

export const ExamCreator = ({ exam, onBack }: ExamCreatorProps) => {
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<any>(null);
  const { addNote } = useStore();
  const [isSaving, setIsSaving] = useState(false);

  const generatePlan = async () => {
    setLoading(true);
    try {
      const res = await aiService.generateExamPlan(exam.nome, exam.materias, exam.data);
      setPlan(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveToNotes = () => {
    if (!plan) return;
    setIsSaving(true);
    addNote({
      id: Math.random().toString(36).substr(2, 9),
      title: `Plano de Estudo: ${exam.nome}`,
      content: `# Plano Estratégico ${exam.nome}\n\n${plan.estrategia}\n\n## Cronograma\n${plan.calendario}`,
      subject: exam.materias[0] || 'Geral',
      updatedAt: new Date().toISOString()
    });
    setTimeout(() => setIsSaving(false), 2000);
  };

  if (loading) {
    return (
      <div className="app-shell-premium pt-6 md:pt-8 flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-primary font-bold animate-pulse text-center">Analisando edital e histórico da {exam.nome}...</p>
        <p className="text-[10px] text-text-secondary uppercase font-bold tracking-widest">Calculando Probabilidades e Pesos...</p>
      </div>
    );
  }

  if (plan) {
    return (
      <div className="app-shell-premium pt-6 md:pt-8 space-y-6 pb-32 md:pb-36 animate-in fade-in slide-in-from-bottom-4">
        <header className="flex items-center gap-4">
          <button onClick={() => setPlan(null)} className="p-2 bg-white/5 rounded-xl border border-white/10">
            <ChevronLeft size={20} />
          </button>
          <div>
            <h2 className="text-2xl font-premium-title italic">PLANO GERADO</h2>
            <p className="text-[10px] text-primary font-bold uppercase tracking-widest">Estratégia Customizada</p>
          </div>
        </header>

        <GlassCard className="p-6 space-y-6">
          <div className="flex items-center gap-4 border-b border-white/5 pb-4">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
              <Sparkles size={24} />
            </div>
            <div>
              <p className="text-[10px] text-text-secondary uppercase font-bold tracking-widest">Foco Principal</p>
              <h3 className="text-lg font-bold">{plan.foco}</h3>
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
              <p className="text-[10px] font-bold text-primary uppercase mb-2">Estratégia de Prova</p>
              <p className="text-sm text-text-secondary leading-relaxed">{plan.estrategia}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="text-[10px] font-bold text-orange-400 uppercase">Assuntos Críticos</p>
                {plan.prioridades?.map((p: string, i: number) => (
                  <div key={i} className="flex gap-2 items-center text-xs text-text-secondary">
                    <Target size={14} className="text-orange-400" />
                    {p}
                  </div>
                ))}
              </div>
              <div className="space-y-2">
                <p className="text-[10px] font-bold text-blue-400 uppercase">Facilitadores</p>
                {plan.dicas?.map((d: string, i: number) => (
                  <div key={i} className="flex gap-2 items-center text-xs text-text-secondary">
                    <Zap size={14} className="text-blue-400" />
                    {d}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </GlassCard>

        <div className="flex gap-3">
          <AnimatedButton onClick={handleSaveToNotes} variant="secondary" className="flex-1" disabled={isSaving}>
            {isSaving ? 'Salvo no Caderno!' : 'Salvar no Caderno'}
          </AnimatedButton>
          <AnimatedButton onClick={onBack} className="flex-1">Voltar</AnimatedButton>
        </div>
      </div>
    );
  }

  return (
    <div className="app-shell-premium pt-6 md:pt-8 app-stack-premium pb-32 md:pb-36">
      <header className="flex items-center gap-4">
        <button onClick={onBack} className="p-2 bg-white/5 rounded-xl border border-white/10">
          <ChevronLeft size={20} />
        </button>
        <h2 className="text-2xl font-premium-title italic">PLANO DE ESTUDO</h2>
      </header>

      <GlassCard className="p-8 text-center space-y-6 border-primary/20 bg-primary/5">
        <div className="w-20 h-20 bg-primary/20 rounded-[32px] flex items-center justify-center mx-auto text-primary border border-primary/30 shadow-[0_0_30px_rgba(0,255,148,0.2)]">
          <Brain size={40} />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-bold">Gerar Roteiro para {exam.nome}</h3>
          <p className="text-sm text-text-secondary">Vamos analisar as tendências dos últimos 5 anos desta prova e criar um cronograma otimizado para o seu tempo disponível.</p>
        </div>
        <div className="flex justify-center gap-8 py-4 border-y border-white/5">
          <div className="text-center">
            <p className="text-xs font-bold text-primary">85%</p>
            <p className="text-[8px] text-text-secondary uppercase">Precisão</p>
          </div>
          <div className="text-center">
            <p className="text-xs font-bold text-primary">Adaptive</p>
            <p className="text-[8px] text-text-secondary uppercase">Engine</p>
          </div>
          <div className="text-center">
            <p className="text-xs font-bold text-primary">Full</p>
            <p className="text-[8px] text-text-secondary uppercase">Coverage</p>
          </div>
        </div>
        <AnimatedButton onClick={generatePlan} className="w-full py-5 text-xs font-premium-mono font-bold uppercase tracking-[0.3em]" glow>
          Iniciar Análise Estratégica
        </AnimatedButton>
      </GlassCard>

      <div className="space-y-4">
        <h4 className="text-[10px] font-premium-mono font-bold text-text-secondary uppercase tracking-widest pl-2">O QUE SERÁ ANALISADO:</h4>
        <div className="grid grid-cols-1 gap-3">
          {[
            { icon: Target, title: 'Peso das Matérias', desc: 'Identificação do custo-benefício de cada tópico.' },
            { icon: FileText, title: 'Perfil da Banca', desc: 'Estilo das questões e temas recorrentes.' },
            { icon: Calendar, title: 'Timestamp Analysis', desc: 'Dias restantes até a data da prova.' }
          ].map((item, i) => (
            <div key={i} className="flex gap-4 p-4 bg-white/5 rounded-2xl border border-white/10">
              <div className="text-primary mt-1"><item.icon size={18} /></div>
              <div>
                <p className="text-sm font-bold">{item.title}</p>
                <p className="text-xs text-text-secondary">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
