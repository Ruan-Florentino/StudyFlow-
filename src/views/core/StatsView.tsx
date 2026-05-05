import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'motion/react';
import { 
  BarChart3, 
  Zap, 
  Target, 
  Flame, 
  Clock, 
  CheckCircle2, 
  Trophy, 
  AlertCircle, 
  Sparkles, 
  MessageSquare 
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  ComposedChart, 
  Bar, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar, 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  LineChart 
} from 'recharts';
import { useStore } from '../../store';
import { TOPICS } from '../../data/questions';
import { useQuestionMap } from '../../hooks/useQuestions';
import { QuestionsLoadingSkeleton } from '../../components/shared/QuestionsLoadingSkeleton';
import { QuestionsLoadError } from '../../components/shared/QuestionsLoadError';
import { GlassCard, cn, Header } from '../../components/UI';

import { useAppNavigation } from '../../app/router/useAppNavigation';
import { Heatmap } from '../../components/Heatmap';

const Reports = () => {
  const { history, xp, streak, themeColor, trackFeature } = useStore();
  const { questionMap: QUESTION_MAP, loading: qLoading, error: qError } = useQuestionMap();
  const { goBack } = useAppNavigation();

  useEffect(() => {
    trackFeature('reports');
  }, [trackFeature]);
  
  const total = (history || []).length;
  const correct = (history || []).filter(h => h.isCorrect).length;
  const incorrect = total - correct;
  const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;
  const [selectedMateria, setSelectedMateria] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('7d');

  const last7Days = [...Array(7)].map((_, i) => {
    const d = new Date();
    const daysBack = 6 - i;
    d.setDate(d.getDate() - daysBack);
    const dateStr = d.toISOString().split('T')[0];
    const dayHistory = (history || []).filter(h => h.timestamp && typeof h.timestamp === 'string' && h.timestamp.startsWith(dateStr));
    return {
      name: d.toLocaleDateString('pt-BR', { weekday: 'short' }),
      q: dayHistory.length,
      accuracy: dayHistory.length > 0 ? Math.round((dayHistory.filter(h => h.isCorrect).length / dayHistory.length) * 100) : 0
    };
  });

  const validTimes = (history || []).filter(h => h.timeSpent && h.timeSpent > 0).map(h => h.timeSpent!);
  const avgTimeSeconds = validTimes.length > 0 ? Math.round(validTimes.reduce((a, b) => a + b, 0) / validTimes.length) : 0;
  const avgTime = avgTimeSeconds > 0 ? `${avgTimeSeconds}s` : "--";

  const { subjectData, topicData, bestSubject, worstSubject, difficultyData, evolutionData, heatmapData } = useMemo(() => {
    if (!QUESTION_MAP) {
      return { subjectData: [], topicData: [], bestSubject: null, worstSubject: null, difficultyData: [], evolutionData: [], heatmapData: [] };
    }
    try {
      const subjectData = Object.keys(TOPICS).map(subject => {
        const subHistory = (history || []).filter(h => {
          const q = QUESTION_MAP?.get(h.questionId);
          return q?.materia === subject;
        });
        const subTotal = subHistory.length;
        const subCorrect = subHistory.filter(h => h.isCorrect).length;
        return {
          name: subject,
          acertos: subCorrect,
          erros: subTotal - subCorrect,
          total: subTotal,
          percent: subTotal > 0 ? Math.round((subCorrect / subTotal) * 100) : 0
        };
      }).filter(d => d.total > 0).sort((a, b) => b.total - a.total);

      const topicData = Object.values(TOPICS).flat().map(topic => {
        const topHistory = (history || []).filter(h => {
          const q = QUESTION_MAP?.get(h.questionId);
          return q?.assunto === topic;
        });
        const topTotal = topHistory.length;
        const topCorrect = topHistory.filter(h => h.isCorrect).length;
        return {
          name: topic,
          acertos: topCorrect,
          erros: topTotal - topCorrect,
          total: topTotal,
          percent: topTotal > 0 ? Math.round((topCorrect / topTotal) * 100) : 0
        };
      }).filter(d => d.total > 0).sort((a, b) => b.total - a.total).slice(0, 5); // Top 5 topics
      
      const bestSubject = subjectData.length > 0 ? [...subjectData].sort((a, b) => b.percent - a.percent)[0] : null;
      const worstSubject = subjectData.length > 0 ? [...subjectData].sort((a, b) => a.percent - b.percent)[0] : null;

      const difficultyData = [
        { name: 'Fácil', value: (history || []).filter(h => QUESTION_MAP?.get(h.questionId)?.difficulty === 'Easy').length, color: themeColor },
        { name: 'Médio', value: (history || []).filter(h => QUESTION_MAP?.get(h.questionId)?.difficulty === 'Medium').length, color: '#FFB800' },
        { name: 'Difícil', value: (history || []).filter(h => QUESTION_MAP?.get(h.questionId)?.difficulty === 'Hard').length, color: '#FF4444' }
      ].filter(d => d.value > 0);

      const evolutionData = Array.from({ length: timeRange === '7d' ? 7 : (timeRange === '30d' ? 30 : 90) }, (_, i) => {
        const d = new Date();
        const daysBack = (timeRange === '7d' ? 6 : (timeRange === '30d' ? 29 : 89)) - i;
        d.setDate(d.getDate() - daysBack);
        const dateStr = d.toISOString().split('T')[0];
        const dayHistory = (history || []).filter(h => h.timestamp && typeof h.timestamp === 'string' && h.timestamp.startsWith(dateStr));
        const count = dayHistory.length;
        const correctCount = dayHistory.filter(h => h.isCorrect).length;
        const accuracy = count > 0 ? Math.round((correctCount / count) * 100) : 0;
        return { 
          name: timeRange === '7d' ? d.toLocaleDateString('pt-BR', { weekday: 'short' }) : d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }), 
          q: count, 
          accuracy 
        };
      });

      const heatmapData = (history || []).reduce((acc: any[], h) => {
        if (!h.timestamp) return acc;
        const date = h.timestamp.split('T')[0];
        const existing = acc.find(d => d.date === date);
        if (existing) {
          existing.count++;
        } else {
          acc.push({ date, count: 1 });
        }
        return acc;
      }, []);

      return { subjectData, topicData, bestSubject, worstSubject, difficultyData, evolutionData, heatmapData };
    } catch (e) {
      console.error("Error calculating stats data:", e);
      return { subjectData: [], topicData: [], bestSubject: null, worstSubject: null, difficultyData: [], evolutionData: [], heatmapData: [] };
    }
  }, [history, QUESTION_MAP, timeRange, themeColor]);

  if (qLoading) return <QuestionsLoadingSkeleton />;
  if (qError) return <QuestionsLoadError error={qError} />;


  const pieData = [
    { name: 'Acertos', value: correct, color: themeColor },
    { name: 'Erros', value: incorrect, color: '#FF4444' }
  ];

  return (
    <div className="app-shell-premium pt-6 md:pt-8 app-stack-premium pb-32 md:pb-36">
      <Header 
        title="Estatísticas"
        subtitle="Performance"
        icon={BarChart3}
        color="primary"
        onBack={goBack}
        rightContent={
          <div className="flex gap-2">
            <div className="px-3 py-1 bg-primary/10 rounded-full border border-primary/20 flex items-center gap-1.5 shadow-[0_0_10px_rgba(0,232,143,0.2)]">
              <Zap size={12} className="text-primary" fill="currentColor" />
              <span className="text-[10px] font-premium-mono font-bold text-primary">{xp} XP</span>
            </div>
          </div>
        }
      />

      {/* Top Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <GlassCard className="p-4 border-white/5 bg-gradient-to-br from-white/5 to-transparent" glow>
          <div className="flex justify-between items-start mb-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Target size={16} className="text-primary" />
            </div>
            <span className="text-[10px] font-premium-mono text-text-secondary">ACCURACY</span>
          </div>
          <p className="text-3xl font-premium-title">{accuracy}%</p>
          <div className="mt-2 h-1 bg-white/5 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${accuracy}%` }}
              className="h-full bg-primary shadow-[0_0_10px_rgba(0,255,148,0.5)]"
            />
          </div>
        </GlassCard>

        <GlassCard className="p-4 border-white/5 bg-gradient-to-br from-white/5 to-transparent" glow>
          <div className="flex justify-between items-start mb-2">
            <div className="p-2 bg-orange-500/10 rounded-lg">
              <Flame size={16} className="text-orange-500" />
            </div>
            <span className="text-[10px] font-premium-mono text-text-secondary">STREAK</span>
          </div>
          <p className="text-3xl font-premium-title">{streak} <span className="text-xs text-text-secondary font-normal">DIAS</span></p>
          <p className="text-[8px] text-orange-500/70 font-bold uppercase mt-1 tracking-wider">Mantenha o fogo aceso!</p>
        </GlassCard>

        <GlassCard className="p-4 border-white/5 bg-gradient-to-br from-white/5 to-transparent" glow>
          <div className="flex justify-between items-start mb-2">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <Clock size={16} className="text-blue-500" />
            </div>
            <span className="text-[10px] font-premium-mono text-text-secondary">AVG TIME</span>
          </div>
          <p className="text-3xl font-premium-title">{avgTime}</p>
          <p className="text-[8px] text-blue-500/70 font-bold uppercase mt-1 tracking-wider">Tempo médio por questão</p>
        </GlassCard>

        <GlassCard className="p-4 border-white/5 bg-gradient-to-br from-white/5 to-transparent" glow>
          <div className="flex justify-between items-start mb-2">
            <div className="p-2 bg-purple-500/10 rounded-lg">
              <CheckCircle2 size={16} className="text-purple-500" />
            </div>
            <span className="text-[10px] font-premium-mono text-text-secondary">SOLVED</span>
          </div>
          <p className="text-3xl font-premium-title">{total}</p>
          <p className="text-[8px] text-purple-500/70 font-bold uppercase mt-1 tracking-wider">Total de questões respondidas</p>
        </GlassCard>
      </div>

      {/* Evolution Line Chart */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-1 h-4 bg-primary rounded-full" />
            <h3 className="text-xs font-premium-mono font-bold text-text-secondary uppercase tracking-[0.2em]">Evolução do Aprendizado</h3>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => setTimeRange('7d')}
              className={cn("px-3 py-1 text-[8px] font-bold uppercase rounded-lg transition-all", timeRange === '7d' ? "bg-primary text-black" : "text-text-secondary")}
            >
              7D
            </button>
            <button 
              onClick={() => setTimeRange('30d')}
              className={cn("px-3 py-1 text-[8px] font-bold uppercase rounded-lg transition-all", timeRange === '30d' ? "bg-primary text-black" : "text-text-secondary")}
            >
              30D
            </button>
            <button 
              onClick={() => setTimeRange('90d')}
              className={cn("px-3 py-1 text-[8px] font-bold uppercase rounded-lg transition-all", timeRange === '90d' ? "bg-primary text-black" : "text-text-secondary")}
            >
              90D
            </button>
          </div>
        </div>
        <GlassCard className="p-6" glow>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={evolutionData}>
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={themeColor} stopOpacity={0.3}/>
                    <stop offset="100%" stopColor={themeColor} stopOpacity={0.05}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  stroke="#ffffff20" 
                  fontSize={8} 
                  tickLine={false}
                  axisLine={false}
                  dy={10}
                />
                <YAxis 
                  yAxisId="left"
                  stroke="#ffffff20" 
                  fontSize={8} 
                  tickLine={false}
                  axisLine={false}
                  dx={-10}
                />
                <YAxis 
                  yAxisId="right"
                  orientation="right"
                  stroke="#ffffff20" 
                  fontSize={8} 
                  tickLine={false}
                  axisLine={false}
                  dx={10}
                  domain={[0, 100]}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#000', border: '1px solid #333', borderRadius: '16px', fontSize: '10px' }}
                  itemStyle={{ color: themeColor }}
                />
                <Bar yAxisId="left" dataKey="q" fill="url(#barGradient)" radius={[4, 4, 0, 0]} />
                <Line 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="accuracy" 
                  stroke="#00E88F" 
                  strokeWidth={2} 
                  dot={{ r: 2, fill: '#00E88F' }}
                  name="Precisão %"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary/30" />
              <span className="text-[8px] font-bold text-text-secondary uppercase">Questões</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#00E88F]" />
              <span className="text-[8px] font-bold text-text-secondary uppercase">Precisão %</span>
            </div>
          </div>
        </GlassCard>
      </section>

      {/* Radar Chart */}
      {subjectData.length > 2 && (
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-1 h-4 bg-primary rounded-full" />
            <h3 className="text-xs font-premium-mono font-bold text-text-secondary uppercase tracking-[0.2em]">Domínio por Matéria</h3>
          </div>
          <GlassCard className="p-6" glow>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={subjectData}>
                  <PolarGrid stroke="#ffffff20" />
                  <PolarAngleAxis dataKey="name" tick={{ fill: '#ffffff80', fontSize: 10 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                  <Radar
                    name="Precisão %"
                    dataKey="percent"
                    stroke={themeColor}
                    fill={themeColor}
                    fillOpacity={0.4}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#000', border: '1px solid #333', borderRadius: '16px', fontSize: '10px' }}
                    itemStyle={{ color: themeColor }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>
        </section>
      )}

      {/* Heatmap */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-1 h-4 bg-primary rounded-full" />
          <h3 className="text-xs font-premium-mono font-bold text-text-secondary uppercase tracking-[0.2em]">Frequência de Estudo (90 dias)</h3>
        </div>
        <GlassCard className="p-4" glow>
          <Heatmap data={heatmapData} />
        </GlassCard>
      </section>

      <div className="grid grid-cols-2 gap-4">
        {bestSubject && (
          <GlassCard className="p-4 border-primary/30 bg-primary/5 relative overflow-hidden" glow>
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 blur-[30px] -mr-12 -mt-12 rounded-full" />
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-2 text-primary">
                <Trophy size={16} />
                <h3 className="font-bold uppercase tracking-widest text-[10px]">Melhor Matéria</h3>
              </div>
              <p className="text-lg font-premium-title truncate">{bestSubject.name}</p>
              <p className="text-[10px] text-text-secondary font-premium-mono mt-1"><span className="text-primary font-bold">{bestSubject.percent}%</span> de acerto</p>
            </div>
          </GlassCard>
        )}

        {worstSubject && (
          <GlassCard className="p-4 border-red-500/30 bg-red-500/5 relative overflow-hidden" glow>
            <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/10 blur-[30px] -mr-12 -mt-12 rounded-full" />
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-2 text-red-500">
                <AlertCircle size={16} />
                <h3 className="font-bold uppercase tracking-widest text-[10px]">Pior Matéria</h3>
              </div>
              <p className="text-lg font-premium-title truncate">{worstSubject.name}</p>
              <p className="text-[10px] text-text-secondary font-premium-mono mt-1"><span className="text-red-500 font-bold">{worstSubject.percent}%</span> de acerto</p>
            </div>
          </GlassCard>
        )}
      </div>

      {worstSubject && (
        <GlassCard className="p-5 border-yellow-500/30 bg-yellow-500/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/10 blur-[40px] -mr-16 -mt-16 rounded-full" />
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-3 text-yellow-500">
              <Sparkles size={20} />
              <h3 className="font-bold uppercase tracking-widest text-xs">Recomendação da IA</h3>
            </div>
            <p className="text-sm text-text-secondary leading-relaxed">
              Notei que você está com dificuldade em <strong className="text-white">{worstSubject.name}</strong> ({worstSubject.percent}% de acerto). 
              Recomendo focar na revisão dos tópicos que você mais errou recentemente. Quer que eu monte um plano de estudos focado nisso?
            </p>
          </div>
        </GlassCard>
      )}

      {/* Accuracy Donut */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-1 h-4 bg-primary rounded-full" />
          <h3 className="text-xs font-premium-mono font-bold text-text-secondary uppercase tracking-[0.2em]">Precisão de Respostas</h3>
        </div>
        <GlassCard className="p-6 relative overflow-hidden" glow>
          <div className="h-64 flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={90}
                  paddingAngle={8}
                  dataKey="value"
                  stroke="none"
                  animationBegin={0}
                  animationDuration={1500}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} className="drop-shadow-[0_0_10px_rgba(0,255,148,0.3)]" />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#000', border: '1px solid #333', borderRadius: '16px', fontSize: '12px' }}
                  itemStyle={{ color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <motion.span 
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-4xl font-premium-title text-primary"
              >
                {accuracy}%
              </motion.span>
              <span className="text-[8px] font-premium-mono text-text-secondary uppercase tracking-widest">Acertos</span>
            </div>
          </div>
          <div className="flex justify-center gap-8 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary" />
              <span className="text-[10px] font-bold text-text-secondary uppercase">Acertos: {correct}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-red-500" />
              <span className="text-[10px] font-bold text-text-secondary uppercase">Erros: {incorrect}</span>
            </div>
          </div>
        </GlassCard>
      </section>

      {/* Evolution Line Chart */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-1 h-4 bg-primary rounded-full" />
          <h3 className="text-xs font-premium-mono font-bold text-text-secondary uppercase tracking-[0.2em]">Evolução Semanal</h3>
        </div>
        <GlassCard className="p-6" glow>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={last7Days}>
                <defs>
                  <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={themeColor} stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={themeColor} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  stroke="#ffffff20" 
                  fontSize={10} 
                  tickLine={false}
                  axisLine={false}
                  dy={10}
                />
                <YAxis 
                  stroke="#ffffff20" 
                  fontSize={10} 
                  tickLine={false}
                  axisLine={false}
                  dx={-10}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#000', border: '1px solid #333', borderRadius: '16px' }}
                  itemStyle={{ color: themeColor }}
                />
                <Line 
                  type="monotone" 
                  dataKey="q" 
                  stroke={themeColor} 
                  strokeWidth={4} 
                  dot={{ r: 4, fill: themeColor, strokeWidth: 2, stroke: '#000' }}
                  activeDot={{ r: 6, fill: themeColor, strokeWidth: 0 }}
                  animationDuration={2000}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </section>

      {/* Subject Performance */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-1 h-4 bg-primary rounded-full" />
          <h3 className="text-xs font-premium-mono font-bold text-text-secondary uppercase tracking-[0.2em]">Desempenho por Matéria</h3>
        </div>
        <GlassCard className="p-6" glow>
          <div className="space-y-6">
            {subjectData.map((data, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between items-end">
                  <span className="text-sm font-bold">{data.name}</span>
                  <div className="text-right">
                    <span className="text-primary font-premium-mono font-bold text-xs">{data.percent}%</span>
                    <p className="text-[8px] text-text-secondary uppercase font-bold tracking-tighter">{data.acertos} / {data.total} Questões</p>
                  </div>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden border border-white/10 relative">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${data.percent}%` }}
                    transition={{ duration: 1, delay: i * 0.1 }}
                    className="h-full bg-gradient-to-r from-primary/50 to-primary shadow-[0_0_10px_rgba(0,255,148,0.3)] rounded-full"
                  />
                </div>
              </div>
            ))}
            {subjectData.length === 0 && (
              <p className="text-center text-text-secondary text-sm py-8">Resolva questões para ver estatísticas.</p>
            )}
          </div>
        </GlassCard>
      </section>

      {/* Topic Performance */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-1 h-4 bg-primary rounded-full" />
          <h3 className="text-xs font-premium-mono font-bold text-text-secondary uppercase tracking-[0.2em]">Top 5 Assuntos</h3>
        </div>
        <GlassCard className="p-6" glow>
          <div className="space-y-6">
            {topicData.map((data, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between items-end">
                  <span className="text-sm font-bold">{data.name}</span>
                  <div className="text-right">
                    <span className="text-primary font-premium-mono font-bold text-xs">{data.percent}%</span>
                    <p className="text-[8px] text-text-secondary uppercase font-bold tracking-tighter">{data.acertos} / {data.total} Questões</p>
                  </div>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden border border-white/10 relative">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${data.percent}%` }}
                    transition={{ duration: 1, delay: i * 0.1 }}
                    className="h-full bg-gradient-to-r from-blue-500/50 to-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.3)] rounded-full"
                  />
                </div>
              </div>
            ))}
            {topicData.length === 0 && (
              <p className="text-center text-text-secondary text-sm py-8">Resolva questões para ver estatísticas.</p>
            )}
          </div>
        </GlassCard>
      </section>

      {/* Difficulty & Heatmap Grid */}
      <div className="grid grid-cols-1 gap-6">
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-1 h-4 bg-primary rounded-full" />
            <h3 className="text-xs font-premium-mono font-bold text-text-secondary uppercase tracking-[0.2em]">Distribuição de Dificuldade</h3>
          </div>
          <GlassCard className="p-6 h-64" glow>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={difficultyData}>
                <XAxis dataKey="name" stroke="#ffffff20" fontSize={10} axisLine={false} tickLine={false} />
                <Tooltip 
                  cursor={{ fill: 'transparent' }}
                  contentStyle={{ backgroundColor: '#000', border: '1px solid #333', borderRadius: '16px' }}
                />
                <Bar 
                  dataKey="value" 
                  radius={[10, 10, 0, 0]} 
                  animationDuration={1500}
                >
                  {difficultyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </GlassCard>
        </section>

        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-1 h-4 bg-primary rounded-full" />
            <h3 className="text-xs font-premium-mono font-bold text-text-secondary uppercase tracking-[0.2em]">Heatmap de Estudos</h3>
          </div>
          <GlassCard className="p-6" glow>
            <Heatmap data={heatmapData} />
            <div className="flex justify-between items-center mt-4 text-[8px] font-premium-mono text-text-secondary uppercase tracking-widest">
              <span>Menos Ativo</span>
              <div className="flex gap-1">
                <div className="w-2 h-2 rounded-sm bg-white/5" />
                <div className="w-2 h-2 rounded-sm bg-primary/20" />
                <div className="w-2 h-2 rounded-sm bg-primary/40" />
                <div className="w-2 h-2 rounded-sm bg-primary/70" />
                <div className="w-2 h-2 rounded-sm bg-primary" />
              </div>
              <span>Mais Ativo</span>
            </div>
          </GlassCard>
        </section>
      </div>

      {/* Insights */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-1 h-4 bg-primary rounded-full" />
          <h3 className="text-xs font-premium-mono font-bold text-text-secondary uppercase tracking-[0.2em]">Insights de Performance</h3>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <GlassCard className="p-4 border-primary/20 bg-primary/5" glow>
            <p className="text-[8px] font-premium-mono text-primary uppercase mb-1">Melhor Matéria</p>
            <p className="text-lg font-bold">{bestSubject?.name || '---'}</p>
            <p className="text-[10px] text-primary/70 font-bold">{bestSubject?.percent || 0}% de acerto</p>
          </GlassCard>
          <GlassCard className="p-4 border-red-500/20 bg-red-500/5" glow>
            <p className="text-[8px] font-premium-mono text-red-500 uppercase mb-1">Precisa de Foco</p>
            <p className="text-lg font-bold">{worstSubject?.name || '---'}</p>
            <p className="text-[10px] text-red-500/70 font-bold">{worstSubject?.percent || 0}% de acerto</p>
          </GlassCard>
        </div>
        
        {worstSubject && (
          <GlassCard className="p-5 border-white/10 mt-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-primary/10 rounded-xl text-primary">
                <MessageSquare size={16} />
              </div>
              <div>
                <h4 className="text-sm font-bold mb-1">Recomendação da IA</h4>
                <p className="text-xs text-text-secondary leading-relaxed">
                  Notei que seu desempenho em <span className="text-white font-bold">{worstSubject.name}</span> está abaixo da média ({worstSubject.percent}%). 
                  Recomendo focar em revisar os conceitos básicos e resolver questões de nível fácil antes de avançar.
                  Que tal criar um plano de estudos focado nisso?
                </p>
              </div>
            </div>
          </GlassCard>
        )}
      </section>
    </div>
  );
};

export default Reports;
