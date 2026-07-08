import React, { useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Award, CalendarDays, ChevronLeft, Crown, Flame, Medal, Trophy, User, Users } from 'lucide-react';
import { AnimatedButton, Badge, GlassCard, cn } from './UI';
import { useStore } from '../store';
import {
  buildSelfRankingRow,
  mapRemoteLeaderboardRows,
  sortRankingRows,
  type RankingPeriod,
  type RankingRow,
} from '../services/rankingService';

const tabs: Array<{ id: RankingPeriod; label: string; description: string }> = [
  { id: 'global', label: 'Global', description: 'Todos os dados sincronizados' },
  { id: 'weekly', label: 'Semanal', description: 'Ultimos 7 dias' },
  { id: 'monthly', label: 'Mensal', description: 'Ultimos 30 dias' },
];

function initials(name: string) {
  return name.split(/\s+/).map((part) => part[0]).join('').slice(0, 2).toUpperCase() || 'SF';
}

function Avatar({ row, large = false }: { row: RankingRow; large?: boolean }) {
  const size = large ? 'size-16 text-lg' : 'size-11 text-sm';
  if (row.avatar) {
    return <img src={row.avatar} alt={row.name} className={cn(size, 'rounded-full border border-white/10 bg-white/10 object-cover')} />;
  }
  return (
    <div className={cn(size, 'flex shrink-0 items-center justify-center rounded-full border border-primary/20 bg-primary/10 font-black text-primary')}>
      {initials(row.name)}
    </div>
  );
}

function EmptyRanking({ period }: { period: RankingPeriod }) {
  const copy = period === 'weekly'
    ? 'Resolva questoes nesta semana para liberar o ranking semanal.'
    : period === 'monthly'
      ? 'Resolva questoes nos ultimos 30 dias para liberar o ranking mensal.'
      : 'Ainda nao ha ranking sincronizado. Resolva questoes para aparecer aqui.';

  return (
    <GlassCard className="premium-empty-panel p-8 text-center">
      <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-3xl border border-white/10 bg-white/[0.05] text-white/45"><Users size={24} /></div>
      <h3 className="text-2xl font-premium-title italic text-white">Ranking vazio</h3>
      <p className="mx-auto mt-2 max-w-md text-sm text-text-secondary">{copy}</p>
    </GlassCard>
  );
}

