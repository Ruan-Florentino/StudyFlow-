import { motion, useReducedMotion } from 'motion/react';
import { springs } from '../lib/animations/easings';
import {
  ArrowLeft,
  Users,
  MessageCircle,
  Sparkles,
  Headphones,
  Clock,
} from 'lucide-react';
import { LofiPlayer } from '../components/sala/LofiPlayer';
import { RoomChat } from '../components/sala/RoomChat';
import { SUBJECTS } from './ComunidadePage';
import { GlassCard } from '../components/UI';
import { useAuth } from '../contexts/AuthContext';

export function SalaPage({ roomId, onLeave }: { roomId: string; onLeave: () => void }) {
  const { user } = useAuth();
  const subject = SUBJECTS.find((s) => s.id === roomId) || SUBJECTS[0];
  const reduceMotion = useReducedMotion() ?? false;

  return (
    <div className="absolute inset-0 z-30 bg-background text-white pb-24 overflow-y-auto custom-scrollbar">
      {/* Grade sutil + brilho (marca + toque da matéria) */}
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.05]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
        }}
        aria-hidden
      />
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[min(100%,520px)] h-[400px] rounded-full blur-3xl opacity-[0.28] pointer-events-none"
        style={{
          background: `
            radial-gradient(circle at 50% 0%, rgba(var(--hub-primary-rgb),0.35) 0%, transparent 45%),
            radial-gradient(circle, rgba(${subject.glow},0.22) 0%, transparent 62%)
          `,
        }}
        aria-hidden
      />

      <div className="relative max-w-md mx-auto w-full px-4 md:px-8 pt-6 pb-[120px]">
        <motion.header
          initial={{ opacity: 0, y: reduceMotion ? 0 : -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={reduceMotion ? { duration: 0.12 } : springs.card}
          className="flex items-start gap-3 mb-6"
        >
          <motion.button
            type="button"
            whileTap={{ scale: 0.92, transition: springs.snappy }}
            onClick={onLeave}
            className="w-11 h-11 rounded-2xl flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] shrink-0 bg-white/[0.06] border border-white/10 hover:bg-white/10 transition-colors"
            aria-label="Sair da sala"
          >
            <ArrowLeft size={18} className="text-white/85" />
          </motion.button>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="inline-flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.2em] px-2 py-1 rounded-full bg-primary/15 text-primary border border-primary/25">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse shadow-[0_0_8px_rgba(var(--hub-primary-rgb),0.85)]" />
                Sala ao vivo
              </span>
              <span className="text-[9px] font-bold uppercase tracking-widest text-white/35">
                {subject.categoryLabel}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl leading-none" aria-hidden>
                {subject.icon}
              </span>
              <div className="min-w-0">
                <h1
                  className="text-lg font-bold font-display truncate"
                  style={{
                    color: subject.color,
                    textShadow: `0 0 24px rgba(${subject.glow},0.45)`,
                  }}
                >
                  {subject.name}
                </h1>
                <p className="text-[11px] text-white/45 mt-0.5 flex items-center gap-1.5">
                  <Headphones size={12} className="shrink-0 opacity-70" />
                  Biblioteca sonora · chat em tempo real
                </p>
              </div>
            </div>
          </div>
        </motion.header>

        <motion.div
          initial={{ opacity: 0, y: reduceMotion ? 0 : 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={
            reduceMotion
              ? { duration: 0.12, delay: 0.05 }
              : { ...springs.card, delay: 0.05 }
          }
          className="mb-5 rounded-2xl px-4 py-3 border border-white/10 bg-black/30 backdrop-blur-md"
        >
          <div className="flex items-center gap-2 text-[11px] text-white/55">
            <Clock size={14} className="text-[var(--color-primary)] shrink-0" />
            <span>
              Regra de ouro: uma matéria por bloco. Use o som para marcar o ritmo, não para
              distrair.
            </span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: reduceMotion ? 0 : 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={
            reduceMotion
              ? { duration: 0.12, delay: 0.1 }
              : { ...springs.card, delay: 0.1 }
          }
          className="mb-6"
        >
          <SectionTitle icon={Sparkles}>Ambiente & foco</SectionTitle>
          <LofiPlayer subjectId={subject.id} color={subject.color} glow={subject.glow} />
        </motion.div>

        <motion.section
          initial={{ opacity: 0, y: reduceMotion ? 0 : 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={
            reduceMotion
              ? { duration: 0.12, delay: 0.15 }
              : { ...springs.card, delay: 0.15 }
          }
          className="mb-6"
        >
          <SectionTitle icon={Users}>Quem está aqui</SectionTitle>
          <GlassCard
            className="p-5 border-[rgba(var(--hub-primary-rgb),0.18)]"
            style={{
              background: `linear-gradient(180deg, rgba(var(--hub-primary-rgb),0.08), rgba(0,0,0,0.22))`,
            }}
          >
            <div className="flex flex-col items-center justify-center py-3">
              <div className="flex -space-x-3 mb-4">
                {user && (
                  <motion.div
                    initial={{ opacity: 0, scale: reduceMotion ? 1 : 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={reduceMotion ? { duration: 0.12 } : springs.card}
                    className="w-12 h-12 rounded-full border-2 border-black flex items-center justify-center text-sm font-bold z-10 ring-2 ring-[rgba(var(--hub-primary-rgb),0.35)]"
                    style={{
                      background: `linear-gradient(135deg, rgba(var(--hub-primary-rgb),0.55), ${subject.color})`,
                      color: '#fff',
                      boxShadow: `0 0 16px rgba(var(--hub-primary-rgb),0.35), 0 0 8px rgba(${subject.glow},0.25)`,
                    }}
                  >
                    {user.user_metadata?.name?.[0] || 'U'}
                  </motion.div>
                )}
                <div className="w-12 h-12 rounded-full border-2 border-black bg-white/5 flex items-center justify-center text-[10px] text-white/35 backdrop-blur-sm">
                  +?
                </div>
              </div>
              <p className="text-[10px] font-premium-mono tracking-[0.18em] text-white/40 uppercase text-center">
                Membros em tempo real em breve · por ora, foco no seu bloco
              </p>
            </div>
          </GlassCard>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: reduceMotion ? 0 : 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={
            reduceMotion
              ? { duration: 0.12, delay: 0.2 }
              : { ...springs.card, delay: 0.2 }
          }
        >
          <SectionTitle icon={MessageCircle}>Conversa leve</SectionTitle>
          <p className="text-[10px] text-white/35 mb-2 -mt-1 uppercase tracking-widest font-bold">
            Dúvidas rápidas · sem spam
          </p>
          <RoomChat roomId={subject.id} color={subject.color} />
        </motion.section>
      </div>
    </div>
  );
}

function SectionTitle({
  icon: Icon,
  children,
}: {
  icon: typeof Users;
  children: string;
}) {
  return (
    <div className="flex items-center justify-between mb-3 gap-2">
      <div className="flex items-center gap-2 min-w-0">
        <Icon size={14} className="shrink-0 text-primary" />
        <span className="text-[10px] uppercase tracking-[0.2em] text-white/55 font-bold truncate">
          {children}
        </span>
      </div>
      <span className="h-px flex-1 max-w-[80px] bg-gradient-to-r from-[rgba(var(--hub-primary-rgb),0.35)] to-transparent hidden sm:block" />
    </div>
  );
}
