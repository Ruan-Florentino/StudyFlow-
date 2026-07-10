import React, { memo, useMemo, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import {
  Award, BookOpenCheck, ChevronLeft, Crown, Flame, Medal, Minus, School, Shield,
  Target, TrendingDown, TrendingUp, Trophy, UserRound, Users, X, Zap,
} from 'lucide-react';
import { AnimatedButton, Badge, GlassCard, cn } from './UI';
import { useStore } from '../store';
import {
  LEAGUES, buildSelfRankingRow, mapRemoteLeaderboardRows, sortRankingRows,
  type RankingLeague, type RankingPeriod, type RankingRow,
} from '../services/rankingService';

const tabs: Array<{ id: RankingPeriod; label: string }> = [
  { id: 'today', label: 'Hoje' },
  { id: 'weekly', label: 'Semana' },
  { id: 'monthly', label: 'Mes' },
  { id: 'global', label: 'Geral' },
  { id: 'friends', label: 'Amigos' },
  { id: 'school', label: 'Escola' },
];

const leagueStyles: Record<RankingLeague, string> = {
  bronze: 'border-orange-400/25 bg-orange-400/10 text-orange-200',
  silver: 'border-zinc-200/20 bg-zinc-200/10 text-zinc-100',
  gold: 'border-amber-300/25 bg-amber-300/10 text-amber-200',
  diamond: 'border-cyan-300/25 bg-cyan-300/10 text-cyan-200',
  master: 'border-violet-300/25 bg-violet-300/10 text-violet-200',
};

const leagueLabels: Record<RankingLeague, string> = {
  bronze: 'Bronze', silver: 'Prata', gold: 'Ouro', diamond: 'Diamante', master: 'Mestre',
};

function initials(name: string) {
  return name.split(/\s+/).map((part) => part[0]).join('').slice(0, 2).toUpperCase() || 'SF';
}

function Avatar({ row, className }: { row: RankingRow; className?: string }) {
  const [failed, setFailed] = useState(false);
  if (row.avatar && !failed) {
    return <img src={row.avatar} alt="" onError={() => setFailed(true)} className={cn('size-12 shrink-0 rounded-full border border-white/10 bg-white/10 object-cover', className)} />;
  }
  return (
    <div className={cn('flex size-12 shrink-0 items-center justify-center rounded-full border border-primary/20 bg-primary/10 text-sm font-black text-primary', className)}>
      {initials(row.name)}
    </div>
  );
}

function LeagueBadge({ league }: { league: RankingLeague }) {
  return (
    <span className={cn('inline-flex items-center gap-1 rounded-full border px-2 py-1 text-[9px] font-black uppercase tracking-[0.12em]', leagueStyles[league])}>
      <Shield size={10} />{leagueLabels[league]}
    </span>
  );
}

function EmptyRanking({ period }: { period: RankingPeriod }) {
  const content = {
    today: ['Seu ranking de hoje comeca na primeira questao.', 'Resolva uma questao para registrar XP nas ultimas 24 horas.', Target],
    weekly: ['A semana ainda esta aberta.', 'Suas tentativas dos ultimos 7 dias aparecem aqui automaticamente.', Trophy],
    monthly: ['Nenhuma atividade neste mes.', 'Resolva questoes para entrar no ranking dos ultimos 30 dias.', Trophy],
    global: ['Nenhum aluno no ranking ainda.', 'Seu XP sincronizado vai liberar a classificacao geral.', Users],
    friends: ['Seu grupo ainda esta vazio.', 'Quando houver amigos vinculados, a disputa privada aparece aqui.', UserRound],
    school: ['Nenhuma escola vinculada.', 'Adicione sua escola ou turma ao perfil para liberar este ranking.', School],
  } as const;
  const [title, description, Icon] = content[period];
  return (
    <GlassCard className="premium-empty-panel border-white/[0.08] p-8 text-center sm:p-12">
      <div className="mx-auto mb-5 flex size-16 items-center justify-center rounded-[22px] border border-white/10 bg-white/[0.045] text-white/45"><Icon size={27} /></div>
      <h3 className="text-xl font-premium-title text-white">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-text-secondary">{description}</p>
    </GlassCard>
  );
}

function PodiumCard({ row, position }: { row: RankingRow; position: number }) {
  const isWinner = position === 1;
  const tone = position === 1
    ? 'border-amber-300/30 bg-amber-300/[0.08]'
    : position === 2 ? 'border-zinc-200/20 bg-zinc-200/[0.055]' : 'border-orange-400/20 bg-orange-400/[0.055]';
  const medalTone = position === 1 ? 'text-amber-300' : position === 2 ? 'text-zinc-200' : 'text-orange-300';
  return (
    <motion.article
      layout initial={{ opacity: 0, y: 24, scale: 0.94 }} animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 220, damping: 22, delay: position * 0.06 }}
      className={cn(
        'relative flex min-w-0 flex-1 flex-col items-center rounded-[22px] border px-2 pb-4 pt-5 text-center sm:px-4', tone,
        isWinner ? 'order-2 min-h-[246px] shadow-[0_18px_60px_rgba(255,215,0,0.08)]' : position === 2 ? 'order-1 min-h-[218px]' : 'order-3 min-h-[204px]'
      )}
    >
      <div className={cn('absolute -top-3 flex size-8 items-center justify-center rounded-full border border-current/20 bg-[#0b0d0c]', medalTone)}>
        {isWinner ? <Crown size={17} /> : <Medal size={16} />}
      </div>
      <Avatar row={row} className={cn('mt-1 size-16 sm:size-20', isWinner && 'ring-4 ring-amber-300/10')} />
      <p className="mt-3 w-full truncate text-sm font-black text-white">{row.name}</p>
      <div className="mt-2"><LeagueBadge league={row.league} /></div>
      <p className={cn('mt-3 text-lg font-black', medalTone)}>{row.xp.toLocaleString('pt-BR')} XP</p>
      <div className="mt-auto grid w-full grid-cols-2 gap-1 pt-3 text-[9px] font-premium-mono uppercase tracking-[0.08em] text-white/45">
        <span>{row.questionsSolved} questoes</span><span>{row.accuracy}% acerto</span>
        <span>Nv. {row.level}</span><span>{row.streak} dias</span>
      </div>
      <span className={cn('absolute bottom-3 right-3 text-3xl font-black opacity-15', medalTone)}>#{position}</span>
    </motion.article>
  );
}