function Podium({ rows }: { rows: RankingRow[] }) {
  const top = rows.slice(0, 3);
  if (top.length === 0) return null;
  const order = [1, 0, 2].filter((index) => top[index]);
  const styles = ['h-28 border-amber-700/45 bg-amber-700/10', 'h-40 border-yellow-300/45 bg-yellow-300/10', 'h-32 border-zinc-300/35 bg-zinc-300/10'];

  return (
    <div className="grid grid-cols-3 items-end gap-3">
      {order.map((index) => {
        const row = top[index];
        const position = index + 1;
        const pedestal = position === 1 ? styles[1] : position === 2 ? styles[2] : styles[0];
        return (
          <motion.div key={row.id} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center gap-2">
            {position === 1 ? <Crown size={24} className="text-yellow-300" /> : <Medal size={20} className="text-white/45" />}
            <Avatar row={row} large />
            <div className="max-w-full text-center">
              <p className="truncate text-xs font-black text-white">{row.name}</p>
              <p className="text-[10px] font-premium-mono text-primary">{row.xp.toLocaleString('pt-BR')} XP</p>
            </div>
            <div className={cn('flex w-full items-start justify-center rounded-t-3xl border-t pt-3', pedestal)}>
              <span className="text-2xl font-black text-white">{position}</span>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

function RankingItem({ row, position }: { row: RankingRow; position: number }) {
  return (
    <div className={cn('premium-list-card flex items-center gap-3 rounded-[22px] border p-3', row.isSelf ? 'border-primary/35 bg-primary/10' : 'border-white/10 bg-white/[0.045]')}>
      <div className={cn('flex size-9 shrink-0 items-center justify-center rounded-2xl font-black', position <= 3 ? 'bg-primary text-black' : 'bg-white/[0.06] text-white/50')}>#{position}</div>
      <Avatar row={row} />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate text-sm font-black text-white">{row.name}</p>
          {row.isSelf ? <Badge variant="primary">Voce</Badge> : null}
        </div>
        <p className="mt-1 text-[10px] font-premium-mono uppercase tracking-widest text-white/45">Nv {row.level} | {row.questionsSolved} questoes | {row.accuracy}% acerto</p>
      </div>
      <div className="text-right">
        <p className="text-sm font-black text-primary">{row.xp.toLocaleString('pt-BR')}</p>
        <p className="text-[9px] uppercase tracking-widest text-white/40">XP</p>
      </div>
    </div>
  );
}

export const Ranking: React.FC<{ onBack?: () => void }> = ({ onBack }) => {
  const reduceMotion = useReducedMotion() ?? false;
  const { name, xp, level, streak, leaderboard, userId, profilePic, history } = useStore();
  const [period, setPeriod] = useState<RankingPeriod>('global');

  const rows = useMemo(() => {
    const self = buildSelfRankingRow({
      id: userId,
      name,
      xp,
      level,
      streak,
      profilePic,
      history: history || [],
      period,
    });

    if (period === 'global') {
      const remote = mapRemoteLeaderboardRows(leaderboard || [], userId);
      const byId = new Map(remote.map((row) => [row.id, row]));
      if (self) byId.set(self.id, { ...byId.get(self.id), ...self, isSelf: true });
      return sortRankingRows(Array.from(byId.values()));
    }

    return self ? [self] : [];
  }, [history, leaderboard, level, name, period, profilePic, streak, userId, xp]);

  const selfPosition = rows.findIndex((row) => row.isSelf) + 1;
  const selfRow = rows.find((row) => row.isSelf) ?? null;
  const nextRow = selfPosition > 1 ? rows[selfPosition - 2] : null;
  const xpToNext = selfRow && nextRow ? Math.max(0, nextRow.xp - selfRow.xp + 1) : 0;

  return (
    <div className="app-shell-premium premium-page-stack min-h-screen pb-32 pt-5 md:pt-8">
      <header className="premium-page-hero studyflow-command-hero p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-start gap-4">
            {onBack ? (
              <AnimatedButton onClick={onBack} variant="secondary" className="size-11 shrink-0 p-0"><ChevronLeft size={20} /></AnimatedButton>
            ) : null}
            <div className="space-y-2">
              <Badge variant="primary">Ranking seguro</Badge>
              <h1 className="text-4xl font-premium-title italic leading-tight text-white sm:text-5xl">Competicao com dado real.</h1>
              <p className="max-w-2xl text-sm leading-relaxed text-text-secondary">Global usa dados sincronizados quando houver. Semanal e mensal usam tentativas reais salvas no historico do usuario.</p>
            </div>
          </div>
          <div className="hidden size-16 items-center justify-center rounded-[26px] border border-primary/20 bg-primary/10 text-primary sm:flex"><Trophy size={30} /></div>
        </div>
      </header>

      <div className="grid grid-cols-3 gap-2">
        {tabs.map((tab) => {
          const active = period === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setPeriod(tab.id)}
              className={cn('rounded-[18px] border px-3 py-3 text-center transition-colors', active ? 'border-primary/35 bg-primary/12 text-primary' : 'border-white/10 bg-white/[0.045] text-white/55')}
            >
              <p className="text-xs font-black uppercase tracking-widest">{tab.label}</p>
              <p className="mt-1 hidden text-[10px] text-white/45 sm:block">{tab.description}</p>
            </button>
          );
        })}
      </div>

      {rows.length === 0 ? (
        <EmptyRanking period={period} />
      ) : (
        <>
          <Podium rows={rows} />
          <motion.div initial={{ opacity: 0, y: reduceMotion ? 0 : 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
            {rows.map((row, index) => <RankingItem key={row.id} row={row} position={index + 1} />)}
          </motion.div>
        </>
      )}

      {selfRow ? (
        <div className="sticky bottom-[5.75rem] z-20">
          <GlassCard enterAnimation={false} className="premium-list-card border-primary/30 bg-primary/[0.08] p-4">
            <div className="flex items-center gap-3">
              <Award size={20} className="text-primary" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-black text-white">Sua posicao: #{selfPosition}</p>
                <p className="text-xs text-text-secondary">{xpToNext > 0 ? `${xpToNext} XP ate o proximo colocado` : 'Voce esta no topo deste recorte.'}</p>
              </div>
              <div className="flex items-center gap-1 text-xs font-premium-mono text-primary"><Flame size={14} /> {selfRow.streak}</div>
            </div>
          </GlassCard>
        </div>
      ) : null}
    </div>
  );
};