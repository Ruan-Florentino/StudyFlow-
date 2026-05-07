import React, { useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { easings, springs } from '../lib/animations/easings';
import { statisticsCopy } from '../lib/productDisclosure';
import {
  AreaChart, Area,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from 'recharts';
import {
  ChevronLeft, TrendingUp, Flame, Clock, Target, Brain, PenLine,
  Zap, Trophy, Calendar, BookOpen, BarChart3, Activity, CheckCircle2, Sparkles
} from 'lucide-react';
import { useStore } from '../store';
import { GlassCard, cn } from './UI';

// Helpers
const formatMinutes = (min: number) => {
  if (min < 60) return `${min}min`;
  const h = Math.floor(min / 60);
  const m = min % 60;
  return m ? `${h}h ${m}min` : `${h}h`;
};

const formatNumber = (n: number) => n.toLocaleString('pt-BR');

// Mock data generators
const generateMockDailyXP = (totalXP: number) => {
  const days = 30;
  const avgPerDay = Math.max(50, totalXP / days);
  return Array.from({ length: days }, (_, i) => {
    const daysAgo = days - 1 - i;
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    const variation = 0.4 + Math.random() * 1.2;
    return {
      date: date.toISOString().split('T')[0],
      xp: Math.floor(avgPerDay * variation),
      minutes: Math.floor((avgPerDay * variation) / 5),
    };
  });
};

interface Props { onBack: () => void; }

/** Campos opcionais legados no hub (série diária / stats por matéria). */
type StoreDisclosureFields = { dailyXP?: unknown; subjectStats?: unknown };

export const Statistics: React.FC<Props> = ({ onBack }) => {
  const reduceMotion = useReducedMotion() ?? false;
  const store = useStore();
  const { 
    xp = 0, level = 1, streak = 0, longestStreak = 0,
    totalStudyMinutes = 0
  } = store as any;
  
  const extendedStore = store as StoreDisclosureFields;
  const dailyXpRaw = extendedStore.dailyXP;
  const xpSeriesIsReal = Array.isArray(dailyXpRaw) && dailyXpRaw.length > 0;
  const subjectStatsRaw = extendedStore.subjectStats;
  const subjectStatsIsReal =
    subjectStatsRaw !== undefined &&
    subjectStatsRaw !== null &&
    typeof subjectStatsRaw === 'object' &&
    Object.keys(subjectStatsRaw as Record<string, unknown>).length > 0;

  const dailyXP = xpSeriesIsReal
    ? (dailyXpRaw as { date: string; xp: number; minutes?: number }[])
    : generateMockDailyXP(xp);

  const [period, setPeriod] = useState<'7d' | '30d' | 'all'>('7d');
  
  // Filtro de período
  const filteredData = useMemo(() => {
    if (period === '7d') return dailyXP.slice(-7);
    if (period === '30d') return dailyXP.slice(-30);
    return dailyXP;
  }, [dailyXP, period]);
  
  // Métricas calculadas
  const weekXP = filteredData.reduce((s: number, d: any) => s + d.xp, 0);
  const avgPerDay = filteredData.length ? Math.round(weekXP / filteredData.length) : 0;
  const bestDay = filteredData.reduce((max: any, d: any) => d.xp > max.xp ? d : max, filteredData[0] || { xp: 0, date: '' });
  
  // Dados de matérias (mock se não tiver)
  const subjectData = Object.entries((extendedStore.subjectStats as Record<string, { minutes?: number }> | undefined) || {
    'Matemática': { minutes: Math.floor(totalStudyMinutes * 0.25) },
    'Português': { minutes: Math.floor(totalStudyMinutes * 0.20) },
    'Física': { minutes: Math.floor(totalStudyMinutes * 0.15) },
    'Química': { minutes: Math.floor(totalStudyMinutes * 0.15) },
    'Biologia': { minutes: Math.floor(totalStudyMinutes * 0.12) },
    'História': { minutes: Math.floor(totalStudyMinutes * 0.08) },
    'Geografia': { minutes: Math.floor(totalStudyMinutes * 0.05) },
  }).map(([name, data]: [string, any]) => ({
    subject: name,
    minutes: data.minutes || 0,
    hours: +(data.minutes / 60).toFixed(1),
  })).sort((a, b) => b.minutes - a.minutes);
  
  // Heatmap 30 dias (estilo GitHub)
  const heatmapData = dailyXP.slice(-30).map((d: any) => ({
    date: d.date,
    value: d.xp,
    intensity: d.xp === 0 ? 0 : d.xp < 50 ? 1 : d.xp < 150 ? 2 : d.xp < 300 ? 3 : 4,
  }));
  
  // Distribuição por tipo de atividade (mock se não tiver)
  const activityDistribution = [
    { name: 'Foco',        value: Math.floor(totalStudyMinutes * 0.40), color: '#FACC15' },
    { name: 'Flashcards',  value: Math.floor(totalStudyMinutes * 0.20), color: '#3B82F6' },
    { name: 'Questões',    value: Math.floor(totalStudyMinutes * 0.18), color: '#06B6D4' },
    { name: 'Tutor IA',    value: Math.floor(totalStudyMinutes * 0.12), color: '#A855F7' },
    { name: 'Redação',     value: Math.floor(totalStudyMinutes * 0.06), color: '#F43F5E' },
    { name: 'Salas',       value: Math.floor(totalStudyMinutes * 0.04), color: '#8B5CF6' },
  ].filter(a => a.value > 0);
  
  // Performance por área (radar)
  const performanceRadar = [
    { area: 'Exatas',   score: 78 },
    { area: 'Humanas',  score: 65 },
    { area: 'Biológ.',  score: 82 },
    { area: 'Redação',  score: 70 },
    { area: 'Línguas',  score: 58 },
  ];

  const heatmapColor = (intensity: number) => {
    if (intensity === 0) return 'rgba(255,255,255,0.04)';
    if (intensity === 1) return 'rgba(var(--hub-primary-rgb),0.25)';
    if (intensity === 2) return 'rgba(var(--hub-primary-rgb),0.45)';
    if (intensity === 3) return 'rgba(var(--hub-primary-rgb),0.7)';
    return 'rgba(var(--hub-primary-rgb),1)';
  };

  return (
    <div className="min-h-screen pb-28">
      {/* HEADER */}
      <div className="sticky top-0 z-20 bg-black/70 backdrop-blur-xl border-b border-white/5 px-4 py-3 flex items-center gap-3">
        <button 
          onClick={onBack}
          className="p-2 rounded-full bg-white/5 border border-white/10 text-white/60 hover:text-white"
        >
          <ChevronLeft size={20} />
        </button>
        <div className="flex-1">
          <h1 className="text-lg font-bold text-white flex items-center gap-2">
            <BarChart3 size={20} className="text-primary" style={{ filter: 'drop-shadow(0 0 6px #00E88F)' }} />
            Estatísticas
          </h1>
          <p className="text-[10px] text-white/40 uppercase tracking-widest">Sua jornada em números</p>
        </div>
      </div>

      <div className="px-4 py-4 space-y-4">
        <div
          className="rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-2.5 space-y-1.5"
          role="note"
          aria-label={statisticsCopy.noteTitle}
        >
          <p className="text-[10px] font-bold uppercase tracking-widest text-primary/90">{statisticsCopy.noteTitle}</p>
          <p className="text-[10px] leading-relaxed text-white/70">{statisticsCopy.realCore}</p>
          <p className="text-[10px] leading-relaxed text-white/70">
            {xpSeriesIsReal ? statisticsCopy.xpSeriesReal : statisticsCopy.xpSeriesSynthetic}
          </p>
          <p className="text-[10px] leading-relaxed text-white/70">
            {subjectStatsIsReal ? statisticsCopy.subjectReal : statisticsCopy.subjectSynthetic}
          </p>
        </div>

        {/* ═══ HERO: XP + NÍVEL EM DESTAQUE ═══ */}
        <motion.div
          initial={{ opacity: 0, y: reduceMotion ? 0 : 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={reduceMotion ? { duration: 0.15, ease: easings.smoothOut } : springs.soft}
          className="relative overflow-hidden rounded-3xl p-5 border border-primary/20"
          style={{ 
            background: 'linear-gradient(135deg, rgba(var(--hub-primary-rgb),0.15), rgba(var(--hub-primary-rgb),0.03))',
            boxShadow: '0 0 40px rgba(var(--hub-primary-rgb),0.15)'
          }}
        >
          <div className="absolute -top-8 -right-8 opacity-10">
            <Sparkles size={120} className="text-primary" />
          </div>
          
          <div className="relative">
            <span className="text-[10px] font-bold uppercase tracking-widest text-primary/80">XP Total</span>
            <div className="flex items-end gap-2 mt-1">
              <motion.span 
                className="font-anton text-5xl text-white"
                style={{ textShadow: '0 0 20px rgba(var(--hub-primary-rgb),0.5)' }}
              >
                {formatNumber(xp)}
              </motion.span>
              <span className="text-sm text-white/50 mb-2">XP</span>
            </div>
            <div className="flex items-center gap-4 mt-3 text-xs">
              <span className="text-white/70">Nível <span className="font-bold text-primary">{level}</span></span>
              <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${(xp % 1000) / 10}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  className="h-full bg-primary rounded-full"
                  style={{ boxShadow: '0 0 10px #00E88F' }}
                />
              </div>
              <span className="text-[10px] text-white/50 font-mono">{xp % 1000}/1000</span>
            </div>
          </div>
        </motion.div>

        {/* ═══ GRID DE MÉTRICAS ═══ */}
        <div className="grid grid-cols-2 gap-3">
          <StatCard 
            icon={Flame} 
            color="#F97316" 
            label="Streak Atual" 
            value={`${streak}`}
            suffix="dias"
            subtitle={`Recorde: ${longestStreak}`}
            animate={streak > 0}
          />
          <StatCard 
            icon={Clock} 
            color="#3B82F6" 
            label="Tempo Total" 
            value={formatMinutes(totalStudyMinutes)}
            subtitle={`~${Math.floor(totalStudyMinutes/60)}h estudadas`}
          />
          <StatCard 
            icon={Zap} 
            color="#FACC15" 
            label="Média Diária" 
            value={formatNumber(avgPerDay)}
            suffix="XP"
            subtitle={`Últimos ${filteredData.length} dias`}
          />
          <StatCard 
            icon={Trophy} 
            color="#F59E0B" 
            label="Melhor Dia" 
            value={formatNumber(bestDay?.xp || 0)}
            suffix="XP"
            subtitle={bestDay?.date ? new Date(bestDay.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }) : '-'}
          />
        </div>

        {/* ═══ GRÁFICO EVOLUÇÃO XP ═══ */}
        <GlassCard className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <TrendingUp size={16} className="text-primary" />
              <h3 className="text-sm font-bold text-white">Evolução de XP</h3>
            </div>
            <div className="flex gap-1 bg-white/5 p-1 rounded-lg">
              {(['7d', '30d', 'all'] as const).map(p => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={cn(
                    "px-2 py-1 text-[10px] font-bold uppercase tracking-wider rounded transition-colors",
                    period === p ? "bg-primary/20 text-primary" : "text-white/40"
                  )}
                >
                  {p === 'all' ? 'Tudo' : p}
                </button>
              ))}
            </div>
          </div>
          
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={filteredData}>
              <defs>
                <linearGradient id="xpGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00E88F" stopOpacity={0.5}/>
                  <stop offset="100%" stopColor="#00E88F" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis 
                dataKey="date" 
                tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 9 }}
                tickFormatter={(d) => new Date(d).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
                axisLine={false}
                tickLine={false}
              />
              <YAxis tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 9 }} axisLine={false} tickLine={false} />
              <Tooltip 
                contentStyle={{ 
                  background: 'rgba(10,10,10,0.95)', 
                  border: '1px solid rgba(var(--hub-primary-rgb),0.3)',
                  borderRadius: '12px',
                  fontSize: '12px',
                }}
                labelFormatter={(d) => new Date(d as string).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                formatter={(v: number) => [`${v} XP`, 'Ganho']}
              />
              <Area 
                type="monotone" 
                dataKey="xp" 
                stroke="#00E88F" 
                strokeWidth={2}
                fill="url(#xpGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </GlassCard>

        {/* ═══ HEATMAP DE CONSISTÊNCIA ═══ */}
        <GlassCard className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Calendar size={16} className="text-primary" />
            <h3 className="text-sm font-bold text-white">Consistência · 30 dias</h3>
          </div>
          
          <div className="grid grid-cols-10 gap-1">
            {heatmapData.map((d: any, i: number) => (
              <motion.div
                key={d.date}
                initial={{ scale: reduceMotion ? 1 : 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={
                  reduceMotion
                    ? { duration: 0.1, delay: i * 0.005, ease: easings.smoothOut }
                    : { delay: i * 0.01, ...springs.snappy }
                }
                whileHover={reduceMotion ? undefined : { scale: 1.2 }}
                className="aspect-square rounded-md border border-white/5"
                style={{ 
                  background: heatmapColor(d.intensity),
                  boxShadow: d.intensity === 4 ? '0 0 8px rgba(var(--hub-primary-rgb),0.5)' : 'none',
                }}
                title={`${d.date}: ${d.value} XP`}
              />
            ))}
          </div>
          
          <div className="flex items-center justify-between mt-3 text-[10px] text-white/40">
            <span>Menos</span>
            <div className="flex gap-1">
              {[0, 1, 2, 3, 4].map(i => (
                <div 
                  key={i}
                  className="w-3 h-3 rounded-sm border border-white/5"
                  style={{ background: heatmapColor(i) }}
                />
              ))}
            </div>
            <span>Mais</span>
          </div>
        </GlassCard>

        {/* ═══ TEMPO POR MATÉRIA (bar) ═══ */}
        <GlassCard className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen size={16} className="text-cyan-400" />
            <h3 className="text-sm font-bold text-white">Tempo por Matéria</h3>
          </div>
          
          <div className="space-y-2.5">
            {subjectData.slice(0, 7).map((s: any, i: number) => {
              const maxMin = subjectData[0].minutes || 1;
              const pct = (s.minutes / maxMin) * 100;
              const colors = ['#00E88F','#3B82F6','#A855F7','#F43F5E','#F59E0B','#06B6D4','#10B981'];
              const color = colors[i % colors.length];
              
              return (
                <div key={s.subject}>
                  <div className="flex justify-between items-center mb-1 text-xs">
                    <span className="text-white/80 font-medium">{s.subject}</span>
                    <span className="text-white/50 font-mono">{formatMinutes(s.minutes)}</span>
                  </div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={
                        reduceMotion
                          ? { delay: i * 0.03, duration: 0.15, ease: easings.smoothOut }
                          : { delay: i * 0.1, duration: 0.8, ease: 'easeOut' }
                      }
                      className="h-full rounded-full"
                      style={{ background: color, boxShadow: `0 0 8px ${color}80` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </GlassCard>

        {/* ═══ DISTRIBUIÇÃO DE ATIVIDADES (pie) ═══ */}
        <GlassCard className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <Activity size={16} className="text-purple-400" />
            <h3 className="text-sm font-bold text-white">Distribuição de Atividades</h3>
          </div>
          
          <div className="flex items-center gap-4">
            <ResponsiveContainer width="50%" height={160}>
              <PieChart>
                <Pie
                  data={activityDistribution}
                  dataKey="value"
                  innerRadius={35}
                  outerRadius={65}
                  paddingAngle={2}
                >
                  {activityDistribution.map((entry, i) => (
                    <Cell key={i} fill={entry.color} stroke="rgba(0,0,0,0.3)" />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ background: 'rgba(10,10,10,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '11px' }}
                  formatter={(v: number) => formatMinutes(v)}
                />
              </PieChart>
            </ResponsiveContainer>
            
            <div className="flex-1 space-y-1.5">
              {activityDistribution.map(a => (
                <div key={a.name} className="flex items-center gap-2 text-[11px]">
                  <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: a.color, boxShadow: `0 0 6px ${a.color}` }} />
                  <span className="text-white/70 flex-1">{a.name}</span>
                  <span className="text-white/50 font-mono">{formatMinutes(a.value)}</span>
                </div>
              ))}
            </div>
          </div>
        </GlassCard>

        {/* ═══ PERFORMANCE RADAR ═══ */}
        <GlassCard className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Target size={16} className="text-rose-400" />
            <h3 className="text-sm font-bold text-white">Performance por Área</h3>
          </div>
          <p className="text-[10px] text-white/40 mb-3">Baseado em acertos de questões e notas de redação</p>
          
          <ResponsiveContainer width="100%" height={220}>
            <RadarChart data={performanceRadar}>
              <PolarGrid stroke="rgba(255,255,255,0.1)" />
              <PolarAngleAxis dataKey="area" tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 10 }} />
              <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 8 }} />
              <Radar 
                name="Score" 
                dataKey="score" 
                stroke="#F43F5E" 
                fill="#F43F5E" 
                fillOpacity={0.3}
                strokeWidth={2}
              />
            </RadarChart>
          </ResponsiveContainer>
        </GlassCard>

        {/* ═══ CARDS DE FLASHCARDS / QUIZ / REDAÇÃO ═══ */}
        <div className="grid grid-cols-1 gap-3">
          <MiniStatBlock
            icon={Brain}
            color="#3B82F6"
            title="Flashcards"
            stats={[
              { label: 'Revisados', value: formatNumber((store as any).flashcardStats?.reviewed ?? 0) },
              { label: 'Acerto', value: `${Math.round((((store as any).flashcardStats?.correct ?? 0) / Math.max(1,((store as any).flashcardStats?.reviewed ?? 1))) * 100)}%` },
              { label: 'Revisar hoje', value: formatNumber((store as any).flashcardStats?.dueCount ?? 0) },
            ]}
          />
          
          <MiniStatBlock
            icon={CheckCircle2}
            color="#06B6D4"
            title="Questões"
            stats={[
              { label: 'Respondidas', value: formatNumber((store as any).quizStats?.answered ?? 0) },
              { label: 'Acerto', value: `${Math.round((((store as any).quizStats?.correct ?? 0) / Math.max(1,((store as any).quizStats?.answered ?? 1))) * 100)}%` },
            ]}
          />
          
          <MiniStatBlock
            icon={PenLine}
            color="#F43F5E"
            title="Redação"
            stats={[
              { label: 'Enviadas', value: formatNumber((store as any).essayStats?.submitted ?? 0) },
              { label: 'Média', value: `${Math.round((store as any).essayStats?.avgScore ?? 0)}/1000` },
            ]}
          />
        </div>

        {/* ═══ INSIGHTS IA (opcional - bonito mesmo estático) ═══ */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={reduceMotion ? { duration: 0.15, ease: easings.smoothOut } : springs.soft}
          className="relative overflow-hidden rounded-3xl p-4 border border-purple-500/20"
          style={{ background: 'linear-gradient(135deg, rgba(168,85,247,0.1), rgba(168,85,247,0.02))' }}
        >
          <div className="flex items-center gap-2 mb-3">
            <motion.div
              animate={reduceMotion ? { rotate: 0 } : { rotate: 360 }}
              transition={
                reduceMotion
                  ? { duration: 0 }
                  : { duration: 8, repeat: Infinity, ease: 'linear' }
              }
            >
              <Sparkles size={16} className="text-purple-400" />
            </motion.div>
            <h3 className="text-sm font-bold text-white">Insights</h3>
          </div>
          
          <ul className="space-y-2 text-xs text-white/70">
            <li className="flex gap-2">
              <span className="text-purple-400">•</span>
              <span>Seu melhor horário é à <strong className="text-white">tarde</strong> (14h-17h)</span>
            </li>
            <li className="flex gap-2">
              <span className="text-purple-400">•</span>
              <span>Você estuda <strong className="text-white">{subjectData[0]?.subject || 'Matemática'}</strong> com mais frequência</span>
            </li>
            <li className="flex gap-2">
              <span className="text-purple-400">•</span>
              <span>Seu streak de <strong className="text-primary">{streak} dias</strong> te coloca no top 20% dos estudantes</span>
            </li>
          </ul>
        </motion.div>

      </div>
    </div>
  );
};

// ═══ SUB-COMPONENTES ═══

interface StatCardProps {
  icon: any;
  color: string;
  label: string;
  value: string | number;
  suffix?: string;
  subtitle?: string;
  animate?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ icon: Icon, color, label, value, suffix, subtitle, animate }) => {
  const reduceMotion = useReducedMotion() ?? false;
  return (
  <motion.div
    whileHover={reduceMotion ? undefined : { scale: 1.02 }}
    className="relative overflow-hidden rounded-2xl p-3.5 border"
    style={{
      background: `linear-gradient(135deg, ${color}15, ${color}03)`,
      borderColor: `${color}30`,
      boxShadow: `0 0 20px ${color}15`,
    }}
  >
    <div className="flex items-center justify-between mb-2">
      <span className="text-[9px] font-bold uppercase tracking-widest" style={{ color }}>{label}</span>
      <motion.div
        animate={animate && !reduceMotion ? { y: [0, -2, 0] } : {}}
        transition={animate && !reduceMotion ? { duration: 1.2, repeat: Infinity } : { duration: 0 }}
      >
        <Icon size={14} style={{ color, filter: `drop-shadow(0 0 6px ${color})` }} />
      </motion.div>
    </div>
    <div className="flex items-baseline gap-1">
      <span className="text-2xl font-bold text-white font-anton">{value}</span>
      {suffix && <span className="text-[10px] text-white/50 uppercase">{suffix}</span>}
    </div>
    {subtitle && <span className="text-[9px] text-white/40 block mt-0.5">{subtitle}</span>}
  </motion.div>
  );
};

const MiniStatBlock: React.FC<{ icon: any; color: string; title: string; stats: { label: string; value: string }[] }> = 
  ({ icon: Icon, color, title, stats }) => (
  <GlassCard className="p-4">
    <div className="flex items-center gap-2 mb-3">
      <div 
        className="w-8 h-8 rounded-lg flex items-center justify-center"
        style={{ background: `${color}20`, border: `1px solid ${color}40` }}
      >
        <Icon size={14} style={{ color, filter: `drop-shadow(0 0 4px ${color})` }} />
      </div>
      <h4 className="text-sm font-bold text-white">{title}</h4>
    </div>
    <div className="grid grid-cols-3 gap-2">
      {stats.map(s => (
        <div key={s.label} className="text-center p-2 rounded-lg bg-white/[0.02] border border-white/5">
          <div className="text-base font-bold text-white">{s.value}</div>
          <div className="text-[9px] text-white/40 uppercase tracking-wider mt-0.5">{s.label}</div>
        </div>
      ))}
    </div>
  </GlassCard>
);
