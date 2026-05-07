import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'motion/react';
import { PenTool, FileText, Bookmark, ChevronLeft, Sparkles, CheckCircle2, AlertCircle, Bot } from 'lucide-react';
import { GlassCard, Header, IconTile } from './UI';
import { useStore } from '../store';
import { athenaClient } from '../features/athena/services/athenaClient';
import { DEFAULT_OPENROUTER_CHAT_MODEL } from '../config/openRouter';
import { ATHENA_CONFIG } from '../features/athena/constants/config';
import { exportToPDF } from '../lib/studyUtils';
import clsx from 'clsx';
import { AthenaChat } from '../features/athena/components/AthenaChat';
import { REDACAO_SYSTEM_PROMPT } from '../features/athena/prompts/systemPrompts';
import { buildEssayHistoryDigestForPrompt } from '../lib/historyAiDigest';
// import { useAIUI } from '../hooks/useAIUI'; // Deleted

const PROPOSTAS = [
  { tema: "Desafios para a formação educacional de surdos no Brasil", ano: "ENEM 2017" },
  { tema: "Manipulação do comportamento do usuário pelo controle de dados na internet", ano: "ENEM 2018" },
  { tema: "Democratização do acesso ao cinema no Brasil", ano: "ENEM 2019" },
  { tema: "O estigma associado às doenças mentais na sociedade brasileira", ano: "ENEM 2020" },
  { tema: "Invisibilidade e registro civil: garantia de acesso à cidadania no Brasil", ano: "ENEM 2021" },
  { tema: "Desafios para a valorização de comunidades e povos tradicionais no Brasil", ano: "ENEM 2022" },
  { tema: "Desafios para o enfrentamento da invisibilidade do trabalho de cuidado realizado pela mulher", ano: "ENEM 2023" },
  { tema: "Persistência da violência contra a mulher na sociedade brasileira", ano: "ENEM 2015" },
  { tema: "Caminhos para combater a intolerância religiosa no Brasil", ano: "ENEM 2016" },
  { tema: "Publicidade infantil em questão no Brasil", ano: "ENEM 2014" },
  { tema: "Efeitos da implantação da Lei Seca no Brasil", ano: "ENEM 2013" },
  { tema: "Movimento imigratório para o Brasil no século XXI", ano: "ENEM 2012" },
  { tema: "Viver em rede no século XXI: limites entre o público e o privado", ano: "ENEM 2011" },
  { tema: "Trabalho na construção da dignidade humana", ano: "ENEM 2010" },
  { tema: "O indivíduo frente à ética nacional", ano: "ENEM 2009" },
  { tema: "Como preservar a floresta amazônica", ano: "ENEM 2008" },
  { tema: "O desafio de se conviver com a diferença", ano: "ENEM 2007" },
  { tema: "O poder de transformação da leitura", ano: "ENEM 2006" },
  { tema: "O trabalho infantil na sociedade brasileira", ano: "ENEM 2005" },
  { tema: "Como garantir liberdade de informação e evitar abusos nos meios de comunicação", ano: "ENEM 2004" },
  { tema: "A violência na sociedade brasileira: como mudar as regras desse jogo", ano: "ENEM 2003" },
  { tema: "Direitos da criança e do adolescente", ano: "ENEM 2002" },
  { tema: "Desenvolvimento e preservação ambiental", ano: "ENEM 2001" },
  { tema: "Cidadania e participação social no Brasil", ano: "ENEM 2000" },
  { tema: "Desafios da mobilidade urbana no Brasil", ano: "Tema Recorrente ENEM" },
  { tema: "Inclusão digital e desigualdade social no Brasil", ano: "Tema Recorrente ENEM" },
  { tema: "Educação como ferramenta de transformação social", ano: "Tema Recorrente ENEM" },
  { tema: "Desafios da saúde pública no Brasil", ano: "Tema Recorrente ENEM" },
  { tema: "Impactos das redes sociais na sociedade", ano: "Tema Recorrente ENEM" },
  { tema: "Segurança alimentar e desigualdade social no Brasil", ano: "Tema Recorrente ENEM" }
];

