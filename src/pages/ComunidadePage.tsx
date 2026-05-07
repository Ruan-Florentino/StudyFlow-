import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { springs } from '../lib/animations/easings';
import {
  Users,
  Music,
  BookOpen,
  Sparkles,
  ArrowLeft,
  Search,
  X,
} from 'lucide-react';
import { useStore } from '../store';
import { SalaPage } from './SalaPage';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppNavigation } from '../app/router/useAppNavigation';

export type SalaSubjectCategory = 'exatas' | 'natureza' | 'humanas' | 'linguagens' | 'criativo';

export interface SalaSubject {
  id: string;
  name: string;
  icon: string;
  color: string;
  glow: string;
  category: SalaSubjectCategory;
  categoryLabel: string;
}

export const SUBJECTS: SalaSubject[] = [
  {
    id: 'matematica',
    name: 'Matemática',
    icon: '📐',
    color: '#fbbf24',
    glow: '251,191,36',
    category: 'exatas',
    categoryLabel: 'Exatas',
  },
  {
    id: 'redacao',
    name: 'Redação',
    icon: '✍️',
    color: '#a78bfa',
    glow: '167,139,250',
    category: 'linguagens',
    categoryLabel: 'Linguagens',
  },
  {
    id: 'quimica',
    name: 'Química',
    icon: '🧪',
    color: '#34d399',
    glow: '52,211,153',
    category: 'exatas',
    categoryLabel: 'Exatas',
  },
  {
    id: 'fisica',
    name: 'Física',
    icon: '⚛️',
    color: '#38bdf8',
    glow: '56,189,248',
    category: 'exatas',
    categoryLabel: 'Exatas',
  },
  {
    id: 'biologia',
    name: 'Biologia',
    icon: '🧬',
    color: '#84cc16',
    glow: '132,204,22',
    category: 'natureza',
    categoryLabel: 'Natureza',
  },
  {
    id: 'historia',
    name: 'História',
    icon: '📜',
    color: '#f59e0b',
    glow: '245,158,11',
    category: 'humanas',
    categoryLabel: 'Humanas',
  },
  {
    id: 'geografia',
    name: 'Geografia',
    icon: '🌍',
    color: '#14b8a6',
    glow: '20,184,166',
    category: 'humanas',
    categoryLabel: 'Humanas',
  },
  {
    id: 'filosofia',
    name: 'Filosofia',
    icon: '💭',
    color: '#818cf8',
    glow: '129,140,248',
    category: 'humanas',
    categoryLabel: 'Humanas',
  },
  {
    id: 'sociologia',
    name: 'Sociologia',
    icon: '👥',
    color: '#f472b6',
    glow: '244,114,182',
    category: 'humanas',
    categoryLabel: 'Humanas',
  },
  {
    id: 'portugues',
    name: 'Português',
    icon: '📖',
    color: '#f87171',
    glow: '248,113,113',
    category: 'linguagens',
    categoryLabel: 'Linguagens',
  },
  {
    id: 'ingles',
    name: 'Inglês',
    icon: '🇬🇧',
    color: '#60a5fa',
    glow: '96,165,250',
    category: 'linguagens',
    categoryLabel: 'Linguagens',
  },
  {
    id: 'artes',
    name: 'Artes',
    icon: '🎨',
    color: '#e879f9',
    glow: '232,121,249',
    category: 'criativo',
    categoryLabel: 'Criativo',
  },
];

const CATEGORY_FILTERS: Array<{ id: SalaSubjectCategory | 'all'; label: string }> = [
  { id: 'all', label: 'Todas' },
  { id: 'exatas', label: 'Exatas' },
  { id: 'natureza', label: 'Natureza' },
  { id: 'humanas', label: 'Humanas' },
  { id: 'linguagens', label: 'Linguagens' },
  { id: 'criativo', label: 'Criativo' },
];

