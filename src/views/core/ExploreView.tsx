import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, BookOpen, Sparkles, ChevronRight, Target, Zap, Clock, Star } from 'lucide-react';
import { GlassCard, AnimatedButton, Badge } from '../../components/UI';
import { SUBJECTS, WEEK_HIGHLIGHT, TRAILS, POPULAR_NOW } from '../../data/explore';
import { useStore } from '../../store';
import { useSearch, SearchResult } from '../../hooks/useSearch';
import { ALL_TOPICS, SUBJECT_ICONS } from '../../data/topics';
import SearchDropdown from '../../components/Explore/SearchDropdown';
import SortResult from '../../components/Explore/SortResult';
import { useAppNavigation } from '../../app/router/useAppNavigation';



const ExploreView: React.FC = () => {
  const { goTo } = useAppNavigation();
  const { setNavFilters } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [isSorting, setIsSorting] = useState(false);
  const [sortResult, setSortResult] = useState<any>(null);

  const { results: searchResults, isSearching } = useSearch(searchQuery);

  const handleSort = useCallback(() => {
    setIsSorting(true);
    setSortResult(null);
    
    // Shuffle logic
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * ALL_TOPICS.length);
      const selected = ALL_TOPICS[randomIndex];
      
      setSortResult({
        subject: selected.subject,
        topic: selected.topic,
        questions: Math.floor(Math.random() * 50) + 20,
        icon: SUBJECT_ICONS[selected.subject] || '📖'
      });
      setIsSorting(false);
    }, 2000);
  }, []);

  const handleSearchResultSelect = (result: SearchResult) => {
    setSearchQuery('');
    setShowSearchDropdown(false);

    if (result.type === 'subject') {
      setNavFilters({ subject: result.title });
      goTo('/questoes');
    } else if (result.type === 'trail') {
      // Simulate going to trail detail
      goTo('/foco'); // For now, since we don't have a dedicated /trail/:id
    } else if (result.type === 'question') {
      setNavFilters({ subject: result.data.materia, topic: result.data.assunto, search: result.data.pergunta });
      goTo('/questoes');
    }
  };

  const handleStartSorted = () => {
    if (sortResult) {
      setNavFilters({ 
        subject: sortResult.subject, 
        topic: sortResult.topic 
      });
      goTo('/questoes');
    }
  };

  const handleAreaClick = (subject: string) => {
    setNavFilters({ subject });
    goTo('/questoes');
  };

  const handlePopularClick = (item: any) => {
    if (item.type === 'simulado') {
      setNavFilters({ subject: item.subject });
      goTo('/exames');
    } else if (item.type === 'questoes') {
      goTo('/redacao');
    } else if (item.type === 'revisao') {
      setNavFilters({ subject: item.subject, difficulty: 'Hard' });
      goTo('/questoes');
    }
  };

  return (
    <div className="p-6 space-y-8 pb-32 animate-in fade-in duration-700">
      {/* Header */}
      <header className="space-y-1">
        <div className="flex items-center gap-2">
          <BookOpen size={16} className="text-primary animate-pulse" />
          <span className="text-[10px] font-premium-mono font-bold text-primary uppercase tracking-[0.3em]">Modo Descoberta</span>
        </div>
        <h1 className="text-3xl font-premium-title italic leading-tight">Explorar</h1>
        <p className="text-xs text-text-secondary font-medium opacity-70">O que vamos estudar hoje?</p>
      </header>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary" size={20} />
        <input 
          type="text"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setShowSearchDropdown(true);
          }}
          onFocus={() => setShowSearchDropdown(true)}
          placeholder="Buscar matéria, tema ou questão..."
          className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-primary/50 transition-all placeholder:text-white/20"
        />
        <SearchDropdown 
          results={searchResults} 
          isSearching={isSearching} 
          isVisible={showSearchDropdown && searchQuery.length > 0} 
          onSelect={handleSearchResultSelect}
        />
      </div>

      {/* Hero Card: Sortear Matéria Surpresa */}
      <GlassCard 
        className="relative overflow-hidden group p-8 border-primary/20 bg-primary/5"
        glow
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[80px] rounded-full -mr-32 -mt-32 transition-all group-hover:bg-primary/20" />
        
        <AnimatePresence mode="wait">
          {!sortResult ? (
            <motion.div 
              key="initial"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative z-10 space-y-6"
            >
              <div className="space-y-2">
                <h2 className="text-2xl font-premium-title italic">Sortear Matéria Surpresa</h2>
                <p className="text-sm text-text-secondary max-w-[200px]">Deixe a IA escolher seu próximo desafio épico de estudo.</p>
              </div>
              <AnimatedButton 
                onClick={handleSort}
                disabled={isSorting}
                className="w-full py-4 text-black font-bold uppercase tracking-widest gap-2" 
                glow
              >
                {isSorting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                    Sorteando...
                  </div>
                ) : (
                  <>
                    <Sparkles size={18} fill="currentColor" />
                    Sortear Agora
                  </>
                )}
              </AnimatedButton>
            </motion.div>
          ) : (
            <motion.div 
              key="result"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, y: -10 }}
              className="relative z-10 flex flex-col items-center text-center space-y-4 py-4"
            >
              <SortResult 
                result={sortResult} 
                onStart={handleStartSorted} 
                onRetry={handleSort} 
              />
            </motion.div>
          )}
        </AnimatePresence>
      </GlassCard>

      {/* Destaque da Semana Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-[10px] font-premium-mono font-bold text-text-secondary uppercase tracking-[0.3em]">Destaque da Semana</h3>
          <div className="h-px flex-1 bg-white/5 ml-4" />
        </div>

        <GlassCard 
          onClick={() => {
            setNavFilters({ subject: WEEK_HIGHLIGHT.subject, topic: WEEK_HIGHLIGHT.topic });
            goTo('/questoes');
          }}
          className="group overflow-hidden border-white/5 hover:border-primary/30 transition-all p-0 cursor-pointer"
        >
          <div className="relative aspect-[16/9] overflow-hidden">
            <img 
              src={WEEK_HIGHLIGHT.image} 
              alt={WEEK_HIGHLIGHT.topic} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 p-6 space-y-1">
              <Badge variant="primary" className="mb-2 uppercase tracking-widest bg-emerald-500/20 text-emerald-500 border-emerald-500/30">
                {WEEK_HIGHLIGHT.exam}
              </Badge>
              <h4 className="text-xl font-premium-title italic text-white">{WEEK_HIGHLIGHT.subject}</h4>
              <p className="text-sm font-bold text-white/70">{WEEK_HIGHLIGHT.topic}</p>
              <div className="flex items-center gap-2 pt-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-bold text-white/50 uppercase tracking-widest">{WEEK_HIGHLIGHT.studying} estudando agora</span>
              </div>
            </div>
            <button className="absolute bottom-6 right-6 w-12 h-12 rounded-full bg-primary text-black flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
              <ChevronRight size={24} />
            </button>
          </div>
        </GlassCard>
      </section>

      {/* Áreas de Conhecimento */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-[10px] font-premium-mono font-bold text-text-secondary uppercase tracking-[0.3em]">Áreas de Conhecimento</h3>
          <div className="h-px flex-1 bg-white/5 ml-4" />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          {SUBJECTS.map((sub) => (
            <GlassCard 
              key={sub.id} 
              onClick={() => handleAreaClick(sub.name)}
              className="p-5 flex flex-col items-center text-center space-y-3 group cursor-pointer hover:border-primary/30 transition-all"
            >
              <div className="text-3xl transition-transform group-hover:scale-110 duration-300">{sub.icon}</div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-white uppercase tracking-tight">{sub.name}</p>
                <p className="text-[9px] font-bold text-white/30 uppercase tracking-widest">{sub.questions} QUESTÕES</p>
              </div>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* Trilhas Recomendadas */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-[10px] font-premium-mono font-bold text-text-secondary uppercase tracking-[0.3em]">Trilhas Recomendadas</h3>
          <div className="h-px flex-1 bg-white/5 ml-4" />
        </div>
        <div className="space-y-3">
          {TRAILS.map(trail => (
            <button 
              key={trail.id} 
              onClick={() => {
                setNavFilters({ subject: trail.subject });
                goTo('/foco');
              }}
              className="w-full group flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 hover:border-primary/20 transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <Zap size={18} />
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold text-white/90">{trail.name}</p>
                  <p className="text-[10px] text-white/40 uppercase font-bold tracking-widest">Acessar trilha completa</p>
                </div>
              </div>
              <ChevronRight size={16} className="text-white/20 group-hover:text-primary transition-colors" />
            </button>
          ))}
        </div>
      </section>

      {/* Populares Agora */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-[10px] font-premium-mono font-bold text-text-secondary uppercase tracking-[0.3em]">Populares Agora</h3>
          <div className="h-px flex-1 bg-white/5 ml-4" />
        </div>
        <div className="flex flex-wrap gap-2">
          {POPULAR_NOW.map(item => (
            <Badge 
              key={item.id} 
              variant="secondary" 
              onClick={() => handlePopularClick(item)}
              className="px-4 py-2 bg-white/5 border-white/10 hover:bg-white/10 transition-colors cursor-pointer"
            >
              {item.type === 'simulado' && <Target size={12} className="inline mr-2 text-primary" />}
              {item.type === 'questoes' && <Clock size={12} className="inline mr-2 text-primary" />}
              {item.type === 'revisao' && <Zap size={12} className="inline mr-2 text-primary" />}
              {item.name}
            </Badge>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ExploreView;

