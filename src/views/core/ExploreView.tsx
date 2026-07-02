import React, { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { staggerContainer, staggerItem } from '../../lib/animations/variants';
import { easings, springs } from '../../lib/animations/easings';
import {
  Search,
  BookOpen,
  Sparkles,
  ChevronRight,
  Target,
  Zap,
  Clock,
  Star,
  Loader2,
  Trash2,
  Compass,
  Wand2,
  Shuffle,
  Flame,
  Activity,
  ArrowUpRight,
  type LucideIcon,
} from 'lucide-react';
import { GlassCard, AnimatedButton, Badge, cn } from '../../components/UI';
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

const subjectSkins: Record<string, { ring: string; glow: string; meter: string; accent: string }> = {
  exatas: {
    ring: 'from-cyan-400/30 via-blue-500/10 to-transparent',
    glow: 'shadow-[0_18px_45px_rgba(34,211,238,0.14)]',
    meter: 'from-cyan-300 to-blue-500',
    accent: 'text-cyan-200',
  },
  linguagens: {
    ring: 'from-amber-300/35 via-orange-500/10 to-transparent',
    glow: 'shadow-[0_18px_45px_rgba(245,158,11,0.14)]',
    meter: 'from-amber-300 to-orange-500',
    accent: 'text-amber-200',
  },
  humanas: {
    ring: 'from-rose-300/30 via-fuchsia-500/10 to-transparent',
    glow: 'shadow-[0_18px_45px_rgba(244,63,94,0.13)]',
    meter: 'from-rose-300 to-fuchsia-500',
    accent: 'text-rose-200',
  },
  naturais: {
    ring: 'from-emerald-300/35 via-primary/10 to-transparent',
    glow: 'shadow-[0_18px_45px_rgba(16,185,129,0.14)]',
    meter: 'from-emerald-300 to-primary',
    accent: 'text-emerald-200',
  },
};

function SectionHeading({
  eyebrow,
  title,
  description,
  icon: Icon,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  icon: LucideIcon;
}) {
  return (
    <div className='flex items-end justify-between gap-4'>
      <div className='min-w-0 space-y-1.5'>
        <div className='flex items-center gap-2'>
          <Icon size={14} className='text-primary' />
          <span className='text-[10px] font-premium-mono font-bold text-primary uppercase tracking-[0.22em]'>
            {eyebrow}
          </span>
        </div>
        <h3 className='text-xl font-premium-title italic leading-tight text-white sm:text-2xl'>{title}</h3>
        {description ? <p className='max-w-xl text-xs leading-relaxed text-text-secondary sm:text-sm'>{description}</p> : null}
      </div>
      <div className='hidden h-px flex-1 bg-gradient-to-r from-white/15 to-transparent sm:block' />
    </div>
  );
}

function MetricPill({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) {
  return (
    <div className='premium-list-card flex min-w-0 items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.055] px-3.5 py-3 backdrop-blur-xl'>
      <div className='flex size-9 shrink-0 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary'>
        <Icon size={17} />
      </div>
      <div className='min-w-0'>
        <p className='text-sm font-black leading-none text-white'>{value}</p>
        <p className='mt-1 text-[9px] font-bold uppercase tracking-[0.16em] text-white/50'>{label}</p>
      </div>
    </div>
  );
}

function TopicChips({ topics }: { topics: string[] }) {
  return (
    <div className='flex flex-wrap gap-2'>
      {topics.slice(0, 5).map((topic) => (
        <span
          key={topic}
          className='rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.08em] text-white/70'
        >
          {topic}
        </span>
      ))}
    </div>
  );
}

function getSurpriseIcon(area: string): string {
  const direct = SUBJECT_ICONS[area];
  if (direct) return direct;
  if (area.includes('Geografia')) return SUBJECT_ICONS['Geografia'] || SUBJECTS.find((subject) => subject.id === 'humanas')?.icon || 'SF';
  if (area.includes('Cultura') || area.includes('Literatura')) return SUBJECTS.find((subject) => subject.id === 'linguagens')?.icon || 'SF';
  return SUBJECTS[0]?.icon || 'SF';
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
      setTrailGenError(e instanceof Error ? e.message : 'Nao foi possivel gerar a trilha.');
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

  const totalQuestions = useMemo(() => SUBJECTS.reduce((acc, subject) => acc + subject.questions, 0), []);
  const activeTrailCount = RECOMMENDED_TRAILS.length + aiTrails.length;

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
        icon: getSurpriseIcon(area),
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
    <div className='app-shell-premium premium-page-stack relative isolate overflow-hidden pt-5 pb-32 animate-in fade-in duration-700 md:pt-8 md:pb-36'>
      <div className='pointer-events-none absolute inset-x-0 top-0 -z-10 h-[420px] bg-[linear-gradient(180deg,rgba(255,255,255,0.07),rgba(var(--hub-primary-rgb),0.045)_34%,transparent_78%)]' />

      <motion.header
        initial={{ opacity: 0, y: reduceMotion ? 0 : 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={reduceMotion ? { duration: 0.15, ease: easings.smoothOut } : springs.card}
        className='premium-page-hero relative overflow-visible p-4 sm:p-6'
      >
        <div className='pointer-events-none absolute inset-0 overflow-hidden rounded-[32px]'>
          <div className='absolute -right-20 -top-24 size-64 rounded-full bg-primary/20 blur-3xl' />
          <div className='absolute -bottom-28 left-8 size-72 rounded-full bg-blue-500/10 blur-3xl' />
          <div className='absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/35 to-transparent' />
        </div>

        <div className='relative grid gap-6 lg:grid-cols-[minmax(0,1.25fr)_minmax(280px,0.75fr)] lg:items-end'>
          <div className='space-y-5'>
            <div className='flex flex-wrap items-center gap-2'>
              <Badge variant='primary' className='bg-primary/15 text-primary border-primary/25'>
                Modo descoberta
              </Badge>
              <span className='rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-[10px] font-premium-mono font-bold uppercase tracking-[0.18em] text-white/55'>
                Inicio inteligente
              </span>
            </div>

            <div className='space-y-3'>
              <h1 className='max-w-3xl text-4xl font-premium-title italic leading-[0.95] tracking-tight text-white sm:text-5xl lg:text-6xl'>
                Explorar sem perder ritmo.
              </h1>
              <p className='max-w-2xl text-sm leading-relaxed text-text-secondary sm:text-base'>
                Busque qualquer tema, entre em trilhas prontas ou deixe o StudyFlow montar a proxima missao de estudo.
              </p>
            </div>

            <div className='relative z-20'>
              <div className='relative rounded-[24px] border border-white/15 bg-black/35 p-2 shadow-inner backdrop-blur-xl transition-colors focus-within:border-primary/45 focus-within:bg-black/45'>
                <Search className='absolute left-5 top-1/2 -translate-y-1/2 text-primary' size={20} />
                <input
                  type='text'
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowSearchDropdown(true);
                  }}
                  onFocus={() => setShowSearchDropdown(true)}
                  placeholder='Buscar materia, tema, questao ou trilha...'
                  className='h-14 w-full rounded-2xl border-0 bg-transparent py-4 pl-11 pr-4 text-sm font-semibold text-white outline-none placeholder:text-white/45'
                />
              </div>
              <SearchDropdown
                results={searchResults}
                isSearching={isSearching}
                isVisible={showSearchDropdown && searchQuery.length > 0}
                onSelect={handleSearchResultSelect}
              />
            </div>

            <div className='flex flex-col gap-3 sm:flex-row'>
              <AnimatedButton onClick={handleSort} disabled={isSorting} className='min-h-12 flex-1 gap-2 font-black uppercase tracking-[0.14em]' glow>
                {isSorting ? <Loader2 size={18} className='animate-spin' /> : <Shuffle size={18} />}
                {isSorting ? 'Sorteando' : 'Sortear missao'}
              </AnimatedButton>
              <AnimatedButton
                onClick={() => document.getElementById('ai-trails')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                variant='secondary'
                className='min-h-12 flex-1 gap-2 font-black uppercase tracking-[0.14em]'
              >
                <Wand2 size={18} />
                Criar trilha
              </AnimatedButton>
            </div>
          </div>

          <div className='grid grid-cols-1 gap-3 sm:grid-cols-3 lg:grid-cols-1'>
            <MetricPill icon={BookOpen} label='questoes' value={String(totalQuestions)} />
            <MetricPill icon={Compass} label='trilhas' value={String(activeTrailCount)} />
            <MetricPill
              icon={Activity}
              label='destaque'
              value={weekHighlight.kind === 'data' ? String(weekHighlight.minutes) + 'm' : 'novo'}
            />
          </div>
        </div>
      </motion.header>

      <GlassCard className='premium-list-card border-primary/20 bg-primary/[0.04] p-0' glow>
        <AnimatePresence mode='wait'>
          {!sortResult ? (
            <motion.div
              key='initial'
              initial={{ opacity: 0, y: reduceMotion ? 0 : 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: reduceMotion ? 1 : 0.97 }}
              transition={reduceMotion ? { duration: 0.15, ease: easings.smoothOut } : springs.card}
              className='grid gap-5 p-5 sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:items-center sm:p-6'
            >
              <div className='flex size-14 items-center justify-center rounded-3xl border border-primary/25 bg-primary/12 text-primary shadow-[0_0_32px_rgba(var(--hub-primary-rgb),0.18)]'>
                <Sparkles size={25} />
              </div>
              <div className='min-w-0 space-y-1'>
                <p className='text-[10px] font-premium-mono font-bold uppercase tracking-[0.2em] text-primary'>Missao surpresa</p>
                <h2 className='text-2xl font-premium-title italic leading-tight text-white'>Treine algo fora da zona de conforto.</h2>
                <p className='max-w-2xl text-xs leading-relaxed text-text-secondary sm:text-sm'>
                  Sorteamos uma area e um subtopico especifico para voce praticar direto no banco de questoes.
                </p>
              </div>
              <AnimatedButton onClick={handleSort} disabled={isSorting} className='min-h-12 px-5 text-xs font-black uppercase tracking-widest' glow>
                {isSorting ? <Loader2 size={18} className='animate-spin' /> : <Sparkles size={18} />}
                {isSorting ? 'Sorteando' : 'Sortear'}
              </AnimatedButton>
            </motion.div>
          ) : (
            <motion.div
              key='result'
              initial={{ opacity: 0, scale: reduceMotion ? 1 : 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, y: reduceMotion ? 0 : -10 }}
              transition={reduceMotion ? { duration: 0.15, ease: easings.smoothOut } : springs.card}
              className='p-5 sm:p-6'
            >
              <SortResult result={sortResult} onStart={handleStartSorted} onRetry={handleSort} />
            </motion.div>
          )}
        </AnimatePresence>
      </GlassCard>

      <section className='space-y-4'>
        <SectionHeading
          eyebrow='Radar semanal'
          title='Seu foco em destaque'
          description='Acompanhe o assunto que mais puxou seus minutos recentes e volte para questoes com um toque.'
          icon={Flame}
        />

        {weekHighlight.kind === 'empty' ? (
          <GlassCard className='premium-empty-panel overflow-hidden border-dashed border-white/15 p-6 text-center'>
            <div className='mx-auto mb-4 flex size-14 items-center justify-center rounded-3xl border border-primary/20 bg-primary/10 text-primary'>
              <Star size={26} />
            </div>
            <h4 className='text-xl font-premium-title italic text-white'>Comece uma sessao para acender o radar.</h4>
            <p className='mx-auto mt-2 max-w-md text-sm leading-relaxed text-text-secondary'>
              Registrando tempo no Foco, esta area mostra sua materia dominante dos ultimos 7 dias.
            </p>
            <AnimatedButton onClick={() => goTo('/foco')} variant='primary' className='mx-auto mt-5 min-h-12 text-xs font-black uppercase tracking-widest'>
              Ir para Foco
            </AnimatedButton>
          </GlassCard>
        ) : (
          <GlassCard
            onClick={() => {
              setNavFilters({ subject: weekHighlight.subject });
              goTo('/questoes');
            }}
            className='group overflow-hidden border-white/10 p-0 transition-all hover:border-primary/35'
          >
            <div className='relative min-h-[230px] bg-[radial-gradient(circle_at_20%_10%,rgba(var(--hub-primary-rgb),0.34),transparent_35%),linear-gradient(135deg,rgba(255,255,255,0.12),rgba(255,255,255,0.03)_45%,rgba(0,0,0,0.45))] p-6 sm:p-7'>
              <div className='absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/50 to-transparent' />
              <div className='relative flex h-full min-h-[190px] flex-col justify-between gap-10'>
                <div className='flex items-center justify-between gap-3'>
                  <Badge variant='primary' className='bg-primary/15 text-primary border-primary/30'>
                    Ultimos 7 dias
                  </Badge>
                  <div className='flex size-12 items-center justify-center rounded-full bg-primary text-black shadow-lg transition-transform group-hover:scale-110'>
                    <ChevronRight size={23} />
                  </div>
                </div>
                <div className='space-y-2'>
                  <h4 className='text-3xl font-premium-title italic leading-tight text-white sm:text-4xl'>{weekHighlight.subject}</h4>
                  <p className='text-base font-black text-white/85'>{weekHighlight.minutes} min estudados</p>
                  <p className='text-[10px] font-bold uppercase tracking-widest text-white/65'>
                    {weekHighlight.pctVsPrev === null
                      ? weekHighlight.prevMin > 0
                        ? 'Comparacao ainda instavel com a semana anterior'
                        : 'Primeira semana com registro nesta materia'
                      : String(weekHighlight.pctVsPrev >= 0 ? '+' : '') + String(weekHighlight.pctVsPrev) + '% vs semana anterior'}
                  </p>
                </div>
              </div>
            </div>
          </GlassCard>
        )}
      </section>

      <section className='space-y-4'>
        <SectionHeading
          eyebrow='Areas'
          title='Escolha o campo de batalha'
          description='Cards mais densos, com leitura rapida e entrada direta para o banco de questoes filtrado.'
          icon={Compass}
        />

        <motion.div
          className='grid grid-cols-1 gap-4 sm:grid-cols-2'
          variants={staggerContainer}
          initial='hidden'
          whileInView='show'
          viewport={{ once: true, margin: '-40px' }}
        >
          {SUBJECTS.map((sub) => {
            const skin = subjectSkins[sub.id] || subjectSkins.naturais;
            const progress = Math.min(100, Math.max(28, Math.round((sub.questions / totalQuestions) * 180)));

            return (
              <motion.div key={sub.id} variants={staggerItem}>
                <GlassCard
                  enterAnimation={false}
                  onClick={() => handleAreaClick(sub.name)}
                  className={cn('premium-grid-card group min-h-[184px] overflow-hidden border-white/10 p-5 transition-all hover:border-white/25', skin.glow)}
                >
                  <div className={cn('absolute -right-14 -top-16 size-44 rounded-full bg-gradient-to-br blur-2xl transition-opacity group-hover:opacity-90', skin.ring)} />
                  <div className='relative flex h-full flex-col justify-between gap-6'>
                    <div className='flex items-start justify-between gap-4'>
                      <motion.div
                        className='flex size-16 items-center justify-center rounded-[26px] border border-white/12 bg-white/[0.07] text-4xl shadow-inner'
                        whileHover={reduceMotion ? undefined : { scale: 1.08, rotate: 4 }}
                        transition={reduceMotion ? { duration: 0 } : springs.soft}
                      >
                        {sub.icon}
                      </motion.div>
                      <ArrowUpRight size={20} className='text-white/35 transition-colors group-hover:text-primary' />
                    </div>

                    <div className='space-y-3'>
                      <div>
                        <p className={cn('text-[10px] font-black uppercase tracking-[0.2em]', skin.accent)}>{sub.questions} questoes</p>
                        <h4 className='mt-1 text-xl font-premium-title italic leading-tight text-white'>{sub.name}</h4>
                      </div>
                      <div className='h-1.5 overflow-hidden rounded-full bg-white/10'>
                        <div className={cn('h-full rounded-full bg-gradient-to-r', skin.meter)} style={{ width: String(progress) + '%' }} />
                      </div>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            );
          })}
        </motion.div>
      </section>

      <section id='ai-trails' className='scroll-mt-6 space-y-4'>
        <SectionHeading
          eyebrow='IA'
          title='Trilhas personalizadas'
          description='Descreva a meta, a prova ou o tema. A plataforma transforma isso em um plano acionavel.'
          icon={Wand2}
        />

        <GlassCard className='premium-list-card border-primary/20 bg-primary/[0.035] p-5 sm:p-6'>
          <div className='grid gap-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start'>
            <div className='space-y-4'>
              <div className='flex items-center gap-3 text-primary'>
                <div className='flex size-11 items-center justify-center rounded-2xl border border-primary/25 bg-primary/10'>
                  <Sparkles size={20} />
                </div>
                <div>
                  <p className='text-[10px] font-premium-mono font-bold uppercase tracking-[0.22em]'>Gerador de trilha</p>
                  <p className='text-xs text-text-secondary'>Passos, filtros e melhor atalho em um unico comando.</p>
                </div>
              </div>
              <textarea
                value={trailPrompt}
                onChange={(e) => {
                  setTrailPrompt(e.target.value);
                  setTrailGenError(null);
                }}
                disabled={trailGenLoading}
                placeholder='Ex.: Plano de 4 semanas para revisar Matematica ENEM focando funcoes e geometria'
                rows={4}
                className='w-full min-h-[116px] resize-y rounded-[22px] border border-white/15 bg-black/45 px-4 py-3 text-sm text-text-primary outline-none transition-colors placeholder:text-white/45 focus:border-primary/45 focus:bg-black/55'
              />
              {trailGenError ? <p className='text-xs text-red-400'>{trailGenError}</p> : null}
            </div>

            <AnimatedButton
              onClick={() => void handleGenerateAiTrail()}
              disabled={trailGenLoading || !trailPrompt.trim()}
              glow
              className='min-h-12 whitespace-nowrap px-5 text-xs font-black uppercase tracking-widest lg:mt-[58px]'
            >
              {trailGenLoading ? <Loader2 size={18} className='animate-spin' /> : <Sparkles size={18} />}
              {trailGenLoading ? 'Gerando' : 'Gerar trilha'}
            </AnimatedButton>
          </div>
        </GlassCard>

        {aiTrails.length > 0 ? (
          <motion.div className='grid gap-4 lg:grid-cols-2' variants={staggerContainer} initial='hidden' whileInView='show' viewport={{ once: true, margin: '-40px' }}>
            {aiTrails.map((trail) => (
              <motion.div key={trail.id} variants={staggerItem}>
                <GlassCard enterAnimation={false} className='premium-list-card h-full border-primary/15 p-5'>
                  <div className='flex h-full flex-col gap-4'>
                    <div className='flex items-start justify-between gap-4'>
                      <div className='flex min-w-0 items-start gap-3'>
                        <span className='flex size-12 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06] text-3xl' aria-hidden>
                          {trail.icon}
                        </span>
                        <div className='min-w-0'>
                          <h4 className='text-base font-black leading-tight text-white'>{trail.title}</h4>
                          <p className='mt-1 text-[10px] font-bold uppercase tracking-widest text-white/55'>
                            {trail.durationLabel} - {trail.level}
                          </p>
                        </div>
                      </div>
                      <button
                        type='button'
                        onClick={() => removeAiTrail(trail.id)}
                        className='flex size-11 shrink-0 items-center justify-center rounded-2xl border border-white/10 text-text-secondary transition-colors hover:border-red-500/30 hover:text-red-400'
                        aria-label='Remover trilha'
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <p className='text-xs leading-relaxed text-text-secondary'>{trail.description}</p>
                    <TopicChips topics={trail.topics} />
                    <AnimatedButton
                      onClick={() => {
                        setNavFilters(trail.navFilters);
                        goTo(trail.startPath);
                      }}
                      variant='primary'
                      className='mt-auto min-h-12 text-xs font-black uppercase tracking-widest'
                    >
                      Iniciar plano
                    </AnimatedButton>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </motion.div>
        ) : null}
      </section>

      <section className='space-y-4'>
        <SectionHeading
          eyebrow='Roteiros'
          title='Trilhas recomendadas'
          description='Planos prontos para entrar em estudo sem decidir tudo do zero.'
          icon={Target}
        />

        <motion.div
          className='grid gap-4 lg:grid-cols-2'
          variants={staggerContainer}
          initial='hidden'
          whileInView='show'
          viewport={{ once: true, margin: '-40px' }}
        >
          {RECOMMENDED_TRAILS.map((trail) => (
            <motion.div key={trail.id} variants={staggerItem}>
              <GlassCard enterAnimation={false} className='premium-list-card group h-full border-white/10 p-5 transition-all hover:border-primary/30'>
                <div className='flex h-full flex-col gap-4'>
                  <div className='flex items-start justify-between gap-4'>
                    <div className='flex min-w-0 items-start gap-3'>
                      <span className='flex size-14 shrink-0 items-center justify-center rounded-[22px] border border-white/10 bg-white/[0.06] text-3xl' aria-hidden>
                        {trail.icon}
                      </span>
                      <div className='min-w-0'>
                        <h4 className='text-lg font-premium-title italic leading-tight text-white'>{trail.title}</h4>
                        <p className='mt-1 text-[10px] font-bold uppercase tracking-widest text-white/55'>
                          {trail.durationLabel} - {trail.level}
                        </p>
                      </div>
                    </div>
                    <ArrowUpRight size={20} className='shrink-0 text-white/30 transition-colors group-hover:text-primary' />
                  </div>
                  <p className='text-xs leading-relaxed text-text-secondary'>{trail.description}</p>
                  <TopicChips topics={trail.topics} />
                  <AnimatedButton
                    onClick={() => {
                      setNavFilters(trail.navFilters);
                      goTo(trail.startPath);
                    }}
                    variant='primary'
                    className='mt-auto min-h-12 text-xs font-black uppercase tracking-widest'
                  >
                    Iniciar trilha
                  </AnimatedButton>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <section className='space-y-4'>
        <SectionHeading
          eyebrow='Agora'
          title='Populares na plataforma'
          description='Atalhos de alta intencao para simulado, redacao e revisao.'
          icon={Zap}
        />

        <motion.div
          className='grid gap-3 sm:grid-cols-3'
          variants={staggerContainer}
          initial='hidden'
          whileInView='show'
          viewport={{ once: true, margin: '-20px' }}
        >
          {POPULAR_NOW.map((item) => {
            const Icon = item.type === 'simulado' ? Target : item.type === 'questoes' ? Clock : Zap;

            return (
              <motion.button
                key={item.id}
                type='button'
                variants={staggerItem}
                onClick={() => handlePopularClick(item)}
                whileTap={reduceMotion ? undefined : { scale: 0.98 }}
                className='premium-grid-card group min-h-[112px] rounded-[22px] border border-white/10 bg-white/[0.05] p-4 text-left shadow-lg backdrop-blur-xl transition-colors hover:border-primary/30 hover:bg-white/[0.08] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-black'
              >
                <div className='mb-4 flex items-center justify-between gap-3'>
                  <div className='flex size-11 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary'>
                    <Icon size={18} />
                  </div>
                  <ChevronRight size={18} className='text-white/30 transition-colors group-hover:text-primary' />
                </div>
                <p className='text-sm font-black leading-tight text-white'>{item.name}</p>
                <p className='mt-1 text-[10px] font-bold uppercase tracking-widest text-white/45'>Abrir agora</p>
              </motion.button>
            );
          })}
        </motion.div>
      </section>
    </div>
  );
};

export default ExploreView;