export const Redacao = ({ onBack }: { onBack: () => void }) => {
  const { essays, savedTopics, addEssay, toggleSavedTopic, essayCoPilot, toggleEssayCoPilot, addEssaySuggestion, clearEssaySuggestions } = useStore();
  // const { openChat } = useAIUI(); // Removed
  const [view, setView] = useState<'home' | 'write' | 'history' | 'saved'>('home');
  const [selectedProposta, setSelectedProposta] = useState<string | null>(null);
  const [essayText, setEssayText] = useState('');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState<any>(null);
  const [isSuggesting, setIsSuggesting] = useState(false);

  const essayHistorySystemPrompt = useMemo(() => {
    const digest = buildEssayHistoryDigestForPrompt(essays);
    return `${REDACAO_SYSTEM_PROMPT}

## Histórico de redações do aluno (dados reais do app)
Personalize sugestões com base neste histórico. Não invente redações que não estejam listadas.

${digest}`;
  }, [essays]);

  const handleGetSuggestions = async () => {
    if (!essayText.trim() || !selectedProposta || isSuggesting) return;
    setIsSuggesting(true);
    try {
      const prompt = `Como um Co-Pilot de redação, analise o texto atual e sugira 3 melhorias pontuais (conectivos, vocabulário ou clareza).
Tema: ${selectedProposta}
Texto: ${essayText}
Retorne APENAS um JSON: [{"id": "1", "type": "vocabulário", "text": "melhoria..."}]`;

      const response = await athenaClient.chat({
        messages: [
          { role: 'system', content: 'Você é um assistente de escrita de redação. Retorne apenas JSON.' },
          { role: 'user', content: prompt }
        ],
        model: DEFAULT_OPENROUTER_CHAT_MODEL
      });

      const cleanJson = response.replace(/```json|```/g, '').trim();
      const res = JSON.parse(cleanJson);
      clearEssaySuggestions();
      res.forEach((s: any) => addEssaySuggestion(s));
    } catch (error) {
      console.error(error);
    } finally {
      setIsSuggesting(false);
    }
  };

  useEffect(() => {
    if (essayCoPilot.enabled && essayText.length > 100 && essayText.length % 50 === 0) {
      handleGetSuggestions();
    }
  }, [essayText.length, essayCoPilot.enabled]);

  const handleEvaluate = async () => {
    if (!essayText.trim() || !selectedProposta) return;
    
    const { trackFeature } = useStore.getState();
    trackFeature('redacao');

    setIsEvaluating(true);
    try {
      const prompt = `Avalie a seguinte redação com base nos critérios do ENEM (Competências 1 a 5, valendo 200 pontos cada, total 1000).
Tema: ${selectedProposta}
Redação:
${essayText}

Retorne APENAS um JSON válido com a seguinte estrutura:
{
  "notaTotal": número,
  "competencias": {
    "c1": { "nota": número, "comentario": "string" },
    "c2": { "nota": número, "comentario": "string" },
    "c3": { "nota": número, "comentario": "string" },
    "c4": { "nota": número, "comentario": "string" },
    "c5": { "nota": número, "comentario": "string" }
  },
  "pontosFortes": ["string"],
  "pontosMelhoria": ["string"],
  "feedbackGeral": "string"
}`;

      const response = await athenaClient.chat({
        messages: [
          { role: 'system', content: 'Você é um corretor especializado em redação ENEM. Retorne apenas JSON.' },
          { role: 'user', content: prompt }
        ],
        model: DEFAULT_OPENROUTER_CHAT_MODEL // Fast and smart for evaluation
      });

      const cleanJson = response.replace(/```json|```/g, '').trim();
      const result = JSON.parse(cleanJson);
      setEvaluation(result);
      
      addEssay({
        id: Date.now().toString(),
        topicId: selectedProposta,
        topicTitle: selectedProposta,
        content: essayText,
        date: new Date().toISOString(),
        score: result.notaTotal,
        feedback: {
          c1: result.competencias.c1.nota,
          c2: result.competencias.c2.nota,
          c3: result.competencias.c3.nota,
          c4: result.competencias.c4.nota,
          c5: result.competencias.c5.nota,
          grammarErrors: [],
          coherence: result.competencias.c3.comentario,
          argumentation: result.competencias.c2.comentario,
          conclusion: result.competencias.c5.comentario,
          suggestions: result.pontosMelhoria
        }
      });
    } catch (error) {
      console.error("❌ Erro ao avaliar redação:", error);
    } finally {
      setIsEvaluating(false);
    }
  };

  if (view === 'write' && selectedProposta) {
    return (
      <div className="app-shell-premium pt-6 md:pt-8 space-y-6 pb-32 md:pb-36 h-full flex flex-col">
        <Header 
          title="Escrever"
          subtitle="Redação"
          icon={PenTool}
          color="rose"
          onBack={() => { setView('home'); setEvaluation(null); setEssayText(''); }}
          className="shrink-0 mb-2"
          rightContent={
            <button 
              onClick={toggleEssayCoPilot}
              className={clsx(
                "p-2 rounded-xl border transition-all flex items-center gap-2",
                essayCoPilot.enabled ? "bg-primary/10 border-primary/30 text-primary shadow-[0_0_10px_rgba(0,232,143,0.2)]" : "bg-white/5 border-white/10 text-text-secondary"
              )}
            >
              <Sparkles size={16} />
              <span className="text-[10px] font-bold uppercase tracking-widest">Co-Pilot</span>
            </button>
          }
        />

        <GlassCard className="p-4 border-white/5 shrink-0">
          <p className="text-[10px] font-premium-mono text-text-secondary uppercase tracking-widest mb-1">Tema Proposto</p>
          <p className="font-bold text-sm">{selectedProposta}</p>
        </GlassCard>

        {!evaluation ? (
          <div className="flex-1 flex flex-col gap-4 min-h-0">
            <div className="relative flex-1 flex flex-col">
              <textarea
                value={essayText}
                onChange={(e) => setEssayText(e.target.value)}
                placeholder="Escreva sua redação aqui..."
                className="flex-1 w-full bg-black/20 border border-white/10 rounded-2xl p-4 pb-10 text-sm resize-none focus:outline-none focus:border-primary/50 transition-colors"
              />
              
              {essayCoPilot.enabled && essayCoPilot.suggestions.length > 0 && (
                <div className="absolute top-4 right-4 w-48 space-y-2 pointer-events-none">
                  {essayCoPilot.suggestions.map((s) => (
                    <motion.div 
                      key={s.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="p-2 bg-black/80 border border-primary/30 rounded-lg backdrop-blur-md pointer-events-auto"
                    >
                      <div className="flex items-center gap-1 mb-1">
                        <Sparkles size={10} className="text-primary" />
                        <span className="text-[8px] font-bold uppercase text-primary">{s.type}</span>
                      </div>
                      <p className="text-[10px] text-white leading-tight">{s.text}</p>
                    </motion.div>
                  ))}
                </div>
              )}

              <div className="absolute bottom-4 right-4 text-[10px] font-premium-mono font-bold text-text-secondary bg-black/50 px-2 py-1 rounded-lg backdrop-blur-sm">
                {essayText.trim().split(/\s+/).filter(w => w.length > 0).length} palavras
              </div>
            </div>
            <button
              onClick={handleEvaluate}
              disabled={isEvaluating || essayText.length < 50}
              className="w-full py-4 rounded-2xl bg-primary text-black font-bold flex items-center justify-center gap-2 disabled:opacity-50 transition-all shrink-0"
            >
              {isEvaluating ? (
                <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
              ) : (
                <>
                  <Sparkles size={20} />
                  AVALIAR COM IA
                </>
              )}
            </button>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto no-scrollbar space-y-6" id="redacao-evaluation">
            <div className="flex justify-end mb-4" data-html2canvas-ignore>
              <button 
                onClick={() => exportToPDF('redacao-evaluation', 'Avaliacao_Redacao')}
                className="px-4 py-2 bg-white/5 rounded-xl border border-white/10 text-xs font-bold hover:bg-white/10 transition-colors flex items-center gap-2"
              >
                <FileText size={14} />
                Salvar PDF
              </button>
            </div>
            <GlassCard className="p-6 border-primary/20 bg-primary/5 text-center" glow>
              <p className="text-xs font-premium-mono text-primary uppercase tracking-widest mb-2">Nota Final ENEM</p>
              <p className="text-6xl font-premium-title text-primary">{evaluation.notaTotal}</p>
              <p className="text-[10px] text-text-secondary mt-2">/ 1000 pontos</p>
            </GlassCard>

            <div className="space-y-3">
              <h3 className="text-sm font-bold uppercase tracking-widest">Competências</h3>
              {[1, 2, 3, 4, 5].map((num) => {
                const comp = evaluation.competencias[`c${num}`];
                return (
                  <GlassCard key={num} className="p-4 border-white/5">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs font-bold text-text-secondary">Competência {num}</span>
                      <span className="text-sm font-premium-mono font-bold text-primary">{comp.nota} <span className="text-[10px] text-text-secondary">/ 200</span></span>
                    </div>
                    <p className="text-xs text-text-secondary leading-relaxed">{comp.comentario}</p>
                  </GlassCard>
                );
              })}
            </div>

            <div className="grid grid-cols-1 gap-4">
              <GlassCard className="p-4 border-green-500/20 bg-green-500/5">
                <div className="flex items-center gap-2 mb-3 text-green-500">
                  <CheckCircle2 size={16} />
                  <h4 className="text-xs font-bold uppercase tracking-widest">Pontos Fortes</h4>
                </div>
                <ul className="space-y-2">
                  {evaluation.pontosFortes?.map((p: string, i: number) => (
                    <li key={i} className="text-xs text-text-secondary flex items-start gap-2">
                      <span className="text-green-500 mt-0.5">•</span> {p}
                    </li>
                  ))}
                </ul>
              </GlassCard>

              <GlassCard className="p-4 border-orange-500/20 bg-orange-500/5">
                <div className="flex items-center gap-2 mb-3 text-orange-500">
                  <AlertCircle size={16} />
                  <h4 className="text-xs font-bold uppercase tracking-widest">Para Melhorar</h4>
                </div>
                <ul className="space-y-2">
                  {evaluation.pontosMelhoria?.map((p: string, i: number) => (
                    <li key={i} className="text-xs text-text-secondary flex items-start gap-2">
                      <span className="text-orange-500 mt-0.5">•</span> {p}
                    </li>
                  ))}
                </ul>
              </GlassCard>
            </div>

            <GlassCard className="p-5 border-white/10">
              <h4 className="text-xs font-bold uppercase tracking-widest mb-2 text-primary">Feedback Geral</h4>
              <p className="text-sm text-text-secondary leading-relaxed">{evaluation.feedbackGeral}</p>
            </GlassCard>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="app-shell-premium pt-6 md:pt-8 app-stack-premium pb-32 md:pb-36">
      <Header 
        title="Redação"
        subtitle="Treino"
        icon={PenTool}
        color="rose"
        onBack={onBack}
        rightContent={
          <div className="flex items-center gap-2">
            <div className="text-[9px] font-bold text-white/20 uppercase tracking-widest mr-2">Powered by Athena</div>
            <button 
              className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold text-[10px] uppercase tracking-widest shadow-[0_0_15px_rgba(16,185,129,0.1)]"
            >
              Protocolo V2
            </button>
          </div>
        }
      />

      <div className="grid grid-cols-3 gap-3">
        <button 
          onClick={() => setView('home')}
          className={clsx(
            "p-3 rounded-2xl border flex flex-col items-center gap-2 transition-all",
            view === 'home' ? 'bg-primary/10 border-primary/30 text-primary' : 'bg-white/5 border-white/10 text-text-secondary hover:bg-white/10'
          )}
        >
          <PenTool size={20} />
          <span className="text-[10px] font-bold uppercase tracking-wider">Treinar</span>
        </button>
        <button 
          onClick={() => setView('history')}
          className={clsx(
            "p-3 rounded-2xl border flex flex-col items-center gap-2 transition-all",
            view === 'history' ? 'bg-primary/10 border-primary/30 text-primary' : 'bg-white/5 border-white/10 text-text-secondary hover:bg-white/10'
          )}
        >
          <FileText size={20} />
          <span className="text-[10px] font-bold uppercase tracking-wider">Minhas</span>
        </button>
        <button 
          onClick={() => setView('saved')}
          className={clsx(
            "p-3 rounded-2xl border flex flex-col items-center gap-2 transition-all",
            view === 'saved' ? 'bg-primary/10 border-primary/30 text-primary' : 'bg-white/5 border-white/10 text-text-secondary hover:bg-white/10'
          )}
        >
          <Bookmark size={20} />
          <span className="text-[10px] font-bold uppercase tracking-wider">Salvos</span>
        </button>
      </div>

      {view === 'home' && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-1 h-4 bg-primary rounded-full" />
            <h3 className="text-xs font-premium-mono font-bold text-text-secondary uppercase tracking-[0.2em]">Propostas de Redação</h3>
          </div>
          
          <div className="space-y-3">
            {PROPOSTAS.map((proposta, idx) => (
              <GlassCard key={idx} className="p-4 border-white/5 hover:border-primary/30 transition-colors group cursor-pointer" onClick={() => { setSelectedProposta(proposta.tema); setView('write'); }}>
                <div className="flex gap-4 items-center">
                  <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center font-premium-mono text-xs text-text-secondary group-hover:bg-primary/20 group-hover:text-primary transition-colors">
                    {idx + 1}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium group-hover:text-white transition-colors">{proposta.tema}</p>
                    <p className="text-[10px] text-primary/70 mt-1 uppercase tracking-wider">{proposta.ano}</p>
                  </div>
                  <button 
                    onClick={(e) => { e.stopPropagation(); toggleSavedTopic(proposta.tema); }}
                    className={clsx("p-2 rounded-xl transition-colors", savedTopics.includes(proposta.tema) ? "text-primary bg-primary/10" : "text-text-secondary hover:bg-white/10")}
                  >
                    <Bookmark size={16} fill={savedTopics.includes(proposta.tema) ? "currentColor" : "none"} />
                  </button>
                  <ChevronLeft size={16} className="text-text-secondary rotate-180 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      )}

      {view === 'history' && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-1 h-4 bg-primary rounded-full" />
            <h3 className="text-xs font-premium-mono font-bold text-text-secondary uppercase tracking-[0.2em]">Minhas Redações</h3>
          </div>
          {essays.length === 0 ? (
            <GlassCard className="p-8 flex flex-col items-center justify-center text-center border-white/5">
              <FileText size={48} className="text-text-secondary mb-4 opacity-50" />
              <p className="text-text-secondary">Você ainda não escreveu nenhuma redação.</p>
            </GlassCard>
          ) : (
            <div className="space-y-3">
              {essays.map((essay) => (
                <GlassCard key={essay.id} className="p-4 border-white/5">
                  <div className="flex justify-between items-start mb-2">
                    <p className="font-bold text-sm flex-1">{essay.topicTitle}</p>
                    <span className="text-primary font-premium-mono font-bold">{essay.score}</span>
                  </div>
                  <p className="text-xs text-text-secondary">{new Date(essay.date).toLocaleDateString('pt-BR')}</p>
                </GlassCard>
              ))}
            </div>
          )}

          <div className="pt-2">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-1 h-4 bg-primary rounded-full" />
              <h3 className="text-xs font-premium-mono font-bold text-text-secondary uppercase tracking-[0.2em]">
                Athena · seu histórico de redações
              </h3>
            </div>
            <div className="min-h-[min(55vh,480px)]">
              <AthenaChat
                compact
                sidebarInCompact
                context="redacao"
                systemPrompt={essayHistorySystemPrompt}
                greeting="Quer evoluir com base nas suas redações?"
                placeholder="Ex.: onde mais errei nas competências?"
                showSidebar={false}
              />
            </div>
          </div>
        </div>
      )}

      {view === 'saved' && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-1 h-4 bg-primary rounded-full" />
            <h3 className="text-xs font-premium-mono font-bold text-text-secondary uppercase tracking-[0.2em]">Temas Salvos</h3>
          </div>
          {savedTopics.length === 0 ? (
            <GlassCard className="p-8 flex flex-col items-center justify-center text-center border-white/5">
              <Bookmark size={48} className="text-text-secondary mb-4 opacity-50" />
              <p className="text-text-secondary">Você ainda não salvou nenhum tema.</p>
            </GlassCard>
          ) : (
            <div className="space-y-3">
              {savedTopics.map((topic, idx) => (
                <GlassCard key={idx} className="p-4 border-white/5 hover:border-primary/30 transition-colors group cursor-pointer" onClick={() => { setSelectedProposta(topic); setView('write'); }}>
                  <div className="flex gap-4 items-center">
                    <button 
                      onClick={(e) => { e.stopPropagation(); toggleSavedTopic(topic); }}
                      className="text-primary bg-primary/10 p-2 rounded-xl"
                    >
                      <Bookmark size={16} fill="currentColor" />
                    </button>
                    <p className="flex-1 text-sm font-medium group-hover:text-white transition-colors">{topic}</p>
                    <ChevronLeft size={16} className="text-text-secondary rotate-180 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </GlassCard>
              ))}
            </div>
          )}
        </div>
      )}


    </div>
  );
};
