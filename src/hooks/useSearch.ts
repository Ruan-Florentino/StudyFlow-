import { useState, useEffect } from 'react';
import { loadAllQuestionsWithImported } from '../lib/mergeImportedQuestions';
import { useImportedQuestionsStore } from '../store/useImportedQuestionsStore';
import { useAITrailsStore } from '../store/useAITrailsStore';
import { SUBJECTS, RECOMMENDED_TRAILS, POPULAR_NOW } from '../data/explore';

export interface SearchResult {
  id: string;
  type: 'subject' | 'trail' | 'popular' | 'question';
  title: string;
  subtitle?: string;
  icon?: string;
  data?: any;
}

export function useSearch(query: string) {
  const importedQuestions = useImportedQuestionsStore((s) => s.importedQuestions);
  const aiTrails = useAITrailsStore((s) => s.aiTrails);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    let mounted = true;
    
    if (!query.trim()) {
      setResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const timeoutId = setTimeout(async () => {
      const q = query.toLowerCase();

      const searchResults: SearchResult[] = [];

      // Subjects
      SUBJECTS.forEach(s => {
        if (s.name.toLowerCase().includes(q)) {
          searchResults.push({
            id: `sub-${s.id}`,
            type: 'subject',
            title: s.name,
            subtitle: `${s.questions} Questões`,
            icon: s.icon,
            data: s
          });
        }
      });

      // Trilhas recomendadas
      const allTrails = [...RECOMMENDED_TRAILS, ...aiTrails];
      allTrails.forEach((t) => {
        const hay = `${t.title} ${t.description} ${t.topics.join(' ')}`.toLowerCase();
        if (hay.includes(q)) {
          const isAi = t.id.startsWith('ai_trail_');
          searchResults.push({
            id: `trail-${t.id}`,
            type: 'trail',
            title: t.title,
            subtitle: isAi ? 'Trilha IA' : 'Trilha recomendada',
            data: t,
          });
        }
      });

      // Questions (Limit to top results)
      const ALL_QUESTIONS = await loadAllQuestionsWithImported();
      if (!mounted) return;
      
      const matchedQuestions = ALL_QUESTIONS.filter(quest => 
        quest.pergunta.toLowerCase().includes(q) || 
        quest.assunto.toLowerCase().includes(q)
      ).slice(0, 5);

      matchedQuestions.forEach(quest => {
        searchResults.push({
          id: `quest-${quest.id}`,
          type: 'question',
          title: quest.assunto,
          subtitle: quest.pergunta.length > 60 ? quest.pergunta.substring(0, 60) + '...' : quest.pergunta,
          data: quest
        });
      });

      if (mounted) {
        setResults(searchResults);
        setIsSearching(false);
      }
    }, 500);

    return () => {
      mounted = false;
      clearTimeout(timeoutId);
    };
  }, [query, importedQuestions, aiTrails]);

  return { results, isSearching };
}
