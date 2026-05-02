import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, BookOpen, Zap, Target, ArrowRight } from 'lucide-react';
import { SearchResult } from '../../hooks/useSearch';
import { GlassCard } from '../UI';

interface SearchDropdownProps {
  results: SearchResult[];
  isSearching: boolean;
  onSelect: (result: SearchResult) => void;
  isVisible: boolean;
}

const SearchDropdown: React.FC<SearchDropdownProps> = ({ results, isSearching, onSelect, isVisible }) => {
  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="absolute top-full left-0 right-0 z-50 mt-2"
      >
        <GlassCard className="p-2 max-h-[400px] overflow-y-auto shadow-2xl border-white/10" glow>
          {isSearching ? (
            <div className="p-8 text-center space-y-3">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                className="inline-block"
              >
                <Search size={20} className="text-primary" />
              </motion.div>
              <p className="text-[10px] font-premium-mono font-bold text-text-secondary uppercase tracking-widest">Buscando conhecimento...</p>
            </div>
          ) : results.length > 0 ? (
            <div className="space-y-1">
              {results.map((result) => (
                <button
                  key={result.id}
                  onClick={() => onSelect(result)}
                  className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-xl">
                      {result.icon || (
                        result.type === 'trail' ? <Zap size={18} className="text-primary" /> :
                        result.type === 'subject' ? <BookOpen size={18} className="text-primary" /> :
                        <Target size={18} className="text-primary" />
                      )}
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-bold text-white group-hover:text-primary transition-colors">{result.title}</p>
                      {result.subtitle && (
                        <p className="text-[10px] text-text-secondary font-medium truncate max-w-[200px]">{result.subtitle}</p>
                      )}
                    </div>
                  </div>
                  <ArrowRight size={14} className="text-white/20 group-hover:text-primary transition-colors" />
                </button>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center space-y-2">
              <p className="text-sm font-medium text-text-secondary">Nenhum resultado encontrado.</p>
              <p className="text-[10px] text-text-secondary/50 uppercase font-bold tracking-tighter">Tente outro termo ou matéria</p>
            </div>
          )}
        </GlassCard>
      </motion.div>
    </AnimatePresence>
  );
};

export default SearchDropdown;
