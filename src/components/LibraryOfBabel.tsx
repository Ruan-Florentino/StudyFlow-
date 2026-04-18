import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Book, ChevronLeft, Search, Loader2, Library, Sparkles, BookOpen } from 'lucide-react';
import { GlassCard, AnimatedButton, cn } from './UI';
import { aiService } from '../services/aiService';
import Markdown from 'react-markdown';

export const LibraryOfBabel = ({ onBack }: { onBack: () => void }) => {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [book, setBook] = useState<{title: string, author: string, content: string, excerpt: string} | null>(null);

  const handleSearch = async () => {
    if (!query.trim() || isSearching) return;
    
    setIsSearching(true);
    setBook(null);

    try {
      const prompt = `
        Você é o bibliotecário da "Biblioteca de Babel", uma biblioteca infinita que contém todos os livros possíveis.
        O usuário está procurando por um livro sobre o seguinte tema ou conceito: "${query}".
        
        Crie um "livro" fictício, mas altamente detalhado e profundo sobre este tema.
        O livro deve parecer antigo, sábio e ligeiramente esotérico ou acadêmico.
        
        Retorne um JSON com a seguinte estrutura:
        {
          "title": "O título do livro (criativo e profundo)",
          "author": "O nome do autor (pode ser fictício ou histórico)",
          "excerpt": "Um pequeno trecho poético ou filosófico do livro (1-2 frases)",
          "content": "O conteúdo principal do livro, formatado em Markdown. Deve conter capítulos, teorias, e reflexões profundas sobre o tema. Seja extenso e detalhado (pelo menos 3 parágrafos longos)."
        }
      `;

      const response = await aiService.generateStudyPlan(prompt); // Using generateStudyPlan as a generic text generator
      
      try {
        const jsonStr = response.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsedBook = JSON.parse(jsonStr);
        setBook(parsedBook);
      } catch (e) {
        console.error("Failed to parse book JSON", e);
      }
    } catch (error) {
      console.error("Library error:", error);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#f4f1ea] text-[#2c241b] font-serif overflow-hidden flex flex-col">
      {/* Texture Background */}
      <div className="absolute inset-0 opacity-40 pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")' }} />
      
      <header className="relative z-10 p-6 flex items-center justify-between border-b border-[#2c241b]/10 bg-[#f4f1ea]/80 backdrop-blur-sm">
        <button onClick={onBack} className="flex items-center gap-2 text-[#2c241b]/60 hover:text-[#2c241b] transition-colors">
          <ChevronLeft size={24} />
          <span className="text-xs uppercase tracking-[0.2em] font-bold font-sans">Retornar</span>
        </button>
        <div className="text-center">
          <h1 className="text-2xl italic font-bold">A Biblioteca de Babel</h1>
          <p className="text-[10px] uppercase tracking-[0.3em] opacity-50 font-sans">O Arquivo Infinito</p>
        </div>
        <div className="w-24" /> {/* Spacer */}
      </header>

      <div className="relative z-10 flex-1 overflow-y-auto custom-scrollbar p-8">
        <div className="max-w-4xl mx-auto space-y-12">
          
          {/* Search Area */}
          <div className="text-center space-y-8">
            <Library size={48} className="mx-auto opacity-20" />
            <p className="text-lg italic opacity-80 max-w-2xl mx-auto leading-relaxed">
              "O universo (que outros chamam a Biblioteca) compõe-se de um número indefinido, e talvez infinito, de galerias hexagonais..."
            </p>
            
            <div className="max-w-xl mx-auto relative">
              <input 
                type="text" 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Busque por qualquer conceito, ideia ou segredo..."
                className="w-full bg-transparent border-b-2 border-[#2c241b]/20 py-4 text-xl italic focus:outline-none focus:border-[#2c241b] transition-colors text-center placeholder:text-[#2c241b]/30"
              />
              <button 
                onClick={handleSearch}
                disabled={!query.trim() || isSearching}
                className="absolute right-0 top-1/2 -translate-y-1/2 p-4 text-[#2c241b]/50 hover:text-[#2c241b] disabled:opacity-30 transition-colors"
              >
                {isSearching ? <Loader2 className="animate-spin" /> : <Search />}
              </button>
            </div>
          </div>

          {/* Results Area */}
          <AnimatePresence mode="wait">
            {isSearching && (
              <motion.div 
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-24 space-y-4 opacity-50"
              >
                <BookOpen size={32} className="animate-pulse" />
                <p className="text-sm uppercase tracking-widest font-sans">Buscando nos hexágonos infinitos...</p>
              </motion.div>
            )}

            {book && !isSearching && (
              <motion.div 
                key="book"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="bg-white/50 border border-[#2c241b]/10 p-12 md:p-16 rounded-sm shadow-2xl relative"
              >
                {/* Book Styling Elements */}
                <div className="absolute top-0 left-8 bottom-0 w-px bg-gradient-to-b from-transparent via-[#2c241b]/10 to-transparent" />
                <div className="absolute top-0 left-10 bottom-0 w-px bg-gradient-to-b from-transparent via-[#2c241b]/5 to-transparent" />
                
                <div className="text-center space-y-6 mb-16 relative z-10">
                  <h2 className="text-4xl md:text-5xl font-bold leading-tight">{book.title}</h2>
                  <div className="flex items-center justify-center gap-4 opacity-60">
                    <div className="h-px w-12 bg-[#2c241b]" />
                    <p className="text-lg italic">por {book.author}</p>
                    <div className="h-px w-12 bg-[#2c241b]" />
                  </div>
                </div>

                <div className="relative z-10">
                  <div className="mb-12 p-8 bg-[#2c241b]/5 border-l-4 border-[#2c241b]/20 italic text-lg leading-relaxed">
                    "{book.excerpt}"
                  </div>

                  <div className="prose prose-stone prose-lg max-w-none font-serif leading-loose">
                    <Markdown>{book.content}</Markdown>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>
    </div>
  );
};
