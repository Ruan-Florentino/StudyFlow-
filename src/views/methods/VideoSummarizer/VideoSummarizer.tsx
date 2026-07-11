import { useCallback, useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Loader2, Sparkles, FileText, Layers, Brain } from 'lucide-react';
import { useStore } from '../../../store';
import { athenaClient } from '../../../features/athena/services/athenaClient';
import { DEFAULT_OPENROUTER_CHAT_MODEL } from '../../../config/openRouter';
import { AnimatedButton, GlassCard } from '../../../components/UI';
import { triggerConfetti } from '../../../lib/studyUtils';
import { extractYoutubeVideoId } from '../../../lib/youtubeVideoId';
import { toast } from '../../../store/useToastStore';
import { useNavigate } from 'react-router-dom';
import { isSupabaseConfigured, supabase } from '../../../lib/supabase';

interface VideoSummarizerProps {
  /** Se omitido (rota direta), usa navigate(-1) ou /metodos */
  onBack?: () => void;
}

const TRANSCRIPT_PREVIEW = 24_000;

export function VideoSummarizer({ onBack: onBackProp }: VideoSummarizerProps) {
  const navigate = useNavigate();
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{
    summary: string;
    topics: string[];
    flashcards: Array<{ front: string; back: string }>;
  } | null>(null);
  const { addFlashcard, addXP } = useStore();
  const abortRef = useRef<AbortController | null>(null);
  const requestIdRef = useRef(0);

  useEffect(() => {
    setResult(null);
    setError(null);
  }, [url]);

  const goBack = useCallback(() => {
    if (onBackProp) {
      onBackProp();
      return;
    }
    if (typeof window !== 'undefined' && window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/metodos');
    }
  }, [navigate, onBackProp]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') goBack();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [goBack]);

  const handleBack = useCallback(() => {
    abortRef.current?.abort();
    goBack();
  }, [goBack]);

  const handleSummarize = async () => {
    const videoId = extractYoutubeVideoId(url);
    if (!videoId) {
      setError('Cole uma URL válida do YouTube (watch, youtu.be ou shorts).');
      toast.error('Vídeo', 'URL do YouTube inválida.');
      return;
    }

    abortRef.current?.abort();
    const ac = new AbortController();
    abortRef.current = ac;
    const myId = ++requestIdRef.current;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const headers: HeadersInit = {};
      if (isSupabaseConfigured) {
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        if (sessionError || !sessionData.session?.access_token) {
          throw new Error('Faça login para usar o resumidor de vídeo.');
        }
        headers.Authorization = `Bearer ${sessionData.session.access_token}`;
      }
      const trRes = await fetch(`/api/youtube-transcript?v=${encodeURIComponent(videoId)}`, {
        headers,
        signal: ac.signal,
      });
      const trJson = (await trRes.json().catch(() => ({}))) as { transcript?: string; error?: string };

      if (!trRes.ok) {
        const msg =
          typeof trJson.error === 'string'
            ? trJson.error
            : 'Não foi possível obter legendas deste vídeo.';
        setError(msg);
        toast.error('Legendas', msg);
        return;
      }

      const transcript = typeof trJson.transcript === 'string' ? trJson.transcript.trim() : '';
      if (!transcript || transcript.length < 40) {
        const msg = 'Transcrição muito curta ou vazia — não dá para resumir com fidelidade.';
        setError(msg);
        toast.error('Legendas', msg);
        return;
      }

      const forModel =
        transcript.length > TRANSCRIPT_PREVIEW
          ? `${transcript.slice(0, TRANSCRIPT_PREVIEW)}\n\n[… trecho omitido; vídeo longo …]`
          : transcript;

      const prompt = `Você recebeu a TRANSCRIÇÃO (legendas) de um vídeo do YouTube. Resuma APENAS com base neste texto — não invente temas que não apareçam.
Id do vídeo: ${videoId}

TRANSCRIÇÃO:
"""
${forModel}
"""

Retorne APENAS um JSON válido (UTF-8), sem markdown:
{
  "summary": "Resumo fiel ao conteúdo acima...",
  "topics": ["Tópico 1", "Tópico 2"],
  "flashcards": [{"front": "Pergunta", "back": "Resposta"}]
}`;

      console.log(`[VIDEO_SUMMARY] videoId=${videoId} transcriptChars=${transcript.length} promptChars=${prompt.length}`);

      const response = await athenaClient.chat({
        messages: [
          {
            role: 'system',
            content:
              'Você resume transcrições de vídeos educacionais com fidelidade. Retorne somente JSON, sem texto fora do objeto.',
          },
          { role: 'user', content: prompt },
        ],
        model: DEFAULT_OPENROUTER_CHAT_MODEL,
        signal: ac.signal,
      });

      if (myId !== requestIdRef.current) return;

      const cleanJson = response.replace(/```json|```/g, '').trim();
      const data = JSON.parse(cleanJson) as {
        summary?: string;
        topics?: string[];
        flashcards?: Array<{ front: string; back: string }>;
      };

      if (!data.summary || !Array.isArray(data.topics) || !Array.isArray(data.flashcards)) {
        throw new Error('Resposta da IA em formato inesperado.');
      }

      setResult({
        summary: data.summary,
        topics: data.topics,
        flashcards: data.flashcards,
      });
      addXP(50);
    } catch (e: unknown) {
      if (e instanceof DOMException && e.name === 'AbortError') return;
      console.error('[VIDEO_SUMMARY]', e);
      const msg =
        e instanceof SyntaxError
          ? 'A IA não retornou JSON válido. Tente de novo.'
          : e instanceof Error
            ? e.message
            : 'Falha ao gerar resumo.';
      setError(msg);
      toast.error('Resumo', msg);
    } finally {
      if (myId === requestIdRef.current) setLoading(false);
    }
  };

  const saveFlashcards = () => {
    if (!result) return;
    result.flashcards.forEach((f) => {
      addFlashcard({
        id: Math.random().toString(36).substr(2, 9),
        front: f.front,
        back: f.back,
        subject: 'Vídeo Resumo',
        deckId: 'video-summaries',
        level: 'Novo',
        interval: 0,
        nextReview: new Date().toISOString(),
      });
    });
    triggerConfetti();
    toast.success('Flashcards', 'Salvos no deck Vídeo Resumo.');
  };

  return (
    <div className="app-shell-premium pt-6 md:pt-8 app-stack-premium pb-32 md:pb-36 animate-in slide-in-from-right duration-500">
      <header className="flex items-center gap-4 relative z-20">
        <AnimatedButton
          type="button"
          onClick={handleBack}
          variant="secondary"
          className="p-2 rounded-full"
          aria-label="Voltar"
        >
          <ArrowLeft size={20} />
        </AnimatedButton>
        <h2 className="text-2xl font-premium-title italic">
          Resumidor de Vídeo<span className="text-primary font-normal not-italic ml-1">.</span>
        </h2>
      </header>

      <GlassCard className="p-6 space-y-4">
        <div className="space-y-2">
          <label className="text-xs font-premium-mono font-bold text-text-secondary uppercase tracking-widest">
            URL do YouTube
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://youtube.com/watch?v=..."
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary/50 transition-colors"
            />
            <AnimatedButton
              type="button"
              onClick={() => void handleSummarize()}
              disabled={loading}
              className="bg-primary text-black border-primary px-6"
            >
              {loading ? <Loader2 className="animate-spin" /> : <Sparkles size={20} />}
            </AnimatedButton>
          </div>
          <p className="text-[10px] text-text-secondary/80">
            Usamos as legendas públicas do vídeo. Sem legenda acessível, o resumo não pode ser gerado.
          </p>
          {error && <p className="text-sm text-red-400">{error}</p>}
        </div>
      </GlassCard>

      {result && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
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
              {result.topics.map((t, i) => (
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
              <AnimatedButton type="button" onClick={saveFlashcards} variant="secondary" className="text-xs py-1 px-3">
                Salvar Todos
              </AnimatedButton>
            </div>
            <div className="grid gap-3">
              {result.flashcards.map((f, i) => (
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
