import React, {
  useState,
  useEffect,
  useMemo,
  useRef,
  useCallback,
  useDeferredValue,
} from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Markdown from 'react-markdown';
import {
  AlertCircle,
  BarChart3,
  Bookmark,
  BookOpen,
  Brain,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Eye,
  Flame,
  Home,
  Info,
  Play,
  RotateCcw,
  Search,
  Sparkles,
  Star,
  Target,
  Timer,
  Trophy,
  XCircle,
  Zap,
  Bot,
} from 'lucide-react';

import {
  AnimatedButton,
  GlassCard,
  Header,
} from '../../components/UI';
import InlineQuestionCard from '../../components/InlineQuestionCard';
import XPGain from './XPGainView';

import { useStore, Question } from '../../store';
import { aiService } from '../../services/aiService';
import TrainingSession from '../../components/TrainingSession';
import ExamSession from '../../components/ExamSession';
import ExamReview from '../../components/ExamReview';
import ViewDisabledFallback from '../../components/ViewDisabledFallback';
import { FEATURE_FLAGS } from '../../config/featureFlags';
import { useAllQuestions } from '../../hooks/useQuestions';
import { QuestionsLoadingSkeleton } from '../../components/shared/QuestionsLoadingSkeleton';
import { QuestionsLoadError } from '../../components/shared/QuestionsLoadError';
import {
  TOPICS,
  EXAM_STATS,
} from '../../data/questions';
import { EXTERNAL_BANKS } from '../../data/banks';
import {
  playSuccessSound,
  triggerConfetti,
  safePlayAudio,
  calculateDaysLeft,
} from '../../lib/studyUtils';
import { useAppNavigation } from '../../app/router/useAppNavigation';
import { useAIUI } from '../../hooks/useAIUI';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

// ═══════════════════════════════════════════════════════════
// FATIA 1/5 — Estado, effects, handlers e helpers
// (copiado de src/App.tsx linhas 2699-2959)
// ═══════════════════════════════════════════════════════════