export function ComunidadePage() {
  const { goBack } = useAppNavigation();
  const navigate = useNavigate();
  const joinRoom = useStore((state) => state.joinRoom);
  const activeRoom = useStore((state) => state.studyRooms?.activeRoom ?? null);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<SalaSubjectCategory | 'all'>('all');
  const reduceMotion = useReducedMotion() ?? false;

  const handleBack = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      goBack();
    } else {
      navigate('/', { replace: false });
    }
  };

  const filteredSubjects = useMemo(() => {
    const q = query.trim().toLowerCase();
    return SUBJECTS.filter((s) => {
      const matchCat = category === 'all' || s.category === category;
      const matchQ =
        !q ||
        s.name.toLowerCase().includes(q) ||
        s.categoryLabel.toLowerCase().includes(q);
      return matchCat && matchQ;
    });
  }, [query, category]);

  if (activeRoom) {
    return <SalaPage roomId={activeRoom} onLeave={() => joinRoom(null)} />;
  }

  return (
    <div className="app-shell-premium pt-6 md:pt-8 pb-32 md:pb-36 text-white relative overflow-hidden animate-in fade-in duration-500">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
        aria-hidden
      />

      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[min(100%,520px)] h-72 rounded-full blur-3xl opacity-20 pointer-events-none"
        style={{
          background:
            'radial-gradient(circle, rgba(var(--hub-primary-rgb),0.35) 0%, rgba(var(--hub-primary-rgb),0.08) 45%, transparent 70%)',
        }}
        aria-hidden
      />

      <div className="relative max-w-md mx-auto">
        <header className="flex items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-3 min-w-0">
            <motion.button
              type="button"
              whileTap={{ scale: 0.94, transition: springs.snappy }}
              onClick={handleBack}
              className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 bg-white/[0.06] border border-white/10 hover:bg-white/10 transition-colors"
              aria-label="Voltar"
            >
              <ArrowLeft size={20} className="text-[var(--color-primary)]" />
            </motion.button>
            <div className="min-w-0">
              <h1 className="font-premium-title italic text-xl uppercase tracking-tight truncate">
                Salas de estudo
                <span className="text-primary not-italic ml-0.5">.</span>
              </h1>
              <p className="text-[10px] font-premium-mono tracking-widest text-white/40 uppercase">
                Som · presença · chat
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-primary/10 border border-primary/25 shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            <span className="text-[9px] font-bold uppercase tracking-wider text-primary/90">
              Live
            </span>
          </div>
        </header>

        <motion.div
          initial={{ opacity: 0, y: reduceMotion ? 0 : 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={reduceMotion ? { duration: 0.14, ease: [0.22, 1, 0.36, 1] } : springs.card}
          className="space-y-5"
        >
          <div
            className="rounded-3xl p-4 relative overflow-hidden border border-[rgba(var(--hub-primary-rgb),0.22)]"
            style={{
              background:
                'linear-gradient(135deg, rgba(var(--hub-primary-rgb),0.12), rgba(var(--hub-primary-rgb),0.04), rgba(0,0,0,0.35))',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.08)',
            }}
          >
            <div className="flex items-start gap-3">
              <motion.div
                animate={reduceMotion ? { rotate: 0 } : { rotate: [0, 360] }}
                transition={
                  reduceMotion
                    ? { duration: 0 }
                    : { duration: 10, repeat: Infinity, ease: 'linear' }
                }
                className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 border border-[rgba(var(--hub-primary-rgb),0.35)]"
                style={{
                  background: `linear-gradient(135deg, rgba(var(--hub-primary-rgb),0.5), rgba(var(--hub-primary-rgb),0.15))`,
                  boxShadow: '0 0 22px rgba(var(--hub-primary-rgb),0.35)',
                }}
              >
                <Music size={22} className="text-white" strokeWidth={2.2} />
              </motion.div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-white/95 leading-snug">
                  Cada matéria é uma sala. Troque de estação sonora dentro da sala — lofi, ambiente,
                  ritmo ou jazz.
                </p>
                <p className="text-[11px] text-white/50 mt-1.5">
                  Premium não é excesso: é controle fino do seu foco.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <StatCard icon={Users} value="Sync" label="Presença" />
            <StatCard icon={BookOpen} value={SUBJECTS.length} label="Salas" />
          </div>

          <div className="relative">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/35 pointer-events-none"
            />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar matéria..."
              className="w-full rounded-2xl bg-black/40 border border-white/10 pl-10 pr-10 py-3 text-sm text-white placeholder:text-white/35 outline-none focus:border-[var(--color-primary)]/40 focus:ring-1 focus:ring-[var(--color-primary)]/30 transition-shadow"
              aria-label="Buscar matéria"
            />
            <AnimatePresence>
              {query ? (
                <motion.button
                  type="button"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={reduceMotion ? { duration: 0.1 } : springs.snappy}
                  onClick={() => setQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-xl flex items-center justify-center bg-white/5 hover:bg-white/10 border border-white/10"
                  aria-label="Limpar busca"
                >
                  <X size={14} className="text-white/60" />
                </motion.button>
              ) : null}
            </AnimatePresence>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar -mx-1 px-1">
            {CATEGORY_FILTERS.map((c) => {
              const active = category === c.id;
              return (
                <motion.button
                  key={c.id}
                  type="button"
                  onClick={() => setCategory(c.id)}
                  whileTap={{ scale: 0.96, transition: springs.snappy }}
                  className={`shrink-0 px-3 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider border transition-all duration-200 ease-out ${
                    active
                      ? 'bg-[var(--color-primary)]/20 text-[var(--color-primary)] border-[var(--color-primary)]/35 shadow-[0_0_16px_rgba(var(--hub-primary-rgb),0.15)]'
                      : 'bg-white/[0.04] text-white/45 border-white/10 hover:text-white/75 hover:bg-white/[0.07]'
                  }`}
                >
                  {c.label}
                </motion.button>
              );
            })}
          </div>

          <div className="flex items-center gap-2 mb-1">
            <Sparkles size={12} className="text-primary shrink-0" />
            <span className="text-[10px] uppercase tracking-widest text-white/55 font-bold">
              Entrar na sala
            </span>
            <span className="text-[10px] text-white/30 font-medium">
              {filteredSubjects.length} opções
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 pb-8">
            <AnimatePresence mode="popLayout">
              {filteredSubjects.map((subject, i) => (
                <motion.button
                  key={subject.id}
                  initial={{ opacity: 0, scale: 0.94 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.94 }}
                  transition={
                    reduceMotion
                      ? { duration: 0.12, delay: i * 0.02, ease: [0.22, 1, 0.36, 1] }
                      : { ...springs.card, delay: i * 0.02 }
                  }
                  whileTap={{ scale: 0.96, transition: springs.snappy }}
                  type="button"
                  onClick={() => joinRoom(subject.id)}
                  className="aspect-square rounded-3xl p-4 relative overflow-hidden flex flex-col items-center justify-center gap-2 group text-left"
                  style={{
                    background: `linear-gradient(145deg, 
                      rgba(${subject.glow},0.2) 0%, 
                      rgba(${subject.glow},0.04) 100%)`,
                    border: `1px solid rgba(${subject.glow},0.32)`,
                    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.12), 0 8px 28px rgba(0,0,0,0.4)',
                  }}
                >
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{
                      background: `radial-gradient(circle at 50% 30%, rgba(${subject.glow},0.35) 0%, transparent 55%)`,
                    }}
                  />
                  <span className="relative text-[9px] font-bold uppercase tracking-wider text-white/40 self-start w-full truncate">
                    {subject.categoryLabel}
                  </span>
                  <div className="relative text-4xl mb-0.5 transform group-hover:scale-110 transition-transform duration-300">
                    {subject.icon}
                  </div>
                  <h3 className="relative font-bold text-sm text-center truncate max-w-full text-white/95">
                    {subject.name}
                  </h3>
                  <div className="relative flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/30 border border-white/10">
                    <span
                      className="w-1.5 h-1.5 rounded-full animate-pulse shadow-[0_0_8px_rgba(var(--hub-primary-rgb),0.85)]"
                      style={{ backgroundColor: 'var(--hub-primary)' }}
                    />
                    <span className="text-[10px] font-bold text-white/55">Aberta</span>
                  </div>
                </motion.button>
              ))}
            </AnimatePresence>
          </div>

          {filteredSubjects.length === 0 && (
            <p className="text-center text-sm text-white/45 pb-16">
              Nenhuma sala nesse filtro. Limpe a busca ou troque a categoria.
            </p>
          )}
        </motion.div>
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  value,
  label,
}: {
  icon: typeof Users;
  value: string | number;
  label: string;
}) {
  return (
    <div
      className="rounded-2xl p-3 relative overflow-hidden border border-[rgba(var(--hub-primary-rgb),0.18)]"
      style={{
        background: `linear-gradient(135deg, rgba(var(--hub-primary-rgb),0.1), rgba(var(--hub-primary-rgb),0.02))`,
      }}
    >
      <div className="flex items-center gap-2 mb-1">
        <Icon size={12} className="text-primary" />
        <span className="text-[9px] uppercase tracking-wider text-white/50">{label}</span>
      </div>
      <p className="text-2xl font-bold tabular-nums text-primary">{value}</p>
    </div>
  );
}
