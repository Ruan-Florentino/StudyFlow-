import React, { useState, useMemo } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { staggerContainer, staggerItem } from '../../lib/animations/variants';
import { easings, springs } from '../../lib/animations/easings';
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
  Bookmark,
  Camera,
  Upload,
  Smartphone,
  Mail,
  Lock,
  Info,
  Shield,
  Crown,
  Scale,
  ScrollText,
  ExternalLink,
  Volume2,
  Vibrate
} from 'lucide-react';
import { useStore } from '../../store';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import { toast } from '../../store/useToastStore';
import {
  AnimatedButton,
  GlassCard,
  Badge,
  Header
} from '../../components/UI';
import { clsx } from 'clsx';
import { useAppNavigation } from '../../app/router/useAppNavigation';
import { useUserAccess } from '../../hooks/useUserAccess';
import { calendarDayLocal, sessionMatchesLocalChartDay } from '../../lib/persistence';
import { getFeedbackSettings, setFeedbackSettings, playInteractionFeedback, type FeedbackSettings } from '../../lib/feedback';

const PROFILE_IMAGE_MIME_ALLOW = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/heic',
  'image/heif',
  'image/avif',
]);

const EXT_TO_PROFILE_MIME: Readonly<Record<string, true>> = {
  jpg: true,
  jpeg: true,
  png: true,
  webp: true,
  gif: true,
  heic: true,
  heif: true,
  avif: true,
};

const MIME_TO_EXT: Readonly<Record<string, string>> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
  'image/heic': 'heic',
  'image/heif': 'heif',
  'image/avif': 'avif',
};

function isProfileImageAllowed(file: File): boolean {
  if (file.type && PROFILE_IMAGE_MIME_ALLOW.has(file.type)) return true;
  const seg = file.name.split('.');
  const ext = seg.length > 1 ? seg.pop()?.toLowerCase() ?? '' : '';
  return Boolean(ext && EXT_TO_PROFILE_MIME[ext]);
}

function extensionForProfileUpload(file: File): string {
  const seg = file.name.split('.');
  const fromName = seg.length > 1 ? seg.pop()?.toLowerCase() ?? '' : '';
  if (fromName && EXT_TO_PROFILE_MIME[fromName]) return fromName;
  if (file.type && MIME_TO_EXT[file.type]) return MIME_TO_EXT[file.type];
  return 'jpg';
}