function Podium({ rows }: { rows: RankingRow[] }) {
  const top = rows.slice(0, 3);
  if (top.length === 0) return null;
  return (
    <section aria-label="Podio" className={cn('mx-auto flex w-full max-w-4xl items-end justify-center gap-2 sm:gap-3', top.length === 1 && 'max-w-xs')}>
      {top.map((row, index) => <PodiumCard key={row.id} row={row} position={index + 1} />)}
    </section>
  );
}

function Movement({ position, previousPosition }: { position: number; previousPosition?: number }) {
  if (!previousPosition || previousPosition === position) return <span className="inline-flex items-center gap-1 text-white/35"><Minus size={13} /> estavel</span>;
  const climbed = previousPosition > position;
  const amount = Math.abs(previousPosition - position);
  return climbed
    ? <span className="inline-flex items-center gap-1 text-primary"><TrendingUp size={13} /> {amount}</span>
    : <span className="inline-flex items-center gap-1 text-rose-300"><TrendingDown size={13} /> {amount}</span>;
}

const RankingItem = memo(function RankingItem({ row, position, index }: { row: RankingRow; position: number; index: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(index * 0.035, 0.28) }}
      className={cn(
        'group grid grid-cols-[auto_auto_minmax(0,1fr)_auto] items-center gap-3 rounded-[20px] border p-3 transition duration-300 hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/[0.055] sm:p-4',
        row.isSelf ? 'border-primary/30 bg-primary/[0.075]' : 'border-white/[0.08] bg-white/[0.035]'
      )}
    >
      <div className={cn('flex size-9 items-center justify-center rounded-xl text-xs font-black', row.isSelf ? 'bg-primary text-black' : 'bg-white/[0.06] text-white/55')}>#{position}</div>
      <Avatar row={row} />
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <p className="truncate text-sm font-black text-white">{row.name}</p>
          {row.isSelf ? <Badge variant="primary">Voce</Badge> : <LeagueBadge league={row.league} />}
        </div>
        <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1 text-[10px] text-white/45">
          <span>Nivel {row.level}</span><span>{row.questionsSolved} questoes</span><span>{row.accuracy}% acerto</span>
          <Movement position={position} previousPosition={row.previousPosition} />
        </div>
      </div>
      <div className="text-right">
        <p className="text-sm font-black text-primary">{row.xp.toLocaleString('pt-BR')}</p>
        <p className="mt-1 inline-flex items-center gap-1 text-[10px] text-amber-200/75"><Flame size={11} /> {row.streak}</p>
      </div>
    </motion.article>
  );
});

