import React, {
  useState,
  useEffect,
  useMemo,
  useRef,
  useCallback,
  useDeferredValue
} from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { springs } from '../../lib/animations/easings';
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
import { athenaClient } from '../../features/athena/services/athenaClient';
import { DEFAULT_OPENROUTER_CHAT_MODEL } from '../../config/openRouter';
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
import {
  recordQuestionAttempt,
  recordQuestionAttemptsBatch,
  bumpStreakForActivity,
  type RecordQuestionAttemptBatchItem,
} from '../../lib/persistence';
import { useAuth } from '../../contexts/AuthContext';
import { computeQuestionHistorySummary } from '../../lib/questionHistory';
import { toast } from '../../store/useToastStore';

// ═══════════════════════════════════════════════════════════
// FATIA 1/5 — Estado, effects, handlers e helpers
// (copiado de src/App.tsx linhas 2699-2959)
// ═══════════════════════════════════════════════════════════

const QuestionsView = () => {
  const { questions: ALL_QUESTIONS, loading: qLoading, error: qError } = useAllQuestions();
  const { user } = useAuth();
  const { goBack, goTo } = useAppNavigation();
  const { openChat } = useAIUI();
  const {
    toggleFavorite,
    favorites,
    history,
    viewedAtByQuestionId,
    reviewLater,
    toggleReviewLater,
    navFilters,
    clearNavFilters,
  } = useStore();
  const reduceMotion = useReducedMotion() ?? false;
  const [view, setView] = useState<'bank' | 'training' | 'exam' | 'result' | 'exam-setup' | 'review' | 'external-banks' | 'ai-setup'>('bank');
  const [aiTopic, setAiTopic] = useState('');
  const [aiCount, setAiCount] = useState(10);
  const [filterSubject, setFilterSubject] = useState(navFilters.subject || '');
  const [filterTopic, setFilterTopic] = useState(navFilters.topic || '');
  const [filterDifficulty, setFilterDifficulty] = useState(navFilters.difficulty || '');
  const [filterYear, setFilterYear] = useState('');
  const [filterSource, setFilterSource] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'wrong' | 'unanswered'>('all');
  const [historyDisplayFilter, setHistoryDisplayFilter] = useState<
    'all' | 'onlyWrongLatest' | 'hideAlwaysCorrect' | 'onlyNew'
  >('all');
  const [searchQuery, setSearchQuery] = useState(navFilters.search || '');
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  
  useEffect(() => {
    // Sync with navFilters if they change while the view is mounted
    if (navFilters.subject) setFilterSubject(navFilters.subject);
    if (navFilters.topic) setFilterTopic(navFilters.topic);
    if (navFilters.search) setSearchQuery(navFilters.search);
    if (navFilters.difficulty) setFilterDifficulty(navFilters.difficulty);
    if (navFilters.filterStatus === 'wrong' || navFilters.filterStatus === 'unanswered' || navFilters.filterStatus === 'all') {
      setFilterStatus(navFilters.filterStatus);
    }

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
  const deferredHistoryDisplayFilter = useDeferredValue(historyDisplayFilter);

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

  // Reset visible count when filters change
  useEffect(() => {
    setVisibleCount(20);
  }, [deferredFilterSubject, deferredFilterTopic, deferredFilterDifficulty, deferredFilterYear, deferredFilterSource, deferredSearchQuery, deferredShowOnlyFavorites, deferredShowOnlyReviewLater, deferredFilterStatus, deferredHistoryDisplayFilter]);

  // Result calculation + persistência (Fase 2)
  useEffect(() => {
    if (view !== 'result' || saved) return;
    let c = 0;
    examQuestions.forEach((q, i) => {
      if (!q || userAnswers[i] === undefined) return;
      if (userAnswers[i] === q.resposta) c++;
    });
    setCorrect(c);
    setSaved(true);

    void (async () => {
      const uid = user?.id ?? null;
      const items: RecordQuestionAttemptBatchItem[] = [];
      for (let i = 0; i < examQuestions.length; i++) {
        const q = examQuestions[i];
        if (!q || userAnswers[i] === undefined) continue;
        const isCorrect = userAnswers[i] === q.resposta;
        items.push({
          question: q,
          userAnswer: userAnswers[i]!,
          isCorrect,
        });
      }
      await recordQuestionAttemptsBatch(uid, items, {
        xpAwardTotal: c * 10,
        skipStreak: true,
      });
      await bumpStreakForActivity(uid);
      if (c > 0) {
        setXpGains((prev) => [...prev, { id: Date.now(), amount: c * 10 }]);
      }
    })();
  }, [view, examQuestions, userAnswers, saved, user?.id]);

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

      const summary = computeQuestionHistorySummary(
        q.id,
        history,
        viewedAtByQuestionId
      );

      let matchesStatus = true;
      if (deferredFilterStatus === 'wrong') {
        matchesStatus =
          summary.status === 'wrong' || summary.status === 'review';
      } else if (deferredFilterStatus === 'unanswered') {
        matchesStatus = summary.totalAttempts === 0;
      }

      let matchesHistorySlice = true;
      if (deferredHistoryDisplayFilter === 'onlyWrongLatest') {
        matchesHistorySlice =
          summary.status === 'wrong' || summary.status === 'review';
      } else if (deferredHistoryDisplayFilter === 'hideAlwaysCorrect') {
        matchesHistorySlice = summary.status !== 'correct';
      } else if (deferredHistoryDisplayFilter === 'onlyNew') {
        matchesHistorySlice = summary.status === 'new';
      }

      return (
        matchesSubject &&
        matchesTopic &&
        matchesDifficulty &&
        matchesSearch &&
        matchesFavorite &&
        matchesReviewLater &&
        matchesYear &&
        matchesSource &&
        matchesStatus &&
        matchesHistorySlice
      );
    });
  }, [
    deferredFilterSubject,
    deferredFilterTopic,
    deferredFilterDifficulty,
    deferredFilterYear,
    deferredFilterSource,
    deferredSearchQuery,
    deferredShowOnlyFavorites,
    favorites,
    deferredShowOnlyReviewLater,
    reviewLater,
    deferredFilterStatus,
    deferredHistoryDisplayFilter,
    history,
    viewedAtByQuestionId,
  ]);

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
    void recordQuestionAttempt({
      userId: user?.id ?? null,
      question: q,
      userAnswer: selectedOption,
      isCorrect,
      xpAward: isCorrect ? 20 : 0,
    });
    if (isCorrect) {
      setXpGains((prev) => [...prev, { id: Date.now(), amount: 20 }]);
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
      const prompt = `Explique detalhadamente por que a alternativa "${q.alternativas[q.resposta]}" é a correta para a seguinte questão:
"${q.pergunta}"
Alternativas: ${JSON.stringify(q.alternativas)}`;

      const explanation = await athenaClient.chat({
        messages: [
          { role: 'system', content: 'Você é Athena, uma tutora educacional especializada no ENEM. Explique de forma clara e didática.' },
          { role: 'user', content: prompt }
        ],
        model: DEFAULT_OPENROUTER_CHAT_MODEL
      });
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
      const prompt = `O aluno marcou a alternativa "${q.alternativas[selectedOption]}", mas a correta é "${q.alternativas[q.resposta]}". 
Explique por que a escolha do aluno está incorreta e por que a outra é a correta.
Questão: "${q.pergunta}"
Alternativas: ${JSON.stringify(q.alternativas)}`;

      const explanation = await athenaClient.chat({
        messages: [
          { role: 'system', content: 'Você é Athena, uma tutora educacional especializada no ENEM. Seja empática e didática ao explicar o erro.' },
          { role: 'user', content: prompt }
        ],
        model: DEFAULT_OPENROUTER_CHAT_MODEL
      });
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
      <div className="app-shell-premium pt-5 md:pt-8 premium-page-stack pb-32 md:pb-36">
        <header className="premium-page-hero space-y-6">
          <Header 
            title="Banco de Questões"
            subtitle="Reais"
            icon={BookOpen}
            color="blue"
            onBack={() => goTo('/')}
            rightContent={
              <div className="flex gap-2">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.05, transition: springs.soft }}
                  whileTap={{ scale: 0.95, transition: springs.snappy }}
                  onClick={() => setView('external-banks')}
                  className="px-4 py-2 bg-primary/10 text-primary rounded-2xl text-[11px] font-premium-mono font-bold border border-primary/20 flex items-center gap-2 uppercase tracking-[0.08em] min-h-11 active:scale-[0.98] active:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                >
                  <ExternalLink size={14} /> Outros Bancos
                </motion.button>
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.05, transition: springs.soft }}
                  whileTap={{ scale: 0.95, transition: springs.snappy }}
                  onClick={() => {
                    if (errorQuestions.length === 0) {
                      toast.info(
                        'Revisar erros',
                        'Nenhuma questão com última tentativa errada. Responda o banco primeiro para acumular erros aqui.'
                      );
                      return;
                    }
                    startTraining(errorQuestions);
                  }}
                  className="px-4 py-2 bg-red-500/10 text-red-500 rounded-2xl text-[11px] font-premium-mono font-bold border border-red-500/20 flex items-center gap-2 uppercase tracking-[0.08em] min-h-11 active:scale-[0.98] active:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
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
                <p className="text-[9px] text-text-secondary uppercase font-bold tracking-[0.08em]">Questões</p>
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
                className="w-full bg-white/10 border border-white/20 rounded-2xl py-4 pl-12 pr-4 focus:border-primary/50 outline-none transition-all placeholder:text-white/60 text-sm font-medium"
              />
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex gap-3 items-center">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
                className={`p-3.5 rounded-2xl border transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-black ${showOnlyFavorites ? 'bg-primary text-black border-primary shadow-[0_0_15px_rgba(0,255,148,0.4)]' : 'bg-white/10 border-white/20 text-text-secondary hover:border-white/30'}`}
                title="Favoritas"
              >
                <Star size={20} fill={showOnlyFavorites ? "currentColor" : "none"} />
              </motion.button>
              <motion.button
                type="button"
                whileTap={{ scale: 0.9, transition: springs.snappy }}
                onClick={() => setShowOnlyReviewLater(!showOnlyReviewLater)}
                className={`p-3.5 rounded-2xl border transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-black ${showOnlyReviewLater ? 'bg-orange-500 text-white border-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.4)]' : 'bg-white/10 border-white/20 text-text-secondary hover:border-white/30'}`}
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
                    className={`px-5 py-2.5 rounded-2xl border whitespace-nowrap text-[11px] font-premium-mono font-bold transition-all uppercase tracking-wider min-h-11 active:scale-[0.98] active:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-black ${filterSubject === s ? 'bg-primary text-black border-primary shadow-[0_0_10px_rgba(0,255,148,0.3)]' : 'bg-white/10 border-white/20 text-text-secondary hover:border-white/30'}`}
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
                className="bg-white/10 border border-white/20 rounded-2xl px-4 py-2.5 text-[10px] font-premium-mono font-bold outline-none focus:border-primary/50 uppercase tracking-widest appearance-none min-w-[120px] min-h-11 text-center"
              >
                <option value="" className="bg-black">Dificuldade</option>
                <option value="Easy" className="bg-black">Fácil</option>
                <option value="Medium" className="bg-black">Médio</option>
                <option value="Hard" className="bg-black">Difícil</option>
              </select>
              <select 
                value={filterYear} 
                onChange={(e) => setFilterYear(e.target.value)}
                className="bg-white/10 border border-white/20 rounded-2xl px-4 py-2.5 text-[10px] font-premium-mono font-bold outline-none focus:border-primary/50 uppercase tracking-widest appearance-none min-w-[100px] min-h-11 text-center"
              >
                <option value="" className="bg-black">Ano</option>
                {Array.from({ length: 26 }, (_, i) => 2025 - i).map(y => (
                  <option key={y} value={y} className="bg-black">{y}</option>
                ))}
              </select>
              <select 
                value={filterSource} 
                onChange={(e) => setFilterSource(e.target.value)}
                className="bg-white/10 border border-white/20 rounded-2xl px-4 py-2.5 text-[10px] font-premium-mono font-bold outline-none focus:border-primary/50 uppercase tracking-widest appearance-none min-w-[120px] min-h-11 text-center"
              >
                <option value="" className="bg-black">Prova</option>
                {Object.keys(EXAM_STATS).map(s => (
                  <option key={s} value={s} className="bg-black">{s}</option>
                ))}
              </select>
              <select 
                value={filterStatus} 
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="bg-white/10 border border-white/20 rounded-2xl px-4 py-2.5 text-[10px] font-premium-mono font-bold outline-none focus:border-primary/50 uppercase tracking-widest appearance-none min-w-[120px] min-h-11 text-center"
              >
                <option value="all" className="bg-black">Todos Status</option>
                <option value="wrong" className="bg-black">Só Erros</option>
                <option value="unanswered" className="bg-black">Não Respondidas</option>
              </select>
              <select
                value={historyDisplayFilter}
                onChange={(e) =>
                  setHistoryDisplayFilter(
                    e.target.value as
                      | 'all'
                      | 'onlyWrongLatest'
                      | 'hideAlwaysCorrect'
                      | 'onlyNew'
                  )
                }
                className="bg-white/10 border border-white/20 rounded-2xl px-4 py-2.5 text-[10px] font-premium-mono font-bold outline-none focus:border-primary/50 uppercase tracking-widest appearance-none min-w-[140px] min-h-11 text-center"
                aria-label="Filtro por histórico de estudo"
              >
                <option value="all" className="bg-black">Histórico: todos</option>
                <option value="onlyWrongLatest" className="bg-black">Só última errada</option>
                <option value="hideAlwaysCorrect" className="bg-black">Esconder só acertos</option>
                <option value="onlyNew" className="bg-black">Só novas</option>
              </select>
            </div>

            {filterSubject && (
              <motion.div
                initial={{ opacity: 0, y: reduceMotion ? 0 : -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={reduceMotion ? { duration: 0.12 } : springs.card}
                className="flex gap-2 overflow-x-auto no-scrollbar pb-2"
              >
                {TOPICS[filterSubject]?.map(t => (
                  <button
                    key={t}
                    onClick={() => setFilterTopic(filterTopic === t ? '' : t)}
                    className={`px-4 py-2 rounded-xl border whitespace-nowrap text-[10px] font-bold uppercase tracking-tighter transition-all min-h-11 active:scale-[0.98] active:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-black ${filterTopic === t ? 'bg-white/20 border-white/30 text-white' : 'bg-white/10 border-white/20 text-text-secondary hover:border-white/30'}`}
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
            className="flex-1 py-4 text-[10px] font-premium-mono font-bold uppercase tracking-[0.1em] flex flex-col items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-black" 
            glow
          >
            <Play size={18} />
            Resolver Contínuo
          </AnimatedButton>
          <AnimatedButton 
            onClick={() => setView('exam-setup')} 
            variant="secondary" 
            className="flex-1 py-4 text-[10px] font-premium-mono font-bold uppercase tracking-[0.1em] border-white/10 flex flex-col items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
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
            className="flex-1 py-4 text-[10px] font-premium-mono font-bold uppercase tracking-[0.1em] border-red-500/20 text-red-500 bg-red-500/5 hover:bg-red-500/10 flex flex-col items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
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
            className="flex-1 py-4 text-[10px] font-premium-mono font-bold uppercase tracking-[0.1em] border-blue-500/20 text-blue-500 bg-blue-500/5 hover:bg-blue-500/10 flex flex-col items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
          >
            <Target size={18} />
            Foco ENEM
          </AnimatedButton>
          <AnimatedButton 
            onClick={() => setView('ai-setup')} 
            variant="secondary" 
            className="flex-1 py-4 text-[10px] font-premium-mono font-bold uppercase tracking-[0.1em] border-purple-500/20 text-purple-500 bg-purple-500/5 hover:bg-purple-500/10 flex flex-col items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            glow
          >
            <Sparkles size={18} />
            Simulador Personalizado
          </AnimatedButton>
        </div>

        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-1 h-4 bg-primary rounded-full" />
            <h3 className="text-[11px] font-premium-mono font-bold text-text-secondary uppercase tracking-[0.22em]">Questões Encontradas</h3>
          </div>
          
          <div className="grid grid-cols-1 gap-4">
            {filteredQuestions.slice(0, visibleCount).map((q, idx) => (
              <motion.div
                key={q.id}
                initial={{ opacity: 0, y: reduceMotion ? 0 : 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={
                  reduceMotion
                    ? { duration: 0.1, delay: (idx % 20) * 0.03 }
                    : { ...springs.card, delay: (idx % 20) * 0.05 }
                }
              >
                <InlineQuestionCard q={q} />
              </motion.div>
            ))}
            
            {visibleCount < filteredQuestions.length && (
              <motion.button
                type="button"
                whileHover={{ scale: 1.02, transition: springs.soft }}
                whileTap={{ scale: 0.98, transition: springs.snappy }}
                onClick={() => setVisibleCount(prev => prev + 20)}
                className="w-full py-4 mt-4 bg-white/10 border border-white/20 rounded-2xl text-xs font-premium-mono font-bold uppercase tracking-widest text-text-secondary hover:text-white hover:bg-white/15 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
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
      const prompt = `Gere ${aiCount} questões inéditas no estilo ENEM sobre o tema: ${aiTopic}.
Retorne APENAS um JSON: [{"id": "ai_1", "pergunta": "...", "alternativas": ["...", "...", "...", "...", "..."], "resposta": 0, "materia": "...", "assunto": "...", "ano": 2025, "difficulty": "Medium", "prova": "StudyFlow Personalizado"}]`;

      const response = await athenaClient.chat({
        messages: [
          { role: 'system', content: 'Você é um gerador de questões educacionais. Retorne apenas JSON.' },
          { role: 'user', content: prompt }
        ],
        model: DEFAULT_OPENROUTER_CHAT_MODEL
      });
      
      const cleanJson = response.replace(/```json|```/g, '').trim();
      const qs = JSON.parse(cleanJson);
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

  if (view === 'ai-setup') {
    return (
      <div className="app-shell-premium pt-5 md:pt-8 premium-page-stack pb-28">
        <Header 
          title="Gerar Questões"
          subtitle="Personalização"
          icon={Sparkles}
          color="primary"
          onBack={() => setView('bank')}
          rightContent={
            <button 
              onClick={() => openChat('Gerador de Questões')}
              className="p-2 rounded-xl bg-primary/10 border border-primary/30 text-primary hover:bg-primary/20 transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(0,255,148,0.15)] min-h-11 min-w-11 active:scale-[0.96] active:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            >
              <Bot size={16} />
              <span className="text-[11px] font-bold uppercase tracking-[0.08em] hidden sm:inline">Athena</span>
            </button>
          }
        />

        <GlassCard className="premium-list-card p-6 space-y-5" glow>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center">
              <Brain size={20} className="text-primary" />
            </div>
            <div>
              <h3 className="font-bold text-white">Questões Personalizadas</h3>
              <p className="text-xs text-text-secondary">Gere questões sob medida</p>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[11px] font-premium-mono font-bold text-text-secondary uppercase tracking-[0.08em]">
              Tema ou Assunto
            </label>
            <input
              type="text"
              value={aiTopic}
              onChange={(e) => setAiTopic(e.target.value)}
              placeholder="Ex: Direito Constitucional, Princípios Fundamentais..."
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-sm text-white placeholder:text-white/60 focus:outline-none focus:border-primary/50 focus:bg-white/15 transition-all"
            />
          </div>

          <div className="space-y-3">
            <label className="text-[11px] font-premium-mono font-bold text-text-secondary uppercase tracking-[0.08em]">
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
                      : 'bg-white/10 border-white/20 text-text-secondary hover:border-white/30'
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
                  animate={reduceMotion ? { rotate: 0 } : { rotate: 360 }}
                  transition={
                    reduceMotion
                      ? { duration: 0 }
                      : { repeat: Infinity, duration: 1, ease: 'linear' }
                  }
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
      <div className="app-shell-premium pt-5 md:pt-8 premium-page-stack pb-28">
        <Header 
          title="Configurar Prova"
          subtitle="Modo Simulado"
          icon={Timer}
          color="orange"
          onBack={() => setView('bank')}
        />

        <GlassCard className="premium-list-card p-6 space-y-5" glow>
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
            <label className="text-[11px] font-premium-mono font-bold text-text-secondary uppercase tracking-[0.08em]">
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
                      : 'bg-white/10 border-white/20 text-text-secondary hover:border-white/30'
                  }`}
                >
                  {min}m
                </button>
              ))}
            </div>
            <p className="text-[10px] text-text-secondary/90 text-center">
              Você terá <span className="text-orange-400 font-bold">{examDuration} minutos</span> para resolver
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white/10 border border-white/20 space-y-2">
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
      <div className="app-shell-premium pt-5 md:pt-8 premium-page-stack pb-28">
        <Header 
          title="Bancos Externos"
          subtitle="Recursos complementares"
          icon={BookOpen}
          color="cyan"
          onBack={() => setView('bank')}
        />

        <GlassCard className="premium-list-card p-5 space-y-2">
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
              className="premium-list-card w-full text-left p-5 rounded-2xl bg-white/[0.06] border border-white/15 hover:border-cyan-500/40 hover:bg-cyan-500/10 transition-all group"
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
          <GlassCard className="premium-empty-panel p-8 text-center space-y-2">
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
      <div className="app-shell-premium pt-5 md:pt-8 premium-page-stack pb-28">
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
            <div className="flex items-center gap-2 p-3 rounded-xl bg-white/10 border border-white/20">
              <Timer size={16} className="text-cyan-400 flex-shrink-0" />
              <div>
                <p className="text-[11px] uppercase tracking-[0.08em] text-text-secondary">Tempo</p>
                <p className="text-sm font-bold font-premium-mono text-white">{timeStr}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 rounded-xl bg-white/10 border border-white/20">
              <Zap size={16} className="text-yellow-400 flex-shrink-0" />
              <div>
                <p className="text-[11px] uppercase tracking-[0.08em] text-text-secondary">XP ganho</p>
                <p className="text-sm font-bold font-premium-mono text-white">+{xpEarned}</p>
              </div>
            </div>
          </div>
        </GlassCard>

        <div className="grid grid-cols-3 gap-3">
          <GlassCard className="premium-stat-tile p-3 text-center space-y-1">
            <CheckCircle2 size={18} className="text-emerald-400 mx-auto" />
            <p className="text-xl font-black text-white">{correct}</p>
            <p className="text-[10px] uppercase tracking-wider text-text-secondary">Acertos</p>
          </GlassCard>
          <GlassCard className="premium-stat-tile p-3 text-center space-y-1">
            <XCircle size={18} className="text-rose-400 mx-auto" />
            <p className="text-xl font-black text-white">{wrong}</p>
            <p className="text-[10px] uppercase tracking-wider text-text-secondary">Erros</p>
          </GlassCard>
          <GlassCard className="premium-stat-tile p-3 text-center space-y-1">
            <AlertCircle size={18} className="text-text-secondary mx-auto" />
            <p className="text-xl font-black text-white">{blank}</p>
            <p className="text-[10px] uppercase tracking-wider text-text-secondary">Em branco</p>
          </GlassCard>
        </div>

        <GlassCard className="premium-list-card p-5 space-y-3">
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
