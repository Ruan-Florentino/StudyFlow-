import React, { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { staggerContainer, staggerItem } from '../../lib/animations/variants';
import { easings, springs } from '../../lib/animations/easings';
import { Search, BookOpen, Sparkles, ChevronRight, Target, Zap, Clock, Star, Loader2, Trash2 } from 'lucide-react';
import { GlassCard, AnimatedButton, Badge } from '../../components/UI';
import { SUBJECTS, RECOMMENDED_TRAILS, POPULAR_NOW, SUBTOPIC_SURPRISE } from '../../data/explore';
import { useStore } from '../../store';
import { useAITrailsStore } from '../../store/useAITrailsStore';
import { aiService } from '../../services/aiService';
import { buildExploreTrailContext } from '../../lib/aiExploreTrail';
import { useSearch, SearchResult } from '../../hooks/useSearch';
import { SUBJECT_ICONS } from '../../data/topics';
import SearchDropdown from '../../components/Explore/SearchDropdown';
import SortResult from '../../components/Explore/SortResult';
import { useAppNavigation } from '../../app/router/useAppNavigation';

function parseLocalYmd(ymd: string): Date {
  const dayPart = ymd.split('T')[0];
  const p = dayPart.split('-').map(Number);
  return new Date(p[0], p[1] - 1, p[2]);
}

/** Agrega minutos por `subject` em sessões cujo `date` está a `minDiff`..`maxDiff` dias atrás (0 = hoje). */
function minutesBySubjectInDayRange(
  sessions: { date: string; duration: number; subject: string }[],
  minDiff: number,
  maxDiff: number
): Record<string, number> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const map: Record<string, number> = {};
  for (const s of sessions) {
    if (!s?.date || !s?.subject) continue;
    const d0 = parseLocalYmd(s.date);
    const diffDays = Math.round((today.getTime() - d0.getTime()) / 86400000);
    if (diffDays < minDiff || diffDays > maxDiff) continue;
    const key = s.subject.trim();
    map[key] = (map[key] || 0) + Math.max(0, Number(s.duration) || 0);
  }
  return map;
}

function topSubjectFromMap(map: Record<string, number>): { subject: string; minutes: number } | null {
  let best: { subject: string; minutes: number } | null = null;
  for (const [subject, minutes] of Object.entries(map)) {
    if (minutes <= 0) continue;
    if (!best || minutes > best.minutes || (minutes === best.minutes && subject < best.subject)) {
      best = { subject, minutes };
    }
  }
  return best;
}