const ProfileView = () => {
  const { goBack, goTo } = useAppNavigation();
  const { user } = useAuth();
  const { isFree, isSupremo, plan: accessPlan } = useUserAccess();
  const reduceMotion = useReducedMotion() ?? false;
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
    setThemeColor,
    themeColor
  } = useStore();
  const { setShowPrompt, isInstalled } = usePWAInstall();

  const [isEditing, setIsEditing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [editName, setEditName] = useState(name || '');
  const [editBio, setEditBio] = useState(bio || '');
  const [feedbackSettings, setFeedbackSettingsState] = useState(() => getFeedbackSettings());

  const updateFeedbackSettings = (next: Partial<FeedbackSettings>) => {
    const updated = setFeedbackSettings(next);
    setFeedbackSettingsState(updated);
    playInteractionFeedback('soft');
  };

  const stats = useMemo(() => {
    const totalHours = Math.round((sessions || []).reduce((acc, s) => acc + (s.duration || 0), 0) / 60);
    const questionsSolved = (history || []).length;
    const accuracyRate = questionsSolved > 0
      ? Math.round((history || []).filter(h => h.isCorrect).length / questionsSolved * 100)
      : 0;

    return { totalHours, questionsSolved, accuracyRate };
  }, [sessions, history]);

  const activityData = useMemo(() => {
    const dayLabels = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'];
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(startOfToday);
      d.setDate(startOfToday.getDate() - (6 - i));
      const dateStr = calendarDayLocal(d);
      const daySessions = (sessions || []).filter(
        (s) => s && sessionMatchesLocalChartDay(s.date, dateStr)
      );
      const minutes = daySessions.reduce((acc, s) => acc + (s.duration || 0), 0);
      return {
        name: dayLabels[d.getDay()],
        minutos: minutes,
      };
    });
  }, [sessions]);

  const maxActivityMinutes = useMemo(
    () => Math.max(1, ...activityData.map((item) => item.minutos)),
    [activityData]
  );

  const favoriteFeatures = useMemo(() => {
    const featureLabels: Record<string, string> = {
      pomodoro: 'Pomodoro',
      flashcards: 'Flashcards',
      aiTutor: 'Athena',
      redacao: 'Redacao',
      questions: 'Questoes'
    };

    return Object.entries(featureUsage || {})
      .map(([key, count]) => ({
        label: featureLabels[key] || key,
        count
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 3);
  }, [featureUsage]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'profile' | 'cover') => {
    const file = e.target.files?.[0];
    if (!file || !user?.id) return;

    const maxBytes = 10 * 1024 * 1024;
    if (file.size > maxBytes) {
      toast.error('Erro', 'Imagem muito grande (max. 10 MB).');
      e.target.value = '';
      return;
    }
    if (!isProfileImageAllowed(file)) {
      toast.error(
        'Erro',
        'Formato nao suportado. Use JPG, PNG, WebP, GIF, HEIC ou AVIF.'
      );
      e.target.value = '';
      return;
    }

    setUploading(true);
    try {
      const fileExt = extensionForProfileUpload(file);
      const fileName = `${type}_${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('profile-assets')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('profile-assets')
        .getPublicUrl(filePath);

      const url = data.publicUrl;

      if (type === 'profile') {
        const { error: dbError } = await supabase.from('users').update({ profile_pic: url }).eq('id', user.id);
        if (dbError) throw dbError;
        setProfilePic(url);
      } else {
        const { error: dbError } = await supabase.from('users').update({ cover_pic: url }).eq('id', user.id);
        if (dbError) throw dbError;
        setCoverPic(url);
      }
      toast.success("Sucesso", type === 'profile' ? "Foto de perfil atualizada!" : "Foto de capa atualizada!");

    } catch (err) {
      toast.error('Erro', 'Nao foi possivel fazer o upload da imagem. Tente outra foto ou formato.');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleSave = async () => {
    if (!editName.trim()) {
      toast.error("Erro", "O nome nao pode ser vazio.");
      return;
    }
    setName(editName);
    setBio(editBio);
    setIsEditing(false);
    if (user?.id) {
      try {
        const { error } = await supabase.from('users').update({ name: editName, bio: editBio }).eq('id', user.id);
        if (error) throw error;
        toast.success("Sucesso", "Perfil atualizado!");
      } catch(err) {
        console.error('Failed to update profile to Supabase', err);
        toast.error("Erro", "Nao foi possivel atualizar o perfil.");
      }
    }
  };

  const shareProfile = async () => {
    const card = document.getElementById('profile-share-card');
    if (!card) return;

    try {
      const { default: html2canvas } = await import('html2canvas');
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
    <div className="mx-auto w-full max-w-6xl min-w-0 premium-page-stack pb-32">
      {/* Hidden share card for html2canvas */}
      <div className="fixed -left-[9999px] top-0" aria-hidden="true">
        <div id="profile-share-card" className="w-[400px] p-8 bg-[#0a0a0a] border-2 border-[#00ff94]/20 rounded-[40px] space-y-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#00ff94]/10 blur-3xl rounded-full" />
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-2xl border-2 border-[#00ff94]/30 overflow-hidden">
              <img src={profilePic || `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`} alt="" className="w-full h-full object-cover" />
            </div>
            <div>
              <h2 className="text-2xl font-premium-title italic text-white uppercase">{name}</h2>
              <p className="text-[#00ff94] font-premium-mono font-bold text-xs">NIVEL {level} - STUDYFLOW</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
              <p className="text-[10px] font-premium-mono text-text-secondary uppercase">Streak</p>
              <p className="text-xl font-bold text-orange-500">{streak} Dias 🔥</p>
            </div>
            <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
              <p className="text-[10px] font-premium-mono text-text-secondary uppercase">Precisao</p>
              <p
                className="text-xl font-bold text-[#00ff94]"
                title="Taxa de acerto nas questoes registradas no app neste dispositivo."
              >
                {stats.accuracyRate}%
              </p>
            </div>
          </div>
          <div className="text-center pt-2">
            <p className="text-[8px] font-premium-mono text-text-secondary uppercase tracking-[0.3em]">
              StudyFlow - resumo do seu progresso no app
            </p>
          </div>
        </div>
      </div>

      {/* Cover Photo — proporção estável no mobile (aspect ratio), capa largura total no md+ */}
      <div className="premium-page-hero relative z-10 mb-14 w-full overflow-visible border-white/10 bg-white/[0.045] aspect-[5/2] max-h-[13rem] sm:mb-12 sm:aspect-auto sm:h-48 sm:max-h-none">
        <Header
          title=""
          onBack={goBack}
          className="absolute left-4 top-4 z-20 sm:left-6 sm:top-6"
        />
        {coverPic ? (
          <img src={coverPic} alt="Cover" className="absolute inset-0 h-full w-full rounded-[inherit] object-cover" />
        ) : (
          <div className="absolute inset-0 rounded-[inherit] bg-gradient-to-br from-primary/20 to-transparent" />
        )}

        {isEditing && (
          <label className="absolute inset-0 z-10 flex cursor-pointer items-center justify-center bg-black/40 opacity-100 transition-opacity md:opacity-0 md:hover:opacity-100">
            <input type="file" className="hidden" accept="image/*,.heic,.heif,.avif" onChange={(e) => handleUpload(e, 'cover')} disabled={uploading} />
            <div className="flex flex-col items-center gap-2">
              <Upload size={24} className="text-white" />
              <span className="text-white text-[10px] font-bold uppercase">Mudar Capa</span>
            </div>
          </label>
        )}

        {/* Profile Picture — centralizado no mobile, alinhado à esquerda no sm+ */}
        <div className="absolute -bottom-9 left-1/2 z-20 -translate-x-1/2 sm:-bottom-10 sm:left-6 sm:translate-x-0">
          <div className="relative group">
            <div className="h-20 w-20 overflow-hidden rounded-full border-4 border-background bg-card shadow-[0_18px_40px_rgba(0,0,0,0.38)] ring-1 ring-white/15 sm:h-24 sm:w-24">
              <img
                src={profilePic || `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            {isEditing && (
              <label className="absolute inset-0 flex cursor-pointer items-center justify-center rounded-full bg-black/40 opacity-100 transition-opacity md:opacity-0 md:group-hover:opacity-100">
                <input type="file" className="hidden" accept="image/*,.heic,.heif,.avif" onChange={(e) => handleUpload(e, 'profile')} disabled={uploading} />
                <Camera size={20} className="text-white" />
              </label>
            )}
          </div>
        </div>
      </div>

      <div className="app-shell-premium relative premium-page-stack">
        {/* Action Buttons */}
        <div className="flex justify-end gap-2">
          <button
            onClick={shareProfile}
            className="flex size-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06] hover:bg-white/[0.1] transition-colors"
            title="Compartilhar Progresso"
          >
            <Share2 size={18} className="text-primary" />
          </button>
          <button
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            className="min-h-11 rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-2 text-xs font-bold uppercase tracking-widest hover:bg-white/[0.1] transition-colors flex items-center gap-2"
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
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl font-bold">{name}</h1>
                {isSupremo ? (
                  <Badge variant="orange" className="text-[8px] tracking-widest uppercase border-amber-500/40 text-amber-300">
                    <Crown size={10} className="inline mr-1" />
                    Supremo
                  </Badge>
                ) : (
                  <Badge variant={accessPlan === 'premium' ? 'primary' : 'warning'} className="text-[8px] tracking-widest uppercase">
                    {accessPlan === 'premium' ? 'Premium' : 'Free'}
                  </Badge>
                )}
              </div>
              <p className="text-text-secondary text-sm mt-1">{bio}</p>
            </div>
          )}

          {/* Plan Card */}
          {isFree && (
            <GlassCard className="premium-list-card p-4 border-primary/30 bg-primary/[0.045] flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between" glow>
              <div>
                <p className="text-xs font-bold">Plano Free</p>
                <p className="text-[10px] text-text-secondary">Acesse todos os recursos agora.</p>
              </div>
              <AnimatedButton
                onClick={() => goTo('/premium')}
                className="px-4 py-2 text-[10px] font-bold uppercase bg-primary text-black border-primary"
                glow
              >
                Fazer Upgrade
              </AnimatedButton>
            </GlassCard>
          )}

          {/* Stats Grid (2x2 requested) */}
          <p className="text-[10px] font-premium-mono text-text-secondary uppercase tracking-wider">
            Metricas com base em sessoes e questoes registradas neste aparelho.
          </p>
          <motion.div
            className="grid grid-cols-2 gap-3"
            variants={staggerContainer}
            initial="hidden"
            animate="show"
          >
            {[
              { icon: Flame, iconProps: { fill: 'currentColor' }, color: 'text-orange-500', label: 'Streak', value: `${streak} Dias` },
              { icon: Clock, color: 'text-primary', label: 'Horas', value: `${stats.totalHours}h` },
              { icon: BookOpen, color: 'text-blue-400', label: 'Questoes', value: String(stats.questionsSolved) },
              { icon: Target, color: 'text-purple-400', label: 'Precisao', value: `${stats.accuracyRate}%` },
            ].map(({ icon: Icon, iconProps, color, label, value }) => (
              <motion.div key={label} variants={staggerItem}>
                <GlassCard enterAnimation={false} className="premium-stat-tile p-4 space-y-1" glow>
                  <div className={`flex items-center gap-2 ${color}`}>
                    <Icon size={14} {...(iconProps ?? {})} />
                    <span className="text-[10px] font-premium-mono font-bold uppercase tracking-widest">{label}</span>
                  </div>
                  <p className="text-2xl font-premium-title italic">{value}</p>
                </GlassCard>
              </motion.div>
            ))}
          </motion.div>

          {/* Activity Graph */}
          <div className="pt-6 space-y-3">
            <h3
              className="text-xs font-premium-mono font-bold text-text-secondary uppercase tracking-[0.3em]"
              title="Minutos de estudo por dia conforme sessoes salvas localmente."
            >
              Atividade (7 dias)
            </h3>
            <GlassCard className="premium-list-card p-4 flex flex-col gap-2 min-h-[12.5rem]">
              <div className="grid h-40 min-h-[10rem] w-full shrink-0 grid-cols-7 items-end gap-2 px-1 pt-2">
                {activityData.map((item) => {
                  const height = Math.max(8, Math.round((item.minutos / maxActivityMinutes) * 116));
                  return (
                    <div key={item.name} className="flex h-full min-w-0 flex-col items-center justify-end gap-2">
                      <div className="flex h-[7.25rem] w-full items-end justify-center rounded-xl border border-white/[0.035] bg-white/[0.025] px-1">
                        <motion.div
                          initial={{ height: 4, opacity: 0.55 }}
                          whileInView={{ height, opacity: item.minutos > 0 ? 1 : 0.35 }}
                          viewport={{ once: true }}
                          transition={reduceMotion ? { duration: 0.15, ease: easings.smoothOut } : springs.soft}
                          className="w-full max-w-[1.2rem] rounded-t-lg shadow-[0_0_16px_rgba(var(--hub-primary-rgb),0.18)]"
                          style={{ backgroundColor: item.minutos > 0 ? themeColor : 'rgba(255,255,255,0.16)' }}
                          title={`${item.name}: ${item.minutos} min`}
                        />
                      </div>
                      <span className="text-[10px] font-bold uppercase text-white/45">{item.name}</span>
                    </div>
                  );
                })}
              </div>
              {activityData.every((x) => x.minutos === 0) && (
                <p className="text-[10px] text-text-secondary text-center font-medium">
                  Nenhum minuto registrado nos ultimos 7 dias. Use o modo Foco para gravar sessoes.
                </p>
              )}
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
              whileHover={
                reduceMotion
                  ? { scale: 1 }
                  : { scale: 1.02, boxShadow: '0 0 20px rgba(var(--hub-primary-rgb),0.18)' }
              }
              whileTap={{ scale: reduceMotion ? 1 : 0.97 }}
              transition={reduceMotion ? { duration: 0.15, ease: easings.smoothOut } : springs.snappy}
              className="premium-list-card w-full flex items-center justify-between p-4 rounded-2xl border border-primary/20 bg-primary/[0.045] hover:bg-primary/10 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/20 rounded-xl text-primary">
                  <BarChart3 size={20} />
                </div>
                <span className="font-bold text-white text-sm">Ver estatisticas completas</span>
              </div>
              <ChevronRight size={16} className="text-white/40" />
            </motion.button>
          </div>

          {/* Settings (from existing code) */}
          <div className="pt-6 space-y-3">
            <h3 className="text-xs font-premium-mono font-bold text-text-secondary uppercase tracking-[0.3em]">Configuracoes</h3>
            <GlassCard className="premium-list-card p-4 flex flex-col gap-4">
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

            <GlassCard className="premium-list-card p-4 flex flex-col gap-3">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-xl text-primary border border-primary/20">
                    <Volume2 size={20} />
                  </div>
                  <div>
                    <span className="block font-bold">Feedback sensorial</span>
                    <span className="block text-xs text-text-secondary">Sons discretos e vibracao nos toques importantes</span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  aria-pressed={feedbackSettings.sound}
                  onClick={() => updateFeedbackSettings({ sound: !feedbackSettings.sound })}
                  className={clsx(
                    "flex items-center justify-between rounded-2xl border p-3 text-left transition-all",
                    feedbackSettings.sound ? "border-primary/40 bg-primary/12 text-white shadow-[0_0_18px_rgba(var(--hub-primary-rgb),0.12)]" : "border-white/10 bg-white/[0.035] text-text-secondary hover:bg-white/[0.06]"
                  )}
                >
                  <span className="flex items-center gap-2 text-sm font-bold"><Volume2 size={16} /> Sons</span>
                  <span className={clsx("h-5 w-9 rounded-full border p-0.5 transition-colors", feedbackSettings.sound ? "border-primary/60 bg-primary/30" : "border-white/15 bg-white/5")}>
                    <span className={clsx("block h-3.5 w-3.5 rounded-full bg-white transition-transform", feedbackSettings.sound && "translate-x-4 bg-primary")} />
                  </span>
                </button>
                <button
                  type="button"
                  aria-pressed={feedbackSettings.haptics}
                  onClick={() => updateFeedbackSettings({ haptics: !feedbackSettings.haptics })}
                  className={clsx(
                    "flex items-center justify-between rounded-2xl border p-3 text-left transition-all",
                    feedbackSettings.haptics ? "border-primary/40 bg-primary/12 text-white shadow-[0_0_18px_rgba(var(--hub-primary-rgb),0.12)]" : "border-white/10 bg-white/[0.035] text-text-secondary hover:bg-white/[0.06]"
                  )}
                >
                  <span className="flex items-center gap-2 text-sm font-bold"><Vibrate size={16} /> Vibracao</span>
                  <span className={clsx("h-5 w-9 rounded-full border p-0.5 transition-colors", feedbackSettings.haptics ? "border-primary/60 bg-primary/30" : "border-white/15 bg-white/5")}>
                    <span className={clsx("block h-3.5 w-3.5 rounded-full bg-white transition-transform", feedbackSettings.haptics && "translate-x-4 bg-primary")} />
                  </span>
                </button>
              </div>
            </GlassCard>
            {!isInstalled && (
              <GlassCard
                className="premium-list-card p-4 flex items-center justify-between cursor-pointer hover:border-primary/50 transition-colors"
                onClick={() => setShowPrompt(true)}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/5 rounded-xl text-white">
                    <Smartphone size={20} className="text-primary" />
                  </div>
                  <span className="font-bold">Instalar como App</span>
                </div>
                <ChevronRight size={16} className="text-white/20" />
              </GlassCard>
            )}

            <GlassCard className="premium-list-card p-4 flex items-center justify-between cursor-pointer hover:border-primary/50 transition-colors" onClick={() => {
              const state = useStore.getState();
              const dataToExport = JSON.stringify(state, null, 2);
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
                <span className="font-bold">Exportar dados (backup)</span>
              </div>
              <ChevronRight size={16} className="text-white/20" />
            </GlassCard>

            <div className="pt-6 space-y-4">
              <h3 className="text-xs font-premium-mono font-bold text-text-secondary uppercase tracking-[0.3em]">
                Privacidade, legal e proteção de dados
              </h3>

              <motion.div
                initial={{ opacity: 0, y: reduceMotion ? 0 : 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={reduceMotion ? { duration: 0.15, ease: easings.smoothOut } : springs.soft}
              >
                <GlassCard
                  enterAnimation={false}
                  className="premium-list-card p-5 md:p-6 border-[rgba(var(--hub-primary-rgb),0.22)] bg-[rgba(var(--hub-primary-rgb),0.055)]"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex gap-3">
                      <div
                        className="shrink-0 p-2.5 rounded-2xl border border-[rgba(var(--hub-primary-rgb),0.25)] bg-[rgba(var(--hub-primary-rgb),0.12)]"
                        aria-hidden
                      >
                        <Shield size={22} className="text-primary" />
                      </div>
                      <div className="space-y-1.5">
                        <p className="text-sm font-bold text-white tracking-tight">
                          Conformidade LGPD e transparência ampliada
                        </p>
                        <p className="text-xs text-white/70 leading-relaxed max-w-prose">
                          Política de Privacidade com mais de 200 pontos numerados (rastreáveis em solicitações ao
                          encarregado), cobrindo bases legais, IA, retenção, segurança, transferência internacional e
                          direitos do titular. Termos de Uso complementam limites do serviço educacional.
                        </p>
                        <p className="text-[11px] text-white/45 font-premium-mono uppercase tracking-wider">
                          Encarregado: altavistaholdingltda@gmail.com
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => goTo('/perfil/politica-de-privacidade')}
                      className="shrink-0 inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold uppercase tracking-wide text-[var(--bg-primary)] bg-[var(--color-primary)] hover:opacity-95 transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-secondary)]"
                    >
                      <ScrollText size={16} aria-hidden />
                      Ler política completa
                    </button>
                  </div>
                </GlassCard>
              </motion.div>

              {(
                [
                  {
                    label: 'Política de Privacidade (200+ pontos)',
                    hint: 'Documento ampliado para auditoria e exercício de direitos',
                    icon: Lock,
                    path: '/perfil/politica-de-privacidade',
                  },
                  {
                    label: 'Termos de Uso',
                    hint: 'Contrato de uso do StudyFlow e limites do serviço',
                    icon: Scale,
                    path: '/perfil/termos-de-uso',
                  },
                  {
                    label: 'Dados pessoais no perfil',
                    hint: 'Correção de nome e bio; demais pedidos via encarregado',
                    icon: Shield,
                    path: '/perfil/dados-pessoais',
                  },
                  {
                    label: 'Encarregado LGPD (e-mail)',
                    hint: 'Art. 18, incidentes, portabilidade e dúvidas de tratamento',
                    icon: Mail,
                    mailto:
                      'mailto:altavistaholdingltda@gmail.com?subject=StudyFlow%20%E2%80%94%20LGPD%20%2F%20Privacidade',
                  },
                  {
                    label: 'Suporte oficial',
                    hint: 'Fila de atendimento e dúvidas sobre o produto',
                    icon: ExternalLink,
                    path: '/perfil/suporte',
                  },
                  {
                    label: 'Sobre o StudyFlow',
                    hint: 'Informações do app e canais institucionais',
                    icon: Info,
                    path: '/perfil/sobre',
                  },
                ] as const
              ).map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: reduceMotion ? 0 : -12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={
                    reduceMotion
                      ? { duration: 0.15, delay: i * 0.02, ease: easings.smoothOut }
                      : { ...springs.soft, delay: i * 0.04 }
                  }
                >
                  <GlassCard
                    enterAnimation={false}
                    className="premium-list-card p-4 flex items-center justify-between cursor-pointer hover:border-primary/50 transition-colors text-left w-full"
                    onClick={() => {
                      if ('mailto' in item) {
                        window.location.href = item.mailto;
                        return;
                      }
                      goTo(item.path);
                    }}
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="p-2 bg-white/5 rounded-xl text-white shrink-0">
                        <item.icon size={20} className="text-primary" />
                      </div>
                      <div className="min-w-0">
                        <span className="font-bold block truncate">{item.label}</span>
                        {'hint' in item ? (
                          <span className="text-[11px] text-white/50 leading-snug block mt-0.5">{item.hint}</span>
                        ) : null}
                      </div>
                    </div>
                    <motion.div
                      animate={{ x: 0 }}
                      whileHover={reduceMotion ? undefined : { x: 3 }}
                      transition={reduceMotion ? { duration: 0 } : springs.soft}
                      className="shrink-0"
                    >
                      <ChevronRight size={16} className="text-white/20" />
                    </motion.div>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileView;
