import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { 
  Share2, 
  Check, 
  Edit3, 
  Flame, 
  Clock, 
  BookOpen, 
  Target, 
  BarChart3, 
  ChevronRight, 
  Sparkles, 
  Bookmark 
} from 'lucide-react';
import html2canvas from 'html2canvas';
import { useStore } from '../../store';
import { 
  AnimatedButton, 
  GlassCard, 
  Badge, 
  Header 
} from '../../components/UI';
import { safeStringify } from '../../lib/firebase';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  Tooltip
} from 'recharts';
import { clsx } from 'clsx';
import { useAppNavigation } from '../../app/router/useAppNavigation';

const ProfileView = () => {
  const { goBack, goTo } = useAppNavigation();
  const { 
    name, 
    bio, 
    profilePic, 
    coverPic, 
    level, 
    streak, 
    setName, 
    setBio, 
    setProfilePic, 
    setCoverPic, 
    history, 
    sessions, 
    featureUsage, 
    plan, 
    setThemeColor, 
    themeColor 
  } = useStore();

  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(name || '');
  const [editBio, setEditBio] = useState(bio || '');

  const stats = useMemo(() => {
    const totalHours = Math.round(sessions.reduce((acc, s) => acc + (s.duration || 0), 0) / 60);
    const questionsSolved = history.length;
    const accuracyRate = questionsSolved > 0 
      ? Math.round(history.filter(h => h.isCorrect).length / questionsSolved * 100) 
      : 0;

    return { totalHours, questionsSolved, accuracyRate };
  }, [sessions, history]);

  const activityData = useMemo(() => {
    const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    const today = new Date();
    return Array.from({ length: 7 }).map((_, i) => {
      const d = new Date();
      d.setDate(today.getDate() - (6 - i));
      const dateStr = d.toISOString().split('T')[0];
      const daySessions = sessions.filter(s => s.date === dateStr);
      const minutes = daySessions.reduce((acc, s) => acc + (s.duration || 0), 0);
      
      return {
        name: days[d.getDay()],
        minutos: minutes,
      };
    });
  }, [sessions]);

  const favoriteFeatures = useMemo(() => {
    const featureLabels: Record<string, string> = {
      pomodoro: '🍅 Pomodoro',
      flashcards: '📇 Flashcards',
      aiTutor: '🤖 AI Tutor',
      redacao: '✍️ Redação',
      questions: '❓ Questões'
    };

    return Object.entries(featureUsage || {})
      .map(([key, count]) => ({ 
        label: featureLabels[key] || key, 
        count 
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 3);
  }, [featureUsage]);

  const handleSave = () => {
    setName(editName);
    setBio(editBio);
    setIsEditing(false);
  };

  const shareProfile = async () => {
    const card = document.getElementById('profile-share-card');
    if (!card) return;

    try {
      const canvas = await html2canvas(card, {
        backgroundColor: '#0a0a0a',
        scale: 2,
      });
      const link = document.createElement('a');
      link.download = 'meu-progresso-studyflow.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error('Error sharing profile:', err);
    }
  };

  return (
    <div className="pb-32">
      {/* Hidden share card for html2canvas */}
      <div className="fixed -left-[9999px] top-0">
        <div id="profile-share-card" className="w-[400px] p-8 bg-[#0a0a0a] border-2 border-[#00ff94]/20 rounded-[40px] space-y-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#00ff94]/10 blur-3xl rounded-full" />
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-2xl border-2 border-[#00ff94]/30 overflow-hidden">
              <img src={profilePic || `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`} alt="" className="w-full h-full object-cover" />
            </div>
            <div>
              <h2 className="text-2xl font-premium-title italic text-white uppercase">{name}</h2>
              <p className="text-[#00ff94] font-premium-mono font-bold text-xs">NÍVEL {level} • STUDYFLOW</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
              <p className="text-[10px] font-premium-mono text-text-secondary uppercase">Streak</p>
              <p className="text-xl font-bold text-orange-500">{streak} Dias 🔥</p>
            </div>
            <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
              <p className="text-[10px] font-premium-mono text-text-secondary uppercase">Precisão</p>
              <p className="text-xl font-bold text-[#00ff94]">{stats.accuracyRate}%</p>
            </div>
          </div>
          <div className="text-center pt-2">
            <p className="text-[8px] font-premium-mono text-text-secondary uppercase tracking-[0.3em]">Gerado por StudyFlow AI</p>
          </div>
        </div>
      </div>

      {/* Cover Photo */}
      <div className="relative h-48 bg-white/5 border-b border-white/10 mb-12 z-10">
        <Header 
          title=""
          onBack={goBack}
          className="absolute top-6 left-6 z-20"
        />
        {coverPic ? (
          <img src={coverPic} alt="Cover" className="absolute inset-0 w-full h-full object-cover" />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent" />
        )}

        {/* Profile Picture */}
        <div className="absolute -bottom-10 left-6 z-20">
          <div className="relative">
            <div className="w-24 h-24 rounded-full border-4 border-background bg-card overflow-hidden">
              <img 
                src={profilePic || `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`} 
                alt="Profile" 
                className="w-full h-full object-cover" 
              />
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 relative">
        {/* Action Buttons */}
        <div className="flex justify-end pt-4 gap-2">
          <button 
            onClick={shareProfile}
            className="p-2 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors"
            title="Compartilhar Progresso"
          >
            <Share2 size={18} className="text-primary" />
          </button>
          <button 
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            className="px-4 py-2 bg-white/5 rounded-xl border border-white/10 text-xs font-bold uppercase tracking-widest hover:bg-white/10 transition-colors flex items-center gap-2"
          >
            {isEditing ? <><Check size={14} /> Salvar</> : <><Edit3 size={14} /> Editar Perfil</>}
          </button>
        </div>

        {/* User Info */}
        <div className="mt-4 space-y-6">
          {isEditing ? (
            <div className="space-y-3">
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white font-bold text-xl focus:outline-none focus:border-primary/50"
                placeholder="Seu Nome"
              />
              <textarea
                value={editBio}
                onChange={(e) => setEditBio(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-primary/50 resize-none h-24"
                placeholder="Sua Bio"
              />
            </div>
          ) : (
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold">{name}</h1>
                <Badge variant={plan === 'premium' ? 'primary' : 'warning'} className="text-[8px] tracking-widest uppercase">
                  {plan === 'premium' ? 'Premium ⭐' : 'Free'}
                </Badge>
              </div>
              <p className="text-text-secondary text-sm mt-1">{bio}</p>
            </div>
          )}

          {/* Plan Card */}
          {plan === 'free' && (
            <GlassCard className="p-4 border-primary/30 bg-primary/5 flex items-center justify-between" glow>
              <div>
                <p className="text-xs font-bold">Plano Free</p>
                <p className="text-[10px] text-text-secondary">Acesse todos os recursos agora.</p>
              </div>
              <AnimatedButton 
                onClick={() => goTo('/pricing')} 
                className="px-4 py-2 text-[10px] font-bold uppercase bg-primary text-black border-primary"
                glow
              >
                ⭐ Fazer Upgrade
              </AnimatedButton>
            </GlassCard>
          )}

          {/* Stats Grid (2x2 requested) */}
          <div className="grid grid-cols-2 gap-3">
            <GlassCard className="p-4 space-y-1" glow>
              <div className="flex items-center gap-2 text-orange-500">
                <Flame size={14} fill="currentColor" />
                <span className="text-[10px] font-premium-mono font-bold uppercase tracking-widest">Streak</span>
              </div>
              <p className="text-2xl font-premium-title italic">{streak} Dias</p>
            </GlassCard>
            <GlassCard className="p-4 space-y-1" glow>
              <div className="flex items-center gap-2 text-primary">
                <Clock size={14} />
                <span className="text-[10px] font-premium-mono font-bold uppercase tracking-widest">Horas</span>
              </div>
              <p className="text-2xl font-premium-title italic">{stats.totalHours}h</p>
            </GlassCard>
            <GlassCard className="p-4 space-y-1" glow>
              <div className="flex items-center gap-2 text-blue-400">
                <BookOpen size={14} />
                <span className="text-[10px] font-premium-mono font-bold uppercase tracking-widest">Questões</span>
              </div>
              <p className="text-2xl font-premium-title italic">{stats.questionsSolved}</p>
            </GlassCard>
            <GlassCard className="p-4 space-y-1" glow>
              <div className="flex items-center gap-2 text-purple-400">
                <Target size={14} />
                <span className="text-[10px] font-premium-mono font-bold uppercase tracking-widest">Precisão</span>
              </div>
              <p className="text-2xl font-premium-title italic">{stats.accuracyRate}%</p>
            </GlassCard>
          </div>

          {/* Activity Graph */}
          <div className="pt-6 space-y-3">
            <h3 className="text-xs font-premium-mono font-bold text-text-secondary uppercase tracking-[0.3em]">Atividade (7 Dias)</h3>
            <GlassCard className="p-4 h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={activityData}>
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10, fontWeight: 'bold' }} 
                  />
                  <Tooltip 
                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                    contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                    labelStyle={{ color: 'rgba(255,255,255,0.5)', fontSize: '10px', textTransform: 'uppercase', marginBottom: '4px' }}
                    itemStyle={{ color: themeColor, fontWeight: 'bold', fontSize: '12px' }}
                  />
                  <Bar 
                    dataKey="minutos" 
                    fill={themeColor} 
                    radius={[4, 4, 0, 0]} 
                    barSize={20}
                  />
                </BarChart>
              </ResponsiveContainer>
            </GlassCard>
          </div>

          {/* Favorite Features */}
          {favoriteFeatures.length > 0 && (
            <div className="pt-6 space-y-3">
              <h3 className="text-xs font-premium-mono font-bold text-text-secondary uppercase tracking-[0.3em]">Suas features favoritas</h3>
              <div className="flex flex-wrap gap-2">
                {favoriteFeatures.map((feat, i) => (
                  <div key={i} className="px-3 py-2 bg-white/5 border border-white/10 rounded-xl flex items-center gap-2">
                    <span className="text-sm">{feat.label}</span>
                    <span className="px-1.5 py-0.5 bg-primary/20 text-primary rounded-md text-[10px] font-bold">
                      {feat.count}x
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Stats Button */}
          <div className="pt-2">
            <motion.button
              onClick={() => goTo('/estatisticas')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center justify-between p-4 rounded-2xl border border-primary/20 bg-primary/5 hover:bg-primary/10 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/20 rounded-xl text-primary">
                  <BarChart3 size={20} />
                </div>
                <span className="font-bold text-white text-sm">Ver estatísticas completas</span>
              </div>
              <ChevronRight size={16} className="text-white/40" />
            </motion.button>
          </div>

          {/* Settings (from existing code) */}
          <div className="pt-6 space-y-3">
            <h3 className="text-xs font-premium-mono font-bold text-text-secondary uppercase tracking-[0.3em]">Configurações</h3>
            <GlassCard className="p-4 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/5 rounded-xl text-white">
                    <Sparkles size={20} className="text-primary" />
                  </div>
                  <span className="font-bold">Tema de Cores</span>
                </div>
              </div>
              <div className="flex gap-3">
                {[
                  { id: '#10B981', name: 'Emerald' },
                  { id: '#3B82F6', name: 'Blue' },
                  { id: '#8B5CF6', name: 'Purple' },
                  { id: '#F43F5E', name: 'Rose' },
                  { id: '#F59E0B', name: 'Amber' },
                ].map(theme => (
                  <button
                    key={theme.id}
                    onClick={() => setThemeColor(theme.id)}
                    className={clsx(
                      "w-8 h-8 rounded-full border-2 transition-all",
                      themeColor === theme.id ? "border-white scale-110" : "border-transparent hover:scale-105"
                    )}
                    style={{ backgroundColor: theme.id }}
                    title={theme.name}
                  />
                ))}
              </div>
            </GlassCard>

            <GlassCard className="p-4 flex items-center justify-between cursor-pointer hover:border-primary/50 transition-colors" onClick={() => {
              const state = useStore.getState();
              const dataToExport = safeStringify(state, 2);
              const blob = new Blob([dataToExport], { type: 'application/json' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `studyflow-backup-${new Date().toISOString().split('T')[0]}.json`;
              a.click();
              URL.revokeObjectURL(url);
            }}>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/5 rounded-xl text-white">
                  <Bookmark size={20} />
                </div>
                <span className="font-bold">Exportar Dados (Backup)</span>
              </div>
              <ChevronRight size={16} className="text-white/20" />
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileView;