const ExploreView: React.FC = () => {
  const { goTo } = useAppNavigation();
  const { setNavFilters, sessions, history } = useStore();
  const aiTrails = useAITrailsStore((s) => s.aiTrails);
  const addAiTrail = useAITrailsStore((s) => s.addAiTrail);
  const removeAiTrail = useAITrailsStore((s) => s.removeAiTrail);
  const reduceMotion = useReducedMotion() ?? false;

  const [searchQuery, setSearchQuery] = useState('');
  const [trailPrompt, setTrailPrompt] = useState('');
  const [trailGenLoading, setTrailGenLoading] = useState(false);
  const [trailGenError, setTrailGenError] = useState<string | null>(null);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [isSorting, setIsSorting] = useState(false);
  const [sortResult, setSortResult] = useState<{
    area: string;
    subtopic: string;
    icon: string;
  } | null>(null);

  const { results: searchResults, isSearching } = useSearch(searchQuery);

  const trailContextSummary = useMemo(() => buildExploreTrailContext(history || []), [history]);

  const handleGenerateAiTrail = async () => {
    const p = trailPrompt.trim();
    if (!p || trailGenLoading) return;
    setTrailGenLoading(true);
    setTrailGenError(null);
    try {
      const trail = await aiService.generateExploreTrail(p, trailContextSummary);
      addAiTrail(trail);
      setTrailPrompt('');
    } catch (e) {
      setTrailGenError(e instanceof Error ? e.message : 'Não foi possível gerar a trilha.');
    } finally {
      setTrailGenLoading(false);
    }
  };

  const weekHighlight = useMemo(() => {
    const thisWeek = minutesBySubjectInDayRange(sessions || [], 0, 6);
    const prevWeek = minutesBySubjectInDayRange(sessions || [], 7, 13);
    const top = topSubjectFromMap(thisWeek);
    if (!top) {
      return { kind: 'empty' as const };
    }
    const prevMin = prevWeek[top.subject] ?? 0;
    let pctVsPrev: number | null = null;
    if (prevMin > 0) {
      pctVsPrev = Math.round(((top.minutes - prevMin) / prevMin) * 100);
    } else if (top.minutes > 0) {
      pctVsPrev = null;
    }
    return { kind: 'data' as const, ...top, prevMin, pctVsPrev };
  }, [sessions]);

  const handleSort = useCallback(() => {
    setIsSorting(true);
    setSortResult(null);

    setTimeout(() => {
      const areas = Object.keys(SUBTOPIC_SURPRISE);
      const area = areas[Math.floor(Math.random() * areas.length)];
      const list = SUBTOPIC_SURPRISE[area];
      const subtopic = list[Math.floor(Math.random() * list.length)];
      setSortResult({
        area,
        subtopic,
        icon: SUBJECT_ICONS[area] || '📖',
      });
      setIsSorting(false);
    }, 900);
  }, []);

  const handleSearchResultSelect = (result: SearchResult) => {
    setSearchQuery('');
    setShowSearchDropdown(false);

    if (result.type === 'subject') {
      setNavFilters({ subject: result.title });
      goTo('/questoes');
    } else if (result.type === 'trail') {
      const t = result.data as (typeof RECOMMENDED_TRAILS)[number];
      setNavFilters(t.navFilters || {});
      goTo(t.startPath);
    } else if (result.type === 'question') {
      setNavFilters({ subject: result.data.materia, topic: result.data.assunto, search: result.data.pergunta });
      goTo('/questoes');
    }
  };

  const handleStartSorted = () => {
    if (sortResult) {
      setNavFilters({
        subject: sortResult.area,
        topic: sortResult.subtopic,
      });
      goTo('/questoes');
    }
  };

  const handleAreaClick = (subject: string) => {
    setNavFilters({ subject });
    goTo('/questoes');
  };

  const handlePopularClick = (item: any) => {
    if (item.type === 'simulado') {
      goTo('/simulados');
    } else if (item.type === 'questoes') {
      goTo('/redacao');
    } else if (item.type === 'revisao') {
      setNavFilters({ subject: item.subject, difficulty: 'Hard' });
      goTo('/questoes');
    }
  };

  return (
    <div className="app-shell-premium pt-6 md:pt-8 app-stack-premium pb-32 md:pb-36 animate-in fade-in duration-700">
      {/* Header */}
      <header className="space-y-1">
        <div className="flex items-center gap-2">
          <BookOpen size={16} className="text-primary animate-pulse" />
          <span className="text-[11px] font-premium-mono font-bold text-primary uppercase tracking-[0.22em]">Modo Descoberta</span>
        </div>
        <h1 className="text-3xl font-premium-title italic leading-tight">Explorar</h1>
        <p className="text-xs text-text-secondary font-medium opacity-70">O que vamos estudar hoje?</p>
      </header>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary" size={20} />
        <input 
          type="text"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setShowSearchDropdown(true);
          }}
          onFocus={() => setShowSearchDropdown(true)}
          placeholder="Buscar matéria, tema ou questão..."
          className="w-full bg-white/10 border border-white/20 rounded-2xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-primary/50 transition-all placeholder:text-white/50"
        />
        <SearchDropdown 
          results={searchResults} 
          isSearching={isSearching} 
          isVisible={showSearchDropdown && searchQuery.length > 0} 
          onSelect={handleSearchResultSelect}
        />
      </div>

      {/* Hero Card: Sortear Matéria Surpresa */}
      <GlassCard 
        className="relative overflow-hidden group p-8 border-primary/20 bg-primary/5"
        glow
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[80px] rounded-full -mr-32 -mt-32 transition-all group-hover:bg-primary/20" />
        
        <AnimatePresence mode="wait">
          {!sortResult ? (
            <motion.div 
              key="initial"
              initial={{ opacity: 0, y: reduceMotion ? 0 : 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: reduceMotion ? 1 : 0.95 }}
              transition={reduceMotion ? { duration: 0.15, ease: easings.smoothOut } : springs.card}
              className="relative z-10 space-y-6"
            >
              <div className="space-y-2">
                <h2 className="text-2xl font-premium-title italic">Sortear Matéria Surpresa</h2>
                <p className="text-sm text-text-secondary max-w-[260px]">Sorteamos uma área e um subtópico específico para você praticar no banco de questões.</p>
              </div>
              <AnimatedButton 
                onClick={handleSort}
                disabled={isSorting}
                className="w-full py-4 text-black font-bold uppercase tracking-widest gap-2" 
                glow
              >
                {isSorting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                    Sorteando...
                  </div>
                ) : (
                  <>
                    <Sparkles size={18} fill="currentColor" />
                    Sortear Agora
                  </>
                )}
              </AnimatedButton>
            </motion.div>
          ) : (
            <motion.div 
              key="result"
              initial={{ opacity: 0, scale: reduceMotion ? 1 : 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, y: reduceMotion ? 0 : -10 }}
              transition={reduceMotion ? { duration: 0.15, ease: easings.smoothOut } : springs.card}
              className="relative z-10 flex flex-col items-center text-center space-y-4 py-4"
            >
              <SortResult 
                result={sortResult} 
                onStart={handleStartSorted} 
                onRetry={handleSort} 
              />
            </motion.div>
          )}
        </AnimatePresence>
      </GlassCard>

      {/* Destaque da Semana — dados reais das sessões (últimos 7 dias vs semana anterior) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-[11px] font-premium-mono font-bold text-text-secondary uppercase tracking-[0.22em]">Destaque da Semana</h3>
          <div className="h-px flex-1 bg-white/5 ml-4" />
        </div>

        {weekHighlight.kind === 'empty' ? (
          <GlassCard className="p-8 border-dashed border-white/10 text-center space-y-3">
            <Star size={28} className="mx-auto text-primary/60" />
            <p className="text-sm text-text-secondary">
              Comece a estudar para ver seu destaque! Registre sessões no <span className="text-white font-bold">Foco</span> — mostramos aqui a matéria com mais minutos nos últimos 7 dias.
            </p>
            <AnimatedButton onClick={() => goTo('/foco')} variant="primary" className="text-xs uppercase tracking-widest focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-black">
              Ir para Foco
            </AnimatedButton>
          </GlassCard>
        ) : (
          <GlassCard
            onClick={() => {
              setNavFilters({ subject: weekHighlight.subject });
              goTo('/questoes');
            }}
            className="group overflow-hidden border-white/5 hover:border-primary/30 transition-all p-0 cursor-pointer active:scale-[0.99] active:brightness-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
          >
              <div className="relative aspect-[16/9] overflow-hidden bg-gradient-to-br from-primary/30 via-black to-black">
              <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_30%_20%,rgba(var(--hub-primary-rgb),0.35),transparent_55%)]" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
              <div className="absolute bottom-0 left-0 p-6 space-y-2 max-w-[90%]">
                <Badge variant="primary" className="mb-1 uppercase tracking-widest bg-primary/20 text-primary border-primary/30">
                  Últimos 7 dias
                </Badge>
                <h4 className="text-xl font-premium-title italic text-white">{weekHighlight.subject}</h4>
                <p className="text-sm font-bold text-white/80">
                  {weekHighlight.minutes} min estudados
                </p>
                <p className="text-[10px] font-bold text-white/70 uppercase tracking-widest">
                  {weekHighlight.pctVsPrev === null
                    ? weekHighlight.prevMin > 0
                      ? 'Sem comparação estável com a semana anterior'
                      : 'Primeira semana com registo nesta matéria'
                    : `${weekHighlight.pctVsPrev >= 0 ? '+' : ''}${weekHighlight.pctVsPrev}% vs semana anterior`}
                </p>
              </div>
              <div className="absolute bottom-6 right-6 w-12 h-12 rounded-full bg-primary text-black flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <ChevronRight size={24} />
              </div>
            </div>
          </GlassCard>
        )}
      </section>

      {/* Áreas de Conhecimento */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-[11px] font-premium-mono font-bold text-text-secondary uppercase tracking-[0.22em]">Áreas de Conhecimento</h3>
          <div className="h-px flex-1 bg-white/5 ml-4" />
        </div>
        
        <motion.div
          className="grid grid-cols-2 gap-4"
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-40px' }}
        >
          {SUBJECTS.map((sub) => (
            <motion.div key={sub.id} variants={staggerItem}>
              <GlassCard
                enterAnimation={false}
                onClick={() => handleAreaClick(sub.name)}
                className="p-5 flex flex-col items-center text-center space-y-3 group cursor-pointer hover:border-primary/30 transition-all active:scale-[0.98] active:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
              >
                <motion.div
                  className="text-3xl"
                  whileHover={reduceMotion ? undefined : { scale: 1.2, rotate: 6 }}
                  transition={reduceMotion ? { duration: 0 } : springs.soft}
                >
                  {sub.icon}
                </motion.div>
                <div className="space-y-1">
                  <p className="text-xs font-bold text-white uppercase tracking-tight">{sub.name}</p>
                  <p className="text-[10px] font-bold text-white/70 uppercase tracking-[0.08em]">{sub.questions} QUESTÕES</p>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Trilhas personalizadas */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-[11px] font-premium-mono font-bold text-text-secondary uppercase tracking-[0.22em]">Trilhas Personalizadas</h3>
          <div className="h-px flex-1 bg-white/5 ml-4" />
        </div>

        <GlassCard className="p-5 border-primary/20 space-y-4 bg-primary/[0.03]">
          <div className="flex items-center gap-2 text-primary">
            <Sparkles size={16} />
            <p className="text-xs font-bold uppercase tracking-widest">Gerar trilha personalizada</p>
          </div>
            <p className="text-[11px] text-text-secondary leading-relaxed">
            Descreva seu objetivo, prova ou tema. O sistema monta passos, filtros sugeridos e o melhor atalho (questões, redação, simulados…).
          </p>
          <textarea
            value={trailPrompt}
            onChange={(e) => {
              setTrailPrompt(e.target.value);
              setTrailGenError(null);
            }}
            disabled={trailGenLoading}
            placeholder="Ex.: Plano de 4 semanas para revisar Matemática ENEM focando funções e geometria"
            rows={3}
            className="w-full rounded-xl bg-black/45 border border-white/20 px-3 py-2 text-sm text-text-primary placeholder:text-white/55 focus:outline-none focus:border-primary/40 focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-black resize-y min-h-[80px]"
          />
          {trailGenError ? (
            <p className="text-xs text-red-400">{trailGenError}</p>
          ) : null}
          <AnimatedButton
            onClick={() => void handleGenerateAiTrail()}
            disabled={trailGenLoading || !trailPrompt.trim()}
            glow
            className="w-full py-3 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
          >
            {trailGenLoading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Sparkles size={18} />
            )}
            {trailGenLoading ? 'Gerando…' : 'Gerar trilha personalizada'}
          </AnimatedButton>
        </GlassCard>

        {aiTrails.length > 0 ? (
          <div className="space-y-4">
            <p className="text-[10px] font-premium-mono font-bold text-text-secondary uppercase tracking-[0.2em]">
              Suas trilhas (salvas neste dispositivo)
            </p>
            {aiTrails.map((trail) => (
              <GlassCard key={trail.id} className="p-5 border-primary/15 space-y-3 relative overflow-hidden">
                <div className="absolute top-3 right-3 flex items-center gap-2">
                  <Badge variant="primary" className="text-[9px] uppercase tracking-[0.08em] bg-primary/15 text-primary border-primary/30">
                    Plano
                  </Badge>
                  <button
                    type="button"
                    onClick={() => removeAiTrail(trail.id)}
                    className="p-2 rounded-xl border border-white/10 text-text-secondary hover:text-red-400 hover:border-red-500/30 transition-colors min-h-11 min-w-11 active:scale-[0.96] active:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                    aria-label="Remover trilha"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                <div className="flex items-start gap-3 pr-20">
                  <span className="text-3xl shrink-0" aria-hidden>
                    {trail.icon}
                  </span>
                  <div>
                    <h4 className="text-base font-bold text-white">{trail.title}</h4>
                    <p className="text-[10px] text-white/70 uppercase font-bold tracking-widest mt-1">
                      {trail.durationLabel} · {trail.level}
                    </p>
                  </div>
                </div>
                <p className="text-xs text-text-secondary leading-relaxed">{trail.description}</p>
                <ul className="text-[11px] text-white/80 list-disc list-inside space-y-1">
                  {trail.topics.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
                <AnimatedButton
                  onClick={() => {
                    setNavFilters(trail.navFilters);
                    goTo(trail.startPath);
                  }}
                  variant="primary"
                  className="w-full py-3 text-xs font-bold uppercase tracking-widest focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                >
                  Iniciar plano
                </AnimatedButton>
              </GlassCard>
            ))}
          </div>
        ) : null}
      </section>

      {/* Trilhas Recomendadas */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-[11px] font-premium-mono font-bold text-text-secondary uppercase tracking-[0.22em]">Trilhas Recomendadas</h3>
          <div className="h-px flex-1 bg-white/5 ml-4" />
        </div>
        <motion.div
          className="space-y-4"
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-40px' }}
        >
          {RECOMMENDED_TRAILS.map((trail) => (
            <motion.div key={trail.id} variants={staggerItem}>
            <GlassCard enterAnimation={false} className="p-5 border-white/10 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="text-3xl" aria-hidden>
                    {trail.icon}
                  </span>
                  <div>
                    <h4 className="text-base font-bold text-white">{trail.title}</h4>
                    <p className="text-[10px] text-white/70 uppercase font-bold tracking-widest mt-1">
                      {trail.durationLabel} · {trail.level}
                    </p>
                  </div>
                </div>
              </div>
              <p className="text-xs text-text-secondary leading-relaxed">{trail.description}</p>
              <ul className="text-[11px] text-white/80 list-disc list-inside space-y-1">
                {trail.topics.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
              <AnimatedButton
                onClick={() => {
                  setNavFilters(trail.navFilters);
                  goTo(trail.startPath);
                }}
                variant="primary"
                className="w-full py-3 text-xs font-bold uppercase tracking-widest focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
              >
                Iniciar Trilha
              </AnimatedButton>
            </GlassCard>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Populares Agora */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-[11px] font-premium-mono font-bold text-text-secondary uppercase tracking-[0.22em]">Populares Agora</h3>
          <div className="h-px flex-1 bg-white/5 ml-4" />
        </div>
        <motion.div
          className="flex flex-wrap gap-2"
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-20px' }}
        >
          {POPULAR_NOW.map(item => (
            <motion.div key={item.id} variants={staggerItem}>
              <Badge 
                variant="secondary" 
                onClick={() => handlePopularClick(item)}
                className="px-4 py-2 bg-white/5 border-white/10 hover:bg-white/10 transition-colors cursor-pointer min-h-11 inline-flex items-center active:scale-[0.98] active:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
              >
                {item.type === 'simulado' && <Target size={12} className="inline mr-2 text-primary" />}
                {item.type === 'questoes' && <Clock size={12} className="inline mr-2 text-primary" />}
                {item.type === 'revisao' && <Zap size={12} className="inline mr-2 text-primary" />}
                {item.name}
              </Badge>
            </motion.div>
          ))}
        </motion.div>
      </section>
    </div>
  );
};

export default ExploreView;