const QuestionsView = () => {
  const { questions: ALL_QUESTIONS, loading: qLoading, error: qError } = useAllQuestions();
  const { user, loading } = useAuth();
  const { goBack, goTo } = useAppNavigation();
  const { openChat } = useAIUI();
  const { addXP, addToHistory, toggleFavorite, favorites, history, reviewLater, toggleReviewLater, updateMastery, navFilters, clearNavFilters } = useStore();
  const [view, setView] = useState<'bank' | 'training' | 'exam' | 'result' | 'exam-setup' | 'review' | 'external-banks' | 'ai-setup'>('bank');
  const [aiTopic, setAiTopic] = useState('');
  const [aiCount, setAiCount] = useState(10);
  const [filterSubject, setFilterSubject] = useState(navFilters.subject || '');
  const [filterTopic, setFilterTopic] = useState(navFilters.topic || '');
  const [filterDifficulty, setFilterDifficulty] = useState(navFilters.difficulty || '');
  const [filterYear, setFilterYear] = useState('');
  const [filterSource, setFilterSource] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'wrong' | 'unanswered'>('all');
  const [searchQuery, setSearchQuery] = useState(navFilters.search || '');
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  
  useEffect(() => {
    // Sync with navFilters if they change while the view is mounted
    if (navFilters.subject) setFilterSubject(navFilters.subject);
    if (navFilters.topic) setFilterTopic(navFilters.topic);
    if (navFilters.search) setSearchQuery(navFilters.search);
    if (navFilters.difficulty) setFilterDifficulty(navFilters.difficulty);
    
    // Clear filters after applying to local state
    if (Object.keys(navFilters).length > 0) {
      clearNavFilters();
    }
  }, [navFilters, clearNavFilters]);
  const [showOnlyReviewLater, setShowOnlyReviewLater] = useState(useStore.getState().showOnlyReviewLater || false);
  
  const deferredFilterSubject = useDeferredValue(filterSubject);
  const deferredFilterTopic = useDeferredValue(filterTopic);
  const deferredFilterDifficulty = useDeferredValue(filterDifficulty);
  const deferredFilterYear = useDeferredValue(filterYear);
  const deferredFilterSource = useDeferredValue(filterSource);
  const deferredFilterStatus = useDeferredValue(filterStatus);
  const deferredSearchQuery = useDeferredValue(searchQuery);
  const deferredShowOnlyFavorites = useDeferredValue(showOnlyFavorites);
  const deferredShowOnlyReviewLater = useDeferredValue(showOnlyReviewLater);

  useEffect(() => {
    return () => {
      useStore.setState({ showOnlyReviewLater: false });
    };
  }, []);
  
  const [currentIdx, setCurrentIdx] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [aiExplanation, setAiExplanation] = useState('');
  const [loadingAI, setLoadingAI] = useState(false);
  const [generatingAI, setGeneratingAI] = useState(false);
  const autoNextTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const [examTime, setExamTime] = useState(0);
  const [examDuration, setExamDuration] = useState(30); // minutes
  const [examQuestions, setExamQuestions] = useState<Question[]>([]);
  const [correct, setCorrect] = useState(0);
  const [saved, setSaved] = useState(false);
  const [visibleCount, setVisibleCount] = useState(20);
  
  const [xpGains, setXpGains] = useState<{ id: number, amount: number }[]>([]);

  const syncXP = async (amount: number) => {
    if (loading) return;
    if (!user?.id) return;

    try {
      // Get current user data
      const { data: userData, error: fetchError } = await supabase
        .from('users')
        .select('xp, level')
        .eq('id', user.id)
        .single();
      
      if (fetchError) throw fetchError;

      const currentXp = userData?.xp ?? 0;
      const newXp = currentXp + amount;
      const newLevel = Math.floor(newXp / 1000) + 1;
      
      const { error: updateError } = await supabase
        .from('users')
        .update({ 
          xp: newXp, 
          level: newLevel 
        })
        .eq('id', user.id);

      if (updateError) throw updateError;
      
      setXpGains(prev => [...prev, { id: Date.now(), amount }]);
    } catch (e) {
      console.error("Failed to sync XP", e);
    }
  };

  const syncHistory = async (entry: any) => {
    if (loading) return;
    if (!user?.id) return;

    try {
      const { error } = await supabase
        .from('history')
        .upsert({
          user_id: user.id,
          question_id: entry.questionId,
          content: entry,
          created_at: new Date().toISOString()
        }, { onConflict: 'user_id,question_id' });

      if (error) throw error;
    } catch (e) {
      console.error("Failed to sync history", e);
    }
  };

  // Reset visible count when filters change
  useEffect(() => {
    setVisibleCount(20);
  }, [deferredFilterSubject, deferredFilterTopic, deferredFilterDifficulty, deferredFilterYear, deferredFilterSource, deferredSearchQuery, deferredShowOnlyFavorites, deferredShowOnlyReviewLater, deferredFilterStatus]);

  // Result calculation effect
  useEffect(() => {
    if (view !== 'result' || saved) return;
    let c = 0;
    examQuestions.forEach((q, i) => {
      if (!q) return;
      const isCorrect = userAnswers[i] === q.resposta;
      if (isCorrect) c++;
      addToHistory({
        questionId: q.id,
        userAnswer: userAnswers[i],
        isCorrect,
        timestamp: new Date().toISOString()
      });
      updateMastery(q.materia, isCorrect ? 100 : 0);
    });
    setCorrect(c);
    if (c > 0) addXP(c * 10);
    setSaved(true);
  }, [view, examQuestions, userAnswers, saved, addToHistory, addXP, updateMastery]);

  // Pre-calculate wrong question IDs for faster filtering
  const questionStatusMap = useMemo(() => {
    const latestAttempts = new Map<string, boolean>();
    [...history].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).forEach(h => {
      if (!latestAttempts.has(h.questionId)) {
        latestAttempts.set(h.questionId, h.isCorrect);
      }
    });
    return latestAttempts;
  }, [history]);

  // Filter logic
  const filteredQuestions = useMemo(() => {
    if (!ALL_QUESTIONS) return [];
    return ALL_QUESTIONS.filter(q => {
      if (!q) return false;
      const matchesSubject = !deferredFilterSubject || q.materia === deferredFilterSubject;
      const matchesTopic = !deferredFilterTopic || q.assunto === deferredFilterTopic;
      const matchesDifficulty = !deferredFilterDifficulty || q.difficulty === deferredFilterDifficulty;
      const matchesYear = !deferredFilterYear || q.ano.toString() === deferredFilterYear;
      const matchesSource = !deferredFilterSource || q.prova === deferredFilterSource;
      const matchesSearch = !deferredSearchQuery || (q.pergunta || '').toLowerCase().includes(deferredSearchQuery.toLowerCase());
      const matchesFavorite = !deferredShowOnlyFavorites || favorites.includes(q.id);
      const matchesReviewLater = !deferredShowOnlyReviewLater || reviewLater.includes(q.id);
      
      let matchesStatus = true;
      if (deferredFilterStatus === 'wrong') {
        matchesStatus = questionStatusMap.get(q.id) === false;
      } else if (deferredFilterStatus === 'unanswered') {
        matchesStatus = !questionStatusMap.has(q.id);
      }

      return matchesSubject && matchesTopic && matchesDifficulty && matchesSearch && matchesFavorite && matchesReviewLater && matchesYear && matchesSource && matchesStatus;
    });
  }, [deferredFilterSubject, deferredFilterTopic, deferredFilterDifficulty, deferredFilterYear, deferredFilterSource, deferredSearchQuery, deferredShowOnlyFavorites, favorites, deferredShowOnlyReviewLater, reviewLater, deferredFilterStatus, questionStatusMap]);

  const errorQuestions = useMemo(() => {
    if (!ALL_QUESTIONS) return [];
    return ALL_QUESTIONS.filter(q => {
      if (!q) return false;
      const isCorrect = questionStatusMap.get(q.id);
      return isCorrect === false; // Only if latest attempt was wrong
    });
  }, [questionStatusMap]);

  // Exam Timer
  useEffect(() => {
    let timer: any;
    if (view === 'exam' && examTime < examDuration * 60) {
      timer = setInterval(() => setExamTime(t => t + 1), 1000);
    } else if (view === 'exam' && examTime >= examDuration * 60) {
      setView('result');
    }
    return () => clearInterval(timer);
  }, [view, examTime, examDuration]);

  const startTraining = (qs: Question[]) => {
    setExamQuestions(qs);
    setCurrentIdx(0);
    setSelectedOption(null);
    setConfirmed(false);
    setShowExplanation(false);
    setAiExplanation('');
    setView('training');
    setSaved(false);
    setCorrect(0);
  };

  const startExam = (qs: Question[]) => {
    setExamQuestions(qs);
    setCurrentIdx(0);
    setUserAnswers({});
    setExamTime(0);
    setView('exam');
    setSaved(false);
    setCorrect(0);
  };

  const handleAnswer = (idx: number) => {
    if (view === 'training') {
      if (confirmed) return;
      setSelectedOption(idx);
    } else {
      setUserAnswers({ ...userAnswers, [currentIdx]: idx });
    }
  };

  const confirmAnswer = () => {
    if (selectedOption === null || confirmed) return;
    setConfirmed(true);
    
    const { trackFeature } = useStore.getState();
    trackFeature('questions');

    const q = examQuestions[currentIdx];
    const isCorrect = selectedOption === q.resposta;
    const entry = {
      questionId: q.id,
      userAnswer: selectedOption,
      isCorrect,
      timestamp: new Date().toISOString()
    };
    addToHistory(entry);
    syncHistory(entry);
    if (isCorrect) {
      addXP(20);
      syncXP(20);
      setCorrect(c => c + 1);
      playSuccessSound();
      triggerConfetti();
      // Auto next after 2.5s if correct
      if (autoNextTimeoutRef.current) clearTimeout(autoNextTimeoutRef.current);
      autoNextTimeoutRef.current = setTimeout(() => {
        if (currentIdx < examQuestions.length - 1) {
          setCurrentIdx(c => c + 1);
          setSelectedOption(null);
          setConfirmed(false);
          setShowExplanation(false);
          setAiExplanation('');
        } else {
          setView('result');
        }
      }, 2500);
    }
    setShowExplanation(true);
  };

  const explainWithAI = async () => {
    if (autoNextTimeoutRef.current) clearTimeout(autoNextTimeoutRef.current);
    const q = examQuestions[currentIdx];
    setLoadingAI(true);
    try {
      const explanation = await aiService.explainQuestion(q.pergunta, q.alternativas, q.alternativas[q.resposta]);
      setAiExplanation(explanation);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingAI(false);
    }
  };

  const explainErrorWithAI = async () => {
    if (autoNextTimeoutRef.current) clearTimeout(autoNextTimeoutRef.current);
    const q = examQuestions[currentIdx];
    if (selectedOption === null) return;
    setLoadingAI(true);
    try {
      const explanation = await aiService.explainError(q.pergunta, q.alternativas, q.alternativas[q.resposta], q.alternativas[selectedOption]);
      setAiExplanation(explanation);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingAI(false);
    }
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const rs = s % 60;
    return `${m}:${rs.toString().padStart(2, '0')}`;
  };

  if (qLoading) return <QuestionsLoadingSkeleton />;
  if (qError) return <QuestionsLoadError error={qError} />;

  // ═══════════════════════════════════════════════════════════
  // FATIA 2/5 — view 'bank' + handler handleGenerateAIQuestions
  // (copiado de src/App.tsx linhas 2960-3226)
  // ═══════════════════════════════════════════════════════════

  if (view === 'bank') {
    return (
      <div className="p-6 space-y-8 pb-32">
        <header className="space-y-6">
          <Header 
            title="Banco de Questões"
            subtitle="Reais"
            icon={BookOpen}
            color="blue"
            onBack={() => goTo('/')}
            rightContent={
              <div className="flex gap-2">
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setView('external-banks')}
                  className="px-4 py-2 bg-primary/10 text-primary rounded-2xl text-[10px] font-premium-mono font-bold border border-primary/20 flex items-center gap-2 uppercase tracking-wider"
                >
                  <ExternalLink size={14} /> Outros Bancos
                </motion.button>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setView('review')}
                  className="px-4 py-2 bg-red-500/10 text-red-500 rounded-2xl text-[10px] font-premium-mono font-bold border border-red-500/20 flex items-center gap-2 uppercase tracking-wider"
                >
                  <AlertCircle size={14} /> Revisar Erros ({errorQuestions.length})
                </motion.button>
              </div>
            }
          />

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {Object.entries(EXAM_STATS).map(([exam, count]) => (
              <GlassCard 
                key={exam}
                onClick={() => setFilterSource(filterSource === exam ? '' : exam)}
                className={`p-3 cursor-pointer transition-all border-white/5 hover:border-primary/30 ${filterSource === exam ? 'border-primary/50 bg-primary/5' : ''}`}
              >
                <p className="text-[10px] font-premium-mono font-bold text-primary mb-1">{exam}</p>
                <p className="text-lg font-premium-title">{count.toLocaleString()}</p>
                <p className="text-[8px] text-text-secondary uppercase font-bold tracking-tighter">Questões</p>
              </GlassCard>
            ))}
          </div>

          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/20 to-transparent rounded-2xl blur opacity-0 group-focus-within:opacity-100 transition duration-500" />
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary" size={18} />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Pesquisar questões por termo ou código..."
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:border-primary/50 outline-none transition-all placeholder:text-text-secondary/50 text-sm font-medium"
              />
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex gap-3 items-center">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
                className={`p-3.5 rounded-2xl border transition-all ${showOnlyFavorites ? 'bg-primary text-black border-primary shadow-[0_0_15px_rgba(0,255,148,0.4)]' : 'bg-white/5 border-white/10 text-text-secondary hover:border-white/20'}`}
                title="Favoritas"
              >
                <Star size={20} fill={showOnlyFavorites ? "currentColor" : "none"} />
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowOnlyReviewLater(!showOnlyReviewLater)}
                className={`p-3.5 rounded-2xl border transition-all ${showOnlyReviewLater ? 'bg-orange-500 text-white border-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.4)]' : 'bg-white/5 border-white/10 text-text-secondary hover:border-white/20'}`}
                title="Revisar Depois"
              >
                <Bookmark size={20} fill={showOnlyReviewLater ? "currentColor" : "none"} />
              </motion.button>
              <div className="flex gap-2 overflow-x-auto no-scrollbar flex-1 py-1">
                {Object.keys(TOPICS).map(s => (
                  <motion.button
                    key={s}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setFilterSubject(filterSubject === s ? '' : s);
                      setFilterTopic('');
                    }}
                    className={`px-5 py-2.5 rounded-2xl border whitespace-nowrap text-[11px] font-premium-mono font-bold transition-all uppercase tracking-wider ${filterSubject === s ? 'bg-primary text-black border-primary shadow-[0_0_10px_rgba(0,255,148,0.3)]' : 'bg-white/5 border-white/10 text-text-secondary hover:border-white/20'}`}
                  >
                    {s}
                  </motion.button>
                ))}
              </div>
            </div>

            <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
              <select 
                value={filterDifficulty} 
                onChange={(e) => setFilterDifficulty(e.target.value)}
                className="bg-white/5 border border-white/10 rounded-2xl px-4 py-2.5 text-[10px] font-premium-mono font-bold outline-none focus:border-primary/50 uppercase tracking-widest appearance-none min-w-[120px] text-center"
              >
                <option value="" className="bg-black">Dificuldade</option>
                <option value="Easy" className="bg-black">Fácil</option>
                <option value="Medium" className="bg-black">Médio</option>
                <option value="Hard" className="bg-black">Difícil</option>
              </select>
              <select 
                value={filterYear} 
                onChange={(e) => setFilterYear(e.target.value)}
                className="bg-white/5 border border-white/10 rounded-2xl px-4 py-2.5 text-[10px] font-premium-mono font-bold outline-none focus:border-primary/50 uppercase tracking-widest appearance-none min-w-[100px] text-center"
              >
                <option value="" className="bg-black">Ano</option>
                {Array.from({ length: 26 }, (_, i) => 2025 - i).map(y => (
                  <option key={y} value={y} className="bg-black">{y}</option>
                ))}
              </select>
              <select 
                value={filterSource} 
                onChange={(e) => setFilterSource(e.target.value)}
                className="bg-white/5 border border-white/10 rounded-2xl px-4 py-2.5 text-[10px] font-premium-mono font-bold outline-none focus:border-primary/50 uppercase tracking-widest appearance-none min-w-[120px] text-center"
              >
                <option value="" className="bg-black">Prova</option>
                {Object.keys(EXAM_STATS).map(s => (
                  <option key={s} value={s} className="bg-black">{s}</option>
                ))}
              </select>
              <select 
                value={filterStatus} 
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="bg-white/5 border border-white/10 rounded-2xl px-4 py-2.5 text-[10px] font-premium-mono font-bold outline-none focus:border-primary/50 uppercase tracking-widest appearance-none min-w-[120px] text-center"
              >
                <option value="all" className="bg-black">Todos Status</option>
                <option value="wrong" className="bg-black">Só Erros</option>
                <option value="unanswered" className="bg-black">Não Respondidas</option>
              </select>
            </div>

            {filterSubject && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-2 overflow-x-auto no-scrollbar pb-2"
              >
                {TOPICS[filterSubject]?.map(t => (
                  <button
                    key={t}
                    onClick={() => setFilterTopic(filterTopic === t ? '' : t)}
                    className={`px-4 py-2 rounded-xl border whitespace-nowrap text-[10px] font-bold uppercase tracking-tighter transition-all ${filterTopic === t ? 'bg-white/20 border-white/30 text-white' : 'bg-white/5 border-white/10 text-text-secondary hover:border-white/20'}`}
                  >
                    {t}
                  </button>
                ))}
              </motion.div>
            )}
          </div>
        </header>

        <div className="grid grid-cols-2 gap-3">
          <AnimatedButton 
            onClick={() => startTraining(filteredQuestions)} 
            className="flex-1 py-4 text-[10px] font-premium-mono font-bold uppercase tracking-[0.1em] flex flex-col items-center justify-center gap-2" 
            glow
          >
            <Play size={18} />
            Resolver Contínuo
          </AnimatedButton>
          <AnimatedButton 
            onClick={() => setView('exam-setup')} 
            variant="secondary" 
            className="flex-1 py-4 text-[10px] font-premium-mono font-bold uppercase tracking-[0.1em] border-white/10 flex flex-col items-center justify-center gap-2"
          >
            <Timer size={18} />
            Modo Prova Real
          </AnimatedButton>
          <AnimatedButton 
            onClick={() => {
              if (!ALL_QUESTIONS) return;
              const hardQs = ALL_QUESTIONS.filter(q => q && q.difficulty === 'Hard');
              startTraining(hardQs.length > 0 ? hardQs : filteredQuestions);
            }} 
            variant="secondary" 
            className="flex-1 py-4 text-[10px] font-premium-mono font-bold uppercase tracking-[0.1em] border-red-500/20 text-red-500 bg-red-500/5 hover:bg-red-500/10 flex flex-col items-center justify-center gap-2"
          >
            <Flame size={18} />
            Só Difíceis
          </AnimatedButton>
          <AnimatedButton 
            onClick={() => {
              if (!ALL_QUESTIONS) return;
              const enemQs = ALL_QUESTIONS.filter(q => q && q.prova === 'ENEM');
              startTraining(enemQs.length > 0 ? enemQs : filteredQuestions);
            }} 
            variant="secondary" 
            className="flex-1 py-4 text-[10px] font-premium-mono font-bold uppercase tracking-[0.1em] border-blue-500/20 text-blue-500 bg-blue-500/5 hover:bg-blue-500/10 flex flex-col items-center justify-center gap-2"
          >
            <Target size={18} />
            Foco ENEM
          </AnimatedButton>
          <AnimatedButton 
            onClick={() => setView('ai-setup')} 
            variant="secondary" 
            className="flex-1 py-4 text-[10px] font-premium-mono font-bold uppercase tracking-[0.1em] border-purple-500/20 text-purple-500 bg-purple-500/5 hover:bg-purple-500/10 flex flex-col items-center justify-center gap-2"
            glow
          >
            <Sparkles size={18} />
            Simulador IA
          </AnimatedButton>
        </div>

        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-1 h-4 bg-primary rounded-full" />
            <h3 className="text-[10px] font-premium-mono font-bold text-text-secondary uppercase tracking-[0.3em]">Questões Encontradas</h3>
          </div>
          
          <div className="grid grid-cols-1 gap-4">
            {filteredQuestions.slice(0, visibleCount).map((q, idx) => (
              <motion.div
                key={q.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: (idx % 20) * 0.05 }}
              >
                <InlineQuestionCard q={q} />
              </motion.div>
            ))}
            
            {visibleCount < filteredQuestions.length && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setVisibleCount(prev => prev + 20)}
                className="w-full py-4 mt-4 bg-white/5 border border-white/10 rounded-2xl text-xs font-premium-mono font-bold uppercase tracking-widest text-text-secondary hover:text-white hover:bg-white/10 transition-all"
              >
                Carregar Mais ({filteredQuestions.length - visibleCount} restantes)
              </motion.button>
            )}

            {filteredQuestions.length === 0 && (
              <div className="text-center py-20 space-y-4">
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto border border-white/10">
                  <Search size={24} className="text-text-secondary/30" />
                </div>
                <p className="text-text-secondary text-sm font-medium italic">Nenhuma questão encontrada com esses filtros.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  const handleGenerateAIQuestions = async () => {
    if (!aiTopic.trim()) return;
    setGeneratingAI(true);
    try {
      const qs = await aiService.generateQuestions(aiTopic, aiCount);
      setExamQuestions(qs);
      setCurrentIdx(0);
      setUserAnswers({});
      setConfirmed(false);
      setShowExplanation(false);
      setSaved(false);
      setView('exam');
    } catch (e) {
      console.error(e);
    } finally {
      setGeneratingAI(false);
    }
  };

  // ⚠️ FATIA 3 EM PROGRESSO. Falta: training, exam, review
  if (view === 'ai-setup') {
    return (
      <div className="p-6 space-y-6 pb-28">
        <Header 
          title="Gerar com IA"
          subtitle="Inteligência Artificial"
          icon={Sparkles}
          color="primary"
          onBack={() => setView('bank')}
          rightContent={
            <button 
              onClick={() => openChat('GERADOR_QUESTOES')}
              className="p-2 rounded-xl bg-primary/10 border border-primary/30 text-primary hover:bg-primary/20 transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(0,255,148,0.15)]"
            >
              <Bot size={16} />
              <span className="text-[10px] font-bold uppercase tracking-widest hidden sm:inline">Avatar Gerador</span>
            </button>
          }
        />

        <GlassCard className="p-6 space-y-5" glow>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center">
              <Brain size={20} className="text-primary" />
            </div>
            <div>
              <h3 className="font-bold text-white">Questões Personalizadas</h3>
              <p className="text-xs text-text-secondary">Gere questões sob medida com IA</p>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-premium-mono font-bold text-text-secondary uppercase tracking-widest">
              Tema ou Assunto
            </label>
            <input
              type="text"
              value={aiTopic}
              onChange={(e) => setAiTopic(e.target.value)}
              placeholder="Ex: Direito Constitucional, Princípios Fundamentais..."
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder:text-text-secondary/50 focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all"
            />
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-premium-mono font-bold text-text-secondary uppercase tracking-widest">
              Quantidade de Questões
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[5, 10, 15, 20].map((num) => (
                <button
                  key={num}
                  onClick={() => setAiCount(num)}
                  className={`py-3 rounded-xl border text-sm font-bold transition-all ${
                    aiCount === num
                      ? 'bg-primary/20 border-primary text-primary'
                      : 'bg-white/5 border-white/10 text-text-secondary hover:border-white/20'
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>

          <AnimatedButton 
            onClick={handleGenerateAIQuestions} 
            disabled={!aiTopic.trim() || loadingAI}
            className="w-full h-14 text-xs font-premium-mono font-bold uppercase tracking-[0.3em]"
            glow
          >
            {loadingAI ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                >
                  <Brain size={18} />
                </motion.div>
                Gerando...
              </>
            ) : (
              <>
                <Sparkles size={18} />
                Gerar Questões
              </>
            )}
          </AnimatedButton>
        </GlassCard>
      </div>
    );
  }

  if (view === 'exam-setup') {
    return (
      <div className="p-6 space-y-6 pb-28">
        <Header 
          title="Configurar Prova"
          subtitle="Modo Simulado"
          icon={Timer}
          color="orange"
          onBack={() => setView('bank')}
        />

        <GlassCard className="p-6 space-y-5" glow>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center">
              <Timer size={20} className="text-orange-400" />
            </div>
            <div>
              <h3 className="font-bold text-white">Prova Cronometrada</h3>
              <p className="text-xs text-text-secondary">
                {examQuestions.length} {examQuestions.length === 1 ? 'questão selecionada' : 'questões selecionadas'}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-premium-mono font-bold text-text-secondary uppercase tracking-widest">
              Duração da Prova
            </label>
            <div className="grid grid-cols-5 gap-2">
              {[15, 30, 45, 60, 90].map((min) => (
                <button
                  key={min}
                  onClick={() => setExamDuration(min)}
                  className={`py-3 rounded-xl border text-sm font-bold transition-all ${
                    examDuration === min
                      ? 'bg-orange-500/20 border-orange-500 text-orange-400'
                      : 'bg-white/5 border-white/10 text-text-secondary hover:border-white/20'
                  }`}
                >
                  {min}m
                </button>
              ))}
            </div>
            <p className="text-[10px] text-text-secondary/70 text-center">
              Você terá <span className="text-orange-400 font-bold">{examDuration} minutos</span> para resolver
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
            <div className="flex items-center gap-2 text-xs text-text-secondary">
              <Zap size={12} className="text-orange-400" />
              <span>Cronômetro regressivo ativo</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-text-secondary">
              <Zap size={12} className="text-orange-400" />
              <span>Resultado e gabarito ao final</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-text-secondary">
              <Zap size={12} className="text-orange-400" />
              <span>Sem possibilidade de pausa</span>
            </div>
          </div>

          <AnimatedButton 
            onClick={() => startExam(examQuestions)} 
            disabled={examQuestions.length === 0}
            className="w-full h-14 text-xs font-premium-mono font-bold uppercase tracking-[0.3em]"
            glow
          >
            <Timer size={18} />
            Iniciar Prova
          </AnimatedButton>
        </GlassCard>
      </div>
    );
  }

  if (view === 'external-banks') {
    return (
      <div className="p-6 space-y-6 pb-28">
        <Header 
          title="Bancos Externos"
          subtitle="Recursos complementares"
          icon={BookOpen}
          color="cyan"
          onBack={() => setView('bank')}
        />

        <GlassCard className="p-5 space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
              <BookOpen size={20} className="text-cyan-400" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">Portais de Estudo</h3>
              <p className="text-[11px] text-text-secondary">
                {EXTERNAL_BANKS.length} {EXTERNAL_BANKS.length === 1 ? 'recurso disponível' : 'recursos disponíveis'}
              </p>
            </div>
          </div>
          <p className="text-xs text-text-secondary leading-relaxed">
            Plataformas externas com questões e materiais. Os links abrem em nova aba.
          </p>
        </GlassCard>

        <div className="space-y-3">
          {EXTERNAL_BANKS.map((bank, idx) => (
            <button
              key={idx}
              onClick={() => window.open(bank.url, '_blank', 'noopener,noreferrer')}
              className="w-full text-left p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-cyan-500/40 hover:bg-cyan-500/5 transition-all group"
            >
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center flex-shrink-0 group-hover:bg-cyan-500/20 group-hover:border-cyan-500/40 transition-all">
                  <BookOpen size={18} className="text-cyan-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-bold text-white text-sm truncate">
                      {bank.name}
                    </h4>
                    <ExternalLink size={12} className="text-text-secondary flex-shrink-0 group-hover:text-cyan-400 transition-colors" />
                  </div>
                  <p className="text-xs text-text-secondary leading-relaxed line-clamp-2">
                    {bank.description}
                  </p>
                  <p className="text-[10px] font-premium-mono text-cyan-400/70 mt-2 truncate">
                    {bank.url.replace(/^https?:\/\//, '').replace(/\/$/, '')}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>

        {EXTERNAL_BANKS.length === 0 && (
          <GlassCard className="p-8 text-center space-y-2">
            <BookOpen size={32} className="text-text-secondary mx-auto opacity-50" />
            <p className="text-sm text-text-secondary">
              Nenhum banco externo cadastrado ainda.
            </p>
          </GlassCard>
        )}
      </div>
    );
  }

  if (view === 'result') {
    const total = examQuestions.length;
    const answered = Object.keys(userAnswers).length;
    const wrong = answered - correct;
    const blank = total - answered;
    const percent = total > 0 ? Math.round((correct / total) * 100) : 0;
    const xpEarned = correct * 10;

    const minutes = Math.floor(examTime / 60);
    const seconds = examTime % 60;
    const timeStr = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

    const byDifficulty = { Easy: { ok: 0, total: 0 }, Medium: { ok: 0, total: 0 }, Hard: { ok: 0, total: 0 } };
    examQuestions.forEach((q, i) => {
      byDifficulty[q.difficulty].total++;
      if (userAnswers[i] === q.resposta) byDifficulty[q.difficulty].ok++;
    });

    const perfColor = percent >= 70 ? 'primary' : percent >= 40 ? 'amber' : 'rose';
    const perfLabel = percent >= 70 ? 'Excelente!' : percent >= 40 ? 'Pode melhorar' : 'Precisa revisar';
    const perfIcon = percent >= 70 ? Trophy : percent >= 40 ? Target : AlertCircle;
    const PerfIcon = perfIcon;

    return (
      <div className="p-6 space-y-5 pb-28">
        <Header 
          title="Resultado"
          subtitle="Desempenho na prova"
          icon={Trophy}
          color={perfColor}
          onBack={() => setView('bank')}
        />

        <GlassCard className={`p-6 space-y-4 border-${perfColor}-500/30 bg-gradient-to-br from-${perfColor}-500/10 to-transparent`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-2xl bg-${perfColor}-500/20 border border-${perfColor}-500/40 flex items-center justify-center`}>
                <PerfIcon size={22} className={`text-${perfColor}-400`} />
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-wider text-text-secondary font-premium-mono">Aproveitamento</p>
                <p className={`text-sm font-bold text-${perfColor}-400`}>{perfLabel}</p>
              </div>
            </div>
            <div className="text-right">
              <p className={`text-4xl font-black text-${perfColor}-400 leading-none`}>{percent}%</p>
              <p className="text-[11px] text-text-secondary mt-1">{correct} de {total}</p>
            </div>
          </div>

          <div className="h-2 rounded-full bg-white/5 overflow-hidden">
            <div 
              className={`h-full bg-gradient-to-r from-${perfColor}-500 to-${perfColor}-400 transition-all duration-1000`}
              style={{ width: `${percent}%` }}
            />
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="flex items-center gap-2 p-3 rounded-xl bg-white/5 border border-white/10">
              <Timer size={16} className="text-cyan-400 flex-shrink-0" />
              <div>
                <p className="text-[10px] uppercase tracking-wider text-text-secondary">Tempo</p>
                <p className="text-sm font-bold font-premium-mono text-white">{timeStr}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 rounded-xl bg-white/5 border border-white/10">
              <Zap size={16} className="text-yellow-400 flex-shrink-0" />
              <div>
                <p className="text-[10px] uppercase tracking-wider text-text-secondary">XP ganho</p>
                <p className="text-sm font-bold font-premium-mono text-white">+{xpEarned}</p>
              </div>
            </div>
          </div>
        </GlassCard>

        <div className="grid grid-cols-3 gap-3">
          <GlassCard className="p-3 text-center space-y-1">
            <CheckCircle2 size={18} className="text-emerald-400 mx-auto" />
            <p className="text-xl font-black text-white">{correct}</p>
            <p className="text-[10px] uppercase tracking-wider text-text-secondary">Acertos</p>
          </GlassCard>
          <GlassCard className="p-3 text-center space-y-1">
            <XCircle size={18} className="text-rose-400 mx-auto" />
            <p className="text-xl font-black text-white">{wrong}</p>
            <p className="text-[10px] uppercase tracking-wider text-text-secondary">Erros</p>
          </GlassCard>
          <GlassCard className="p-3 text-center space-y-1">
            <AlertCircle size={18} className="text-text-secondary mx-auto" />
            <p className="text-xl font-black text-white">{blank}</p>
            <p className="text-[10px] uppercase tracking-wider text-text-secondary">Em branco</p>
          </GlassCard>
        </div>

        <GlassCard className="p-5 space-y-3">
          <div className="flex items-center gap-2">
            <BarChart3 size={16} className="text-purple-400" />
            <h3 className="font-bold text-white text-sm">Por dificuldade</h3>
          </div>
          <div className="space-y-3">
            {(['Easy', 'Medium', 'Hard'] as const).map(level => {
              const data = byDifficulty[level];
              const pct = data.total > 0 ? Math.round((data.ok / data.total) * 100) : 0;
              const color = level === 'Easy' ? 'emerald' : level === 'Medium' ? 'amber' : 'rose';
              const label = level === 'Easy' ? 'Fácil' : level === 'Medium' ? 'Médio' : 'Difícil';
              if (data.total === 0) return null;
              return (
                <div key={level} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className={`font-bold text-${color}-400`}>{label}</span>
                    <span className="font-premium-mono text-text-secondary">
                      {data.ok}/{data.total} · {pct}%
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                    <div 
                      className={`h-full bg-${color}-400 transition-all duration-700`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </GlassCard>

        <div className="grid grid-cols-2 gap-3">
          <AnimatedButton
            onClick={() => setView('review')}
            variant="secondary"
          >
            <span className="flex items-center justify-center gap-2">
              <Eye size={16} />
              Revisar
            </span>
          </AnimatedButton>
          <AnimatedButton
            onClick={() => setView('bank')}
            variant="primary"
          >
            <span className="flex items-center justify-center gap-2">
              <Home size={16} />
              Voltar
            </span>
          </AnimatedButton>
        </div>
      </div>
    );
  }

  if (view === 'review') {
    if (!FEATURE_FLAGS.ENABLE_EXAM_REVIEW_V1) {
      return (
        <ViewDisabledFallback 
          feature="Revisão do Simulado" 
          onBack={() => setView('bank')} 
        />
      );
    }
    return (
      <ExamReview 
        questions={examQuestions}
        userAnswers={userAnswers}
        timeSpent={examTime}
        onBack={() => setView('bank')}
      />
    );
  }

  if (view === 'training') {
    if (!FEATURE_FLAGS.ENABLE_TRAINING_V1) {
      return (
        <ViewDisabledFallback 
          feature="Treinamento" 
          onBack={() => setView('bank')} 
        />
      );
    }
    return (
      <TrainingSession 
        questions={examQuestions}
        onComplete={(correct, answers) => {
          setCorrect(correct);
          setUserAnswers(answers);
          setSaved(true); // Prevenir dupla gravação no useEffect de resultados
          setView('result');
        }}
        onCancel={() => setView('bank')}
      />
    );
  }

  if (view === 'exam') {
    if (!FEATURE_FLAGS.ENABLE_EXAM_V1) {
      return (
        <ViewDisabledFallback 
          feature="Simulado" 
          onBack={() => setView('bank')} 
        />
      );
    }
    return (
      <ExamSession 
        questions={examQuestions}
        durationMinutes={examDuration}
        onComplete={(correct, answers, timeTaken) => {
          setCorrect(correct);
          setUserAnswers(answers);
          setExamTime(timeTaken);
          setSaved(false); // Here false because it needs to trigger the results useEffect to save history
          setView('review');
        }}
        onCancel={() => setView('bank')}
      />
    );
  }

  return null;
}

export default QuestionsView;
