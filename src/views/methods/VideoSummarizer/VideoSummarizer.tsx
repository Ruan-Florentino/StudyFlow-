import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Loader2, Sparkles, FileText, Layers, Brain } from 'lucide-react';
import { useStore } from '../../../store';
import { athenaClient } from '../../../features/athena/services/athenaClient';
import { DEFAULT_OPENROUTER_CHAT_MODEL } from '../../../config/openRouter';
import { AnimatedButton, GlassCard } from '../../../components/UI';
import { triggerConfetti } from '../../../lib/studyUtils';

interface VideoSummarizerProps {
  onBack: () => void;
}

export function VideoSummarizer({ onBack }: VideoSummarizerProps) {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const { addFlashcard, addXP } = useStore();

  const handleSummarize = async () => {
    if (!url) return;
    setLoading(true);
    try {
      const prompt = `Analise o seguinte vídeo (URL: ${url}) e forneça um resumo estruturado. 
Como você não pode assistir ao vídeo diretamente, use o título e contexto da URL para inferir o conteúdo e criar um exemplo de como seria o resumo.
Retorne APENAS um JSON:
{
  "summary": "Resumo detalhado...",
  "topics": ["Tópico 1", "Tópico 2"],
  "flashcards": [{"front": "Pergunta", "back": "Resposta"}]
}`;

      const response = await athenaClient.chat({
        messages: [
          { role: 'system', content: 'Você é um assistente de resumo de vídeos educacionais. Retorne apenas JSON.' },
          { role: 'user', content: prompt }
        ],
        model: DEFAULT_OPENROUTER_CHAT_MODEL
      });

      const cleanJson = response.replace(/```json|```/g, '').trim();
      const data = JSON.parse(cleanJson);
      setResult(data);
      addXP(50);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const saveFlashcards = () => {
    if (!result) return;
    result.flashcards.forEach((f: any) => {
      addFlashcard({
        id: Math.random().toString(36).substr(2, 9),
        front: f.front,
        back: f.back,
        subject: 'Vídeo Resumo',
        deckId: 'video-summaries',
        level: 'Novo',
        interval: 0,
        nextReview: new Date().toISOString()
      });
    });
    triggerConfetti();
    alert("Flashcards salvos com sucesso!");
  };

  return (
    <div className="app-shell-premium pt-6 md:pt-8 app-stack-premium pb-32 md:pb-36 animate-in slide-in-from-right duration-500">
      <header className="flex items-center gap-4">
        <AnimatedButton onClick={onBack} variant="secondary" className="p-2 rounded-full">
          <ArrowLeft size={20} />
        </AnimatedButton>
        <h2 className="text-2xl font-premium-title italic">Resumidor de Vídeo<span className="text-primary font-normal not-italic ml-1">.</span></h2>
      </header>

      <GlassCard className="p-6 space-y-4">
        <div className="space-y-2">
          <label className="text-xs font-premium-mono font-bold text-text-secondary uppercase tracking-widest">URL do YouTube</label>
          <div className="flex gap-2">
            <input 
              type="text" 
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://youtube.com/watch?v=..."
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary/50 transition-colors"
            />
            <AnimatedButton 
              onClick={handleSummarize} 
              disabled={loading}
              className="bg-primary text-black border-primary px-6"
            >
              {loading ? <Loader2 className="animate-spin" /> : <Sparkles size={20} />}
            </AnimatedButton>
          </div>
        </div>
      </GlassCard>

      {result && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <GlassCard className="p-6 space-y-4">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <FileText className="text-primary" /> Resumo
            </h3>
            <p className="text-text-secondary leading-relaxed">{result.summary}</p>
          </GlassCard>

          <GlassCard className="p-6 space-y-4">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <Layers className="text-primary" /> Tópicos Principais
            </h3>
            <ul className="space-y-2">
              {result.topics.map((t: string, i: number) => (
                <li key={i} className="flex items-start gap-3 text-text-secondary">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </GlassCard>

          <GlassCard className="p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <Brain className="text-primary" /> Flashcards Gerados
              </h3>
              <AnimatedButton onClick={saveFlashcards} variant="secondary" className="text-xs py-1 px-3">
                Salvar Todos
              </AnimatedButton>
            </div>
            <div className="grid gap-3">
              {result.flashcards.map((f: any, i: number) => (
                <div key={i} className="p-4 bg-white/5 rounded-xl border border-white/10">
                  <p className="font-bold text-sm text-primary">P: {f.front}</p>
                  <p className="text-sm text-text-secondary mt-1">R: {f.back}</p>
                </div>
              ))}
            </div>
          </GlassCard>

          <GlassCard className="p-6 border-primary/20 bg-primary/5">
            <h3 className="font-bold text-primary mb-2">Dica de Aprendizado</h3>
            <p className="text-sm">Revise estes flashcards em 24h para melhor retenção (Active Recall).</p>
          </GlassCard>
        </motion.div>
      )}
    </div>
  );
}