function LeaguesModal({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      className="fixed inset-0 z-[180] flex items-end justify-center bg-black/75 p-3 backdrop-blur-md sm:items-center"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onMouseDown={(event) => event.target === event.currentTarget && onClose()}
    >
      <motion.div
        role="dialog" aria-modal="true" aria-labelledby="league-title"
        initial={{ opacity: 0, y: 24, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 16, scale: 0.98 }}
        className="w-full max-w-lg rounded-[24px] border border-white/10 bg-[#0b0d0c] p-5 shadow-2xl sm:p-6"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <Badge variant="primary">Progressao</Badge>
            <h2 id="league-title" className="mt-3 text-2xl font-premium-title text-white">Ligas StudyFlow</h2>
            <p className="mt-1 text-sm text-text-secondary">Ganhe XP estudando e avance de liga.</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Fechar" className="flex size-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/60 transition hover:bg-white/10 hover:text-white"><X size={18} /></button>
        </div>
        <div className="mt-6 space-y-2">
          {LEAGUES.map((league) => (
            <div key={league.id} className="flex items-center gap-3 rounded-2xl border border-white/[0.07] bg-white/[0.035] p-3">
              <div className="flex size-10 items-center justify-center rounded-xl border" style={{ color: league.color, borderColor: league.color + '42', backgroundColor: league.color + '14' }}><Shield size={18} /></div>
              <div className="flex-1">
                <p className="text-sm font-black text-white">{league.label}</p>
                <p className="text-xs text-white/45">{league.minXp.toLocaleString('pt-BR')} - {league.maxXp === null ? 'sem limite' : league.maxXp.toLocaleString('pt-BR')} XP</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-5 rounded-2xl border border-primary/15 bg-primary/[0.06] p-4 text-xs leading-relaxed text-white/60">
          Questao respondida: +5 XP. Acerto: +10 XP. Metas, streaks e simulados liberam bonus adicionais.
        </div>
      </motion.div>
    </motion.div>
  );
}

export const Ranking: React.FC<{ onBack?: () => void }> = ({ onBack }) => {
  const reduceMotion = useReducedMotion() ?? false;
  const { name, xp, level, streak, leaderboard, userId, profilePic, history } = useStore();
  const [period, setPeriod] = useState<RankingPeriod>('global');
  const [showLeagues, setShowLeagues] = useState(false);

  const rows = useMemo(() => {
    const self = buildSelfRankingRow({ id: userId, name, xp, level, streak, profilePic, history: history || [], period });
    if (period === 'global') {
      const remote = mapRemoteLeaderboardRows(leaderboard || [], userId);
      const byId = new Map(remote.map((row) => [row.id, row]));
      if (self) byId.set(self.id, { ...byId.get(self.id), ...self, isSelf: true });
      return sortRankingRows(Array.from(byId.values()));
    }
    return self ? [self] : [];
  }, [history, leaderboard, level, name, period, profilePic, streak, userId, xp]);

  const selfPositionIndex = rows.findIndex((row) => row.isSelf);
  const selfPosition = selfPositionIndex + 1;
  const selfRow = selfPositionIndex >= 0 ? rows[selfPositionIndex] : null;
  const nextRow = selfPositionIndex > 0 ? rows[selfPositionIndex - 1] : null;
  const xpToNext = selfRow && nextRow ? Math.max(0, nextRow.xp - selfRow.xp + 1) : 0;
  const questionsToNext = Math.max(1, Math.ceil(xpToNext / 15));
  const accuracy = selfRow?.accuracy ?? 0;

  return (
    <div className="app-shell-premium min-h-screen pb-36 pt-5 md:pt-8">
      <header className="premium-page-hero relative overflow-hidden rounded-[24px] border border-white/[0.08] bg-white/[0.028] p-5 sm:p-7">
        <div className="absolute right-0 top-0 h-56 w-56 rounded-full bg-amber-300/[0.055] blur-3xl" />
        <div className="relative flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-start gap-3 sm:gap-4">
            {onBack ? <AnimatedButton onClick={onBack} variant="secondary" className="size-11 shrink-0 p-0"><ChevronLeft size={20} /></AnimatedButton> : null}
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="primary">Temporada atual</Badge>
                <button type="button" onClick={() => setShowLeagues(true)} className="rounded-full border border-white/10 bg-white/[0.045] px-3 py-1 text-[9px] font-black uppercase tracking-[0.16em] text-white/55 transition hover:border-primary/30 hover:text-primary">Ver ligas</button>
              </div>
              <h1 className="mt-4 text-3xl font-premium-title text-white sm:text-5xl">Ranking StudyFlow</h1>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-text-secondary">Consistencia vence pressa. Resolva questoes, mantenha sua sequencia e avance de liga.</p>
            </div>
          </div>
          <div className="hidden size-16 items-center justify-center rounded-[22px] border border-amber-300/20 bg-amber-300/[0.08] text-amber-200 sm:flex"><Trophy size={29} /></div>
        </div>
        <div className="relative mt-6 grid grid-cols-3 gap-2 sm:max-w-xl sm:gap-3">
          {[
            [Zap, xp.toLocaleString('pt-BR'), 'XP total'],
            [Flame, String(streak), 'dias'],
            [BookOpenCheck, accuracy + '%', 'precisao'],
          ].map(([Icon, value, label]) => {
            const StatIcon = Icon as typeof Zap;
            return (
              <div key={String(label)} className="rounded-2xl border border-white/[0.07] bg-black/20 p-3">
                <StatIcon size={15} className="mb-2 text-primary" />
                <p className="text-base font-black text-white sm:text-lg">{String(value)}</p>
                <p className="text-[9px] uppercase tracking-[0.12em] text-white/40">{String(label)}</p>
              </div>
            );
          })}
        </div>
      </header>

      <nav aria-label="Periodo do ranking" className="mt-5 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex min-w-max gap-2 rounded-[18px] border border-white/[0.07] bg-white/[0.025] p-1.5">
          {tabs.map((tab) => {
            const active = period === tab.id;
            return (
              <button key={tab.id} type="button" aria-pressed={active} onClick={() => setPeriod(tab.id)}
                className={cn('min-h-10 rounded-[13px] px-4 text-[10px] font-black uppercase tracking-[0.12em] transition', active ? 'bg-primary text-black shadow-[0_8px_24px_rgba(var(--hub-primary-rgb),0.18)]' : 'text-white/45 hover:bg-white/[0.05] hover:text-white')}>
                {tab.label}
              </button>
            );
          })}
        </div>
      </nav>

      <AnimatePresence mode="wait">
        <motion.div key={period} initial={{ opacity: 0, x: reduceMotion ? 0 : 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: reduceMotion ? 0 : -8 }} transition={{ duration: reduceMotion ? 0.01 : 0.24 }} className="mt-7 space-y-7">
          {rows.length === 0 ? <EmptyRanking period={period} /> : (
            <>
              <Podium rows={rows} />
              {rows.length > 3 ? (
                <section>
                  <div className="mb-3 flex items-center justify-between">
                    <div><p className="text-[10px] font-black uppercase tracking-[0.16em] text-primary">Classificacao</p><h2 className="mt-1 text-xl font-premium-title text-white">Disputa da liga</h2></div>
                    <span className="text-xs text-white/40">{rows.length} alunos</span>
                  </div>
                  <div className="space-y-2">{rows.slice(3).map((row, index) => <RankingItem key={row.id} row={row} position={index + 4} index={index} />)}</div>
                </section>
              ) : null}
            </>
          )}
        </motion.div>
      </AnimatePresence>

      {selfRow ? (
        <motion.aside initial={{ opacity: 0, y: reduceMotion ? 0 : 18 }} animate={{ opacity: 1, y: 0 }} className="sticky bottom-[5.8rem] z-30 mt-7">
          <GlassCard enterAnimation={false} className="border-primary/30 bg-[#0b1511]/95 p-4 shadow-[0_18px_60px_rgba(0,0,0,0.45)] backdrop-blur-2xl">
            <div className="flex items-center gap-3">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-primary text-sm font-black text-black">#{selfPosition}</div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-black text-white">Sua posicao</p>
                <p className="mt-1 truncate text-xs text-text-secondary">{nextRow ? 'Faltam cerca de ' + questionsToNext + ' questoes para ultrapassar ' + nextRow.name + '.' : 'Voce lidera este recorte. Continue protegendo sua posicao.'}</p>
              </div>
              <div className="hidden text-right sm:block"><p className="text-sm font-black text-primary">{selfRow.xp.toLocaleString('pt-BR')} XP</p><p className="text-[10px] text-white/40">{selfRow.accuracy}% acerto</p></div>
              <Award size={20} className="shrink-0 text-amber-200" />
            </div>
          </GlassCard>
        </motion.aside>
      ) : null}

      <AnimatePresence>{showLeagues ? <LeaguesModal onClose={() => setShowLeagues(false)} /> : null}</AnimatePresence>
    </div>
  );
};
