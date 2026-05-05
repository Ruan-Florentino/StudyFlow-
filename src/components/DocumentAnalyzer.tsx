import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { UploadCloud, FileText, Loader2, ChevronLeft, Plus, CheckCircle2 } from 'lucide-react';
import { athenaClient } from '../features/athena/services/athenaClient';
import { useStore } from '../store';
import { GlassCard, AnimatedButton } from './UI';
import Markdown from 'react-markdown';

export const DocumentAnalyzer = ({ onBack }: { onBack: () => void }) => {
  const [file, setFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { addFlashcard, addNote } = useStore();
  const [saved, setSaved] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setResult(null);
      setError(null);
      setSaved(false);
    }
  };

  const handleAnalyze = async () => {
    if (!file) return;
    
    setIsAnalyzing(true);
    setError(null);
    
    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = (reader.result as string).split(',')[1];
        
        try {
          const prompt = `Analise o documento fornecido (Base64) e gere um resumo, tópicos e flashcards.
Como sou um modelo de texto, descreverei o que faria se processasse esse arquivo diretamente:
Retorne APENAS um JSON:
{
  "summary": "Resumo do documento...",
  "topics": ["Tópico 1", "Tópico 2"],
  "flashcards": [{"front": "Pergunta", "back": "Resposta"}]
}`;

          const response = await athenaClient.chat({
            messages: [
              { role: 'system', content: 'Você é um analisador de documentos educacionais. Retorne apenas JSON.' },
              { role: 'user', content: prompt }
            ],
            model: 'google/gemini-2.0-flash-001'
          });

          const cleanJson = response.replace(/```json|```/g, '').trim();
          const analysis = JSON.parse(cleanJson);
          setResult(analysis);
        } catch (err: any) {
          console.error("Analysis error:", err);
          setError("Falha ao analisar o documento com Athena.");
        } finally {
          setIsAnalyzing(false);
        }
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error("File read error:", err);
      setError("Erro ao ler o arquivo.");
      setIsAnalyzing(false);
    }
  };

  const handleSaveToStudyFlow = () => {
    if (!result) return;
    
    // Save as Note
    const noteContent = `# ${file?.name || 'Documento Analisado'}\n\n## Resumo\n${result.summary}\n\n## Tópicos Principais\n${result.topics.map((t: string) => `- ${t}`).join('\n')}`;
    addNote({
      id: Date.now().toString(),
      title: `Análise: ${file?.name || 'Documento'}`,
      content: noteContent,
      subject: 'Geral',
      updatedAt: new Date().toISOString()
    });

    // Save Flashcards
    if (result.flashcards && result.flashcards.length > 0) {
      result.flashcards.forEach((fc: any, index: number) => {
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
          level: 'Novo'
        });
      });
    }
    
    setSaved(true);
  };

  return (
    <div className="mx-auto w-full max-w-4xl px-4 md:px-8 pt-6 md:pt-8 space-y-6 pb-32 md:pb-36">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={onBack} className="p-2 hover:bg-white/10 rounded-full transition-colors">
          <ChevronLeft size={24} />
        </button>
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
            Análise de Documentos
          </h1>
          <p className="text-gray-400">Faça upload de PDFs ou Imagens para gerar resumos e flashcards com IA.</p>
        </div>
      </div>

      {!result && (
        <GlassCard className="p-8 text-center border-dashed border-2 border-primary/30 hover:border-primary/60 transition-colors">
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept="application/pdf,image/*" 
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
                <AnimatedButton onClick={handleAnalyze} disabled={isAnalyzing} className="mt-4">
                  {isAnalyzing ? (
                    <><Loader2 className="animate-spin" /> Analisando...</>
                  ) : (
                    <><UploadCloud /> Analisar Documento</>
                  )}
                </AnimatedButton>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-lg text-gray-300">Arraste um arquivo ou clique para selecionar</p>
                <AnimatedButton onClick={() => fileInputRef.current?.click()} variant="secondary">
                  Selecionar Arquivo
                </AnimatedButton>
                <p className="text-xs text-gray-500">Suporta PDF, JPG, PNG (Max 20MB)</p>
              </div>
            )}
            
            {error && (
              <p className="text-red-400 text-sm mt-4">{error}</p>
            )}
          </div>
        </GlassCard>
      )}

      {result && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Resultados da Análise</h2>
            <AnimatedButton onClick={handleSaveToStudyFlow} disabled={saved} variant={saved ? "secondary" : "primary"}>
              {saved ? <><CheckCircle2 /> Salvo no StudyFlow</> : <><Plus /> Salvar Resumo e Flashcards</>}
            </AnimatedButton>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <GlassCard className="p-6 space-y-4">
              <h3 className="text-xl font-semibold text-primary flex items-center gap-2">
                <FileText size={20} /> Resumo Geral
              </h3>
              <p className="text-gray-300 leading-relaxed">{result.summary}</p>
            </GlassCard>

            <GlassCard className="p-6 space-y-4">
              <h3 className="text-xl font-semibold text-purple-400 flex items-center gap-2">
                <FileText size={20} /> Tópicos Principais
              </h3>
              <ul className="space-y-2">
                {result.topics.map((topic: string, i: number) => (
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
              <FileText size={20} /> Flashcards Gerados ({result.flashcards.length})
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {result.flashcards.map((fc: any, i: number) => (
                <div key={i} className="p-4 bg-white/5 rounded-xl border border-white/10">
                  <p className="font-medium text-gray-200 mb-2">P: {fc.front}</p>
                  <p className="text-sm text-gray-400">R: {fc.back}</p>
                </div>
              ))}
            </div>
          </GlassCard>
          
          <div className="text-center pt-4">
             <AnimatedButton onClick={() => { setResult(null); setFile(null); }} variant="secondary">
                Analisar Outro Documento
             </AnimatedButton>
          </div>
        </motion.div>
      )}
    </div>
  );
};
