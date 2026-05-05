import React, { useState } from 'react';
import { ChevronLeft, AlertCircle, CheckCircle2 } from 'lucide-react';
import { AnimatedButton, GlassCard } from '../../../components/UI';
import { aiService } from '../../../services/aiService';
import Markdown from 'react-markdown';

/**
 * FeynmanMethod
 * Tipo: View de Estudo
 * Extraído de: App.tsx (T.45-F Cleanup)
 */

interface FeynmanMethodProps {
  onBack: () => void;
}

export function FeynmanMethod({ onBack }: FeynmanMethodProps) {
  const [step, setStep] = useState(1);
  const [subject, setSubject] = useState('');
  const [explanation, setExplanation] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!subject || !explanation) return;
    setLoading(true);
    try {
      const res = await aiService.feynmanCorrection(subject, explanation);
      setResult(res);
      setStep(3);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-shell-premium pt-6 md:pt-8 space-y-6 pb-28">
      <header className="flex items-center gap-4">
        <button onClick={onBack} className="p-2 bg-white/5 rounded-xl border border-white/10">
          <ChevronLeft size={20} />
        </button>
        <h2 className="text-2xl font-bold">Método Feynman</h2>
      </header>

      <div className="flex gap-2 mb-6">
        {[1, 2, 3].map((s) => (
          <div key={s} className={`h-1 flex-1 rounded-full ${step >= s ? 'bg-primary' : 'bg-white/10'}`} />
        ))}
      </div>

      {step === 1 && (
        <div className="space-y-6">
          <div className="p-4 bg-primary/10 border border-primary/20 rounded-2xl text-sm text-primary">
            "Se você não consegue explicar algo de forma simples, você não entendeu bem o suficiente." - Richard Feynman
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-text-secondary uppercase">1. Escolha o conceito</label>
            <input 
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Ex: Fotossíntese, Segunda Lei de Newton..."
              className="w-full bg-card border border-border rounded-2xl p-4 outline-none focus:border-primary"
            />
          </div>
          <AnimatedButton onClick={() => setStep(2)} className="w-full py-4">
            Próximo Passo
          </AnimatedButton>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-text-secondary uppercase">2. Explique como se fosse para uma criança</label>
            <textarea 
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
              placeholder={`Explique ${subject} com suas próprias palavras...`}
              rows={8}
              className="w-full bg-card border border-border rounded-2xl p-4 outline-none focus:border-primary resize-none"
            />
          </div>
          <div className="flex gap-2">
            <AnimatedButton onClick={() => setStep(1)} variant="secondary" className="flex-1">Voltar</AnimatedButton>
            <AnimatedButton onClick={handleAnalyze} className="flex-1 py-4" glow disabled={loading}>
              {loading ? 'Analisando...' : 'Analisar Explicação'}
            </AnimatedButton>
          </div>
        </div>
      )}

      {step === 3 && result && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
          <GlassCard className="p-6 space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-primary">Análise Feynman</h3>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-premium-mono text-text-secondary uppercase">Clareza</span>
                <span className="text-2xl font-premium-title text-primary">{result.score}<span className="text-xs text-text-secondary">/10</span></span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                <p className="text-xs font-bold text-primary uppercase mb-2">Feedback Geral</p>
                <div className="text-sm text-text-secondary leading-relaxed">
                   <Markdown>{result.feedback}</Markdown>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-xs font-bold text-orange-400 uppercase">Lacunas Identificadas</p>
                  <div className="space-y-2">
                    {result.gaps?.map((gap: string, i: number) => (
                      <div key={i} className="flex gap-2 items-start text-xs text-text-secondary">
                        <AlertCircle size={14} className="text-orange-400 shrink-0 mt-0.5" />
                        {gap}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-xs font-bold text-green-400 uppercase">Sugestões de Simplificação</p>
                  <div className="space-y-2">
                    {result.simplifications?.map((sim: string, i: number) => (
                      <div key={i} className="flex gap-2 items-start text-xs text-text-secondary">
                        <CheckCircle2 size={14} className="text-green-400 shrink-0 mt-0.5" />
                        {sim}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </GlassCard>
          <AnimatedButton onClick={() => { setStep(1); setSubject(''); setExplanation(''); setResult(null); }} className="w-full">
            Novo Conceito
          </AnimatedButton>
        </div>
      )}
    </div>
  );
}
