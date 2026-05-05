import React, { useState } from 'react';
import { ChevronLeft, CheckCircle2, XCircle } from 'lucide-react';
import { AnimatedButton, GlassCard } from '../../../components/UI';
import { aiService } from '../../../services/aiService';
import Markdown from 'react-markdown';

/**
 * BlurtingMethod
 * Tipo: View de Estudo
 * Extraído de: App.tsx (T.45-F Cleanup)
 */

interface BlurtingMethodProps {
  onBack: () => void;
}

export function BlurtingMethod({ onBack }: BlurtingMethodProps) {
  const [step, setStep] = useState(1);
  const [topic, setTopic] = useState('');
  const [notes, setNotes] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleCompare = async () => {
    if (!topic || !notes) return;
    setLoading(true);
    try {
      const res = await aiService.blurtingComparison(topic, notes);
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
        <h2 className="text-2xl font-bold">Método Blurting</h2>
      </header>

      <div className="flex gap-2 mb-6">
        {[1, 2, 3].map((s) => (
          <div key={s} className={`h-1 flex-1 rounded-full ${step >= s ? 'bg-purple-500' : 'bg-white/10'}`} />
        ))}
      </div>

      {step === 1 && (
        <div className="space-y-6">
          <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-2xl text-sm text-purple-400">
            Escreva tudo o que você lembra sobre o tema sem consultar nenhum material. Depois, a IA comparará com o conteúdo completo.
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-text-secondary uppercase">1. Qual o tema?</label>
            <input 
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Ex: Revolução Francesa, Tabela Periódica..."
              className="w-full bg-card border border-border rounded-2xl p-4 outline-none focus:border-primary"
            />
          </div>
          <AnimatedButton onClick={() => setStep(2)} className="w-full py-4 bg-purple-500 hover:bg-purple-600 border-purple-500">
            Próximo Passo
          </AnimatedButton>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-text-secondary uppercase">2. Escreva tudo o que lembra</label>
            <textarea 
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={`Comece a escrever tudo o que está na sua cabeça sobre ${topic}...`}
              rows={10}
              className="w-full bg-card border border-border rounded-2xl p-4 outline-none focus:border-primary resize-none"
            />
          </div>
          <div className="flex gap-2">
            <AnimatedButton onClick={() => setStep(1)} variant="secondary" className="flex-1">Voltar</AnimatedButton>
            <AnimatedButton onClick={handleCompare} className="flex-1 py-4 bg-purple-500 hover:bg-purple-600 border-purple-500" glow disabled={loading}>
              {loading ? 'Comparando...' : 'Comparar e Ver Omissões'}
            </AnimatedButton>
          </div>
        </div>
      )}

      {step === 3 && result && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
          <GlassCard className="p-6 space-y-4">
            <h3 className="text-lg font-bold text-purple-400">Resultado do Blurting</h3>
            <div className="prose prose-invert prose-sm">
              <Markdown>{result.feedback}</Markdown>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <p className="text-xs font-bold text-primary uppercase">Pontos que você lembrou</p>
                <div className="space-y-2">
                  {result.remembered?.map((item: string, i: number) => (
                    <div key={i} className="flex gap-2 items-start text-sm text-text-secondary">
                      <CheckCircle2 size={16} className="text-primary shrink-0 mt-0.5" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-xs font-bold text-red-400 uppercase">Pontos esquecidos (Omissões)</p>
                <div className="space-y-2">
                  {result.forgotten?.map((item: string, i: number) => (
                    <div key={i} className="flex gap-2 items-start text-sm text-text-secondary">
                      <XCircle size={16} className="text-red-400 shrink-0 mt-0.5" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </GlassCard>
          <AnimatedButton onClick={() => { setStep(1); setTopic(''); setNotes(''); setResult(null); }} className="w-full bg-purple-500 hover:bg-purple-600 border-purple-500">
            Novo Blurting
          </AnimatedButton>
        </div>
      )}
    </div>
  );
}
