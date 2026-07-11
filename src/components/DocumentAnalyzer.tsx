import React, { useState, useRef, useCallback } from 'react';
import { motion } from 'motion/react';
import { UploadCloud, FileText, Loader2, ChevronLeft, Plus, CheckCircle2 } from 'lucide-react';
import { athenaClient } from '../features/athena/services/athenaClient';
import { DEFAULT_OPENROUTER_CHAT_MODEL } from '../config/openRouter';
import { useStore } from '../store';
import { GlassCard, AnimatedButton } from './UI';
import { toast } from '../store/useToastStore';

const MAX_FILE_MB = 20;

export const DocumentAnalyzer = ({ onBack }: { onBack: () => void }) => {
  const [file, setFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<{
    summary: string;
    topics: string[];
    flashcards: Array<{ front: string; back: string }>;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { addFlashcard, addNote } = useStore();
  const [saved, setSaved] = useState(false);

  const applyFile = useCallback((f: File | null) => {
    if (!f) return;
    const mb = f.size / (1024 * 1024);
    if (mb > MAX_FILE_MB) {
      const msg = `Arquivo muito grande (máx. ${MAX_FILE_MB} MB).`;
      setError(msg);
      toast.error('Documento', msg);
      return;
    }
    setFile(f);
    setResult(null);
    setError(null);
    setSaved(false);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) applyFile(e.target.files[0]);
  };

  const handleAnalyze = async () => {
    if (!file) return;

    setIsAnalyzing(true);
    setError(null);

    try {
      console.log('[ATHENA] Step 1: extraindo texto…', file.name, file.type);
      const { extractTextFromUserFile } = await import('../lib/extractDocumentText');
      const extracted = await extractTextFromUserFile(file);
      if (extracted.ok === false) {
        setError(extracted.message);
        toast.error('Documento', extracted.message);
        return;
      }

      const body = extracted.text;
      console.log('[ATHENA] Step 2: texto extraído, chars=', body.length);

      const prompt = `Analise o texto abaixo (extraído de um documento do usuário) e gere resumo, tópicos e flashcards educacionais.
Não invente conteúdo que não apareça no texto.

TEXTO:
"""
${body}
"""

Retorne APENAS um JSON válido (UTF-8), sem markdown:
{
  "summary": "Resumo do documento...",
  "topics": ["Tópico 1", "Tópico 2"],
  "flashcards": [{"front": "Pergunta", "back": "Resposta"}]
}`;

      const response = await athenaClient.chat({
        messages: [
          {
            role: 'system',
            content:
              'Você analisa textos educacionais com fidelidade ao conteúdo fornecido. Retorne somente JSON.',
          },
          { role: 'user', content: prompt },
        ],
        model: DEFAULT_OPENROUTER_CHAT_MODEL,
      });

      const cleanJson = response.replace(/```json|```/g, '').trim();
      let analysis: { summary?: string; topics?: string[]; flashcards?: Array<{ front: string; back: string }> };
      try {
        analysis = JSON.parse(cleanJson);
      } catch (parseErr) {
        console.error('[ATHENA] JSON inválido da IA:', parseErr, cleanJson.slice(0, 400));
        const msg = 'A IA retornou um formato inválido. Tente novamente ou use um arquivo menor.';
        setError(msg);
        toast.error('Análise', msg);
        return;
      }

      if (!analysis.summary || !Array.isArray(analysis.topics) || !Array.isArray(analysis.flashcards)) {
        const msg = 'Resposta da IA incompleta (faltam summary, topics ou flashcards).';
        setError(msg);
        toast.error('Análise', msg);
        return;
      }

      setResult({
        summary: analysis.summary,
        topics: analysis.topics,
        flashcards: analysis.flashcards,
      });
      toast.success('Documento', 'Análise concluída.');
    } catch (err: unknown) {
      console.error('[ATHENA] Analysis error:', err);
      const msg =
        err instanceof Error
          ? err.message.includes('fetch')
            ? 'Sem conexão ou serviço de IA indisponível. Tente de novo.'
            : err.message
          : 'Falha ao analisar o documento.';
      setError(msg);
      toast.error('Athena', msg);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSaveToAthena = () => {
    if (!result) return;

    const noteContent = `# ${file?.name || 'Documento Analisado'}\n\n## Resumo\n${result.summary}\n\n## Tópicos Principais\n${result.topics.map((t) => `- ${t}`).join('\n')}`;
    addNote({
      id: Date.now().toString(),
      title: `Análise: ${file?.name || 'Documento'}`,
      content: noteContent,
      subject: 'Geral',
      updatedAt: new Date().toISOString(),
    });

    if (result.flashcards?.length > 0) {
      result.flashcards.forEach((fc, index) => {
        addFlashcard({
          id: Date.now().toString() + index,
          deckId: 'default',
          front: fc.front,
          back: fc.back,
          nextReview: new Date().toISOString(),
          interval: 1,
          easeFactor: 2.5,
          repetitions: 0,
          subject: 'Geral',
          level: 'Novo',
        });
      });
    }

    setSaved(true);
    toast.success('Athena', 'Resumo e flashcards salvos.');
  };

  return (
    <div className="mx-auto w-full max-w-4xl px-4 md:px-8 pt-6 md:pt-8 space-y-6 pb-32 md:pb-36">
      <div className="flex items-center gap-4 mb-8">
        <button
          type="button"
          onClick={onBack}
          className="p-2 hover:bg-white/10 rounded-full transition-colors"
          aria-label="Voltar"
        >
          <ChevronLeft size={24} />
        </button>
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
            Análise de Documentos
          </h1>
          <p className="text-gray-400">
            PDF com texto selecionável ou .txt — a IA usa o conteúdo extraído (não o binário).
          </p>
        </div>
      </div>

      {!result && (
        <div
          role="presentation"
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            const f = e.dataTransfer.files?.[0];
            if (f) applyFile(f);
          }}
        >
        <GlassCard
          className={`p-8 text-center border-dashed border-2 transition-colors ${
            isDragging ? 'border-primary/80 bg-primary/5' : 'border-primary/30 hover:border-primary/60'
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="application/pdf,text/plain,.txt"
            className="hidden"
          />

          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="p-4 bg-primary/20 rounded-full text-primary">
              <FileText size={48} />
            </div>

            {file ? (
              <div className="space-y-2">
                <p className="text-xl font-medium">{file.name}</p>
                <p className="text-sm text-gray-400">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                <AnimatedButton type="button" onClick={() => void handleAnalyze()} disabled={isAnalyzing} className="mt-4">
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="animate-spin" /> Analisando…
                    </>
                  ) : (
                    <>
                      <UploadCloud /> Analisar documento
                    </>
                  )}
                </AnimatedButton>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-lg text-gray-300">Arraste um arquivo aqui ou clique para selecionar</p>
                <AnimatedButton type="button" onClick={() => fileInputRef.current?.click()} variant="secondary">
                  Selecionar arquivo
                </AnimatedButton>
                <p className="text-xs text-gray-500">PDF (texto) ou TXT · máx. {MAX_FILE_MB} MB</p>
              </div>
            )}

            {error && <p className="text-red-400 text-sm mt-4 max-w-lg mx-auto">{error}</p>}
          </div>
        </GlassCard>
        </div>
      )}

      {result && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div className="flex justify-between items-center flex-wrap gap-3">
            <h2 className="text-2xl font-bold">Resultados da análise</h2>
            <AnimatedButton
              type="button"
              onClick={handleSaveToAthena}
              disabled={saved}
              variant={saved ? 'secondary' : 'primary'}
            >
              {saved ? (
                <>
                  <CheckCircle2 /> Salvo na Athena
                </>
              ) : (
                <>
                  <Plus /> Salvar resumo e flashcards
                </>
              )}
            </AnimatedButton>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <GlassCard className="p-6 space-y-4">
              <h3 className="text-xl font-semibold text-primary flex items-center gap-2">
                <FileText size={20} /> Resumo geral
              </h3>
              <p className="text-gray-300 leading-relaxed">{result.summary}</p>
            </GlassCard>

            <GlassCard className="p-6 space-y-4">
              <h3 className="text-xl font-semibold text-purple-400 flex items-center gap-2">
                <FileText size={20} /> Tópicos principais
              </h3>
              <ul className="space-y-2">
                {result.topics.map((topic, i) => (
                  <li key={i} className="flex items-start gap-2 text-gray-300">
                    <span className="text-purple-400 mt-1">•</span>
                    <span>{topic}</span>
                  </li>
                ))}
              </ul>
            </GlassCard>
          </div>

          <GlassCard className="p-6 space-y-4">
            <h3 className="text-xl font-semibold text-green-400 flex items-center gap-2">
              <FileText size={20} /> Flashcards gerados ({result.flashcards.length})
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {result.flashcards.map((fc, i) => (
                <div key={i} className="p-4 bg-white/5 rounded-xl border border-white/10">
                  <p className="font-medium text-gray-200 mb-2">P: {fc.front}</p>
                  <p className="text-sm text-gray-400">R: {fc.back}</p>
                </div>
              ))}
            </div>
          </GlassCard>

          <div className="text-center pt-4">
            <AnimatedButton
              type="button"
              onClick={() => {
                setResult(null);
                setFile(null);
                setSaved(false);
                setError(null);
              }}
              variant="secondary"
            >
              Analisar outro documento
            </AnimatedButton>
          </div>
        </motion.div>
      )}
    </div>
  );
};
