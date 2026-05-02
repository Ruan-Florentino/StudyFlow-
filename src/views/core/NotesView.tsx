// React
import { useState } from 'react';

// External libs
import Markdown from 'react-markdown';

// Lucide icons
import { RotateCcw, Download, Loader2, Volume2, Radio, Zap, StickyNote, ChevronRight, Calendar } from 'lucide-react';

// Stores
import { useStore, type Note } from '../../store';

// Services
import { aiService } from '../../services/aiService';

// Utils
import { safePlayAudio, exportToPDF } from '../../lib/studyUtils';

// UI Components
import { GlassCard, AnimatedButton, Header } from '../../components/UI';
import { useAppNavigation } from '../../app/router/useAppNavigation';

const NotesView = () => {
  const { notes, addFlashcard, addDeck, decks } = useStore();
  const { goBack } = useAppNavigation();
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [generatingFlashcards, setGeneratingFlashcards] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);
  const [isLoadingPodcast, setIsLoadingPodcast] = useState(false);

  const generatePodcast = async (note: Note) => {
    if (isLoadingPodcast) return;
    setIsLoadingPodcast(true);
    try {
      const script = await aiService.generatePodcastScript(note.content, note.title);
      const audioData = await aiService.generateAudio(script);
      if (audioData) {
        await safePlayAudio(`data:audio/mp3;base64,${audioData}`);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoadingPodcast(false);
    }
  };

  const playAudio = async (text: string) => {
    if (isPlaying || isLoadingAudio) return;
    
    try {
      setIsLoadingAudio(true);
      const audioData = await aiService.generateAudio(text);
      if (audioData) {
        const audio = new Audio(`data:audio/mp3;base64,${audioData}`);
        audio.onplay = () => setIsPlaying(true);
        audio.onended = () => setIsPlaying(false);
        audio.onerror = () => setIsPlaying(false);
        await safePlayAudio(audio);
      }
    } catch (error) {
      console.error("Error playing audio:", error);
      setIsPlaying(false);
    } finally {
      setIsLoadingAudio(false);
    }
  };

  const handleGenerateFlashcards = async (note: Note) => {
    setGeneratingFlashcards(true);
    try {
      // Use AI to generate flashcards from note content
      const prompt = `Com base no seguinte resumo de estudo, gere 5 flashcards (pergunta e resposta curta) para o sistema Anki.
      Resumo: ${note.content}
      Retorne APENAS um JSON no formato: [{"front": "pergunta", "back": "resposta"}]`;
      
      const res = await aiService.chat(prompt, []);
      const jsonStr = res.match(/\[.*\]/s)?.[0];
      if (jsonStr) {
        const cards = JSON.parse(jsonStr);
        
        // Find or create a deck for these cards
        let deckId = decks.find(d => d.name === note.title)?.id;
        if (!deckId) {
          deckId = Math.random().toString(36).substr(2, 9);
          addDeck({ 
            id: deckId, 
            name: note.title, 
            subject: note.title,
            cardCount: 0,
            newCards: 0,
            reviewCards: 0
          });
        }

        cards.forEach((c: any) => {
          addFlashcard({
            id: Math.random().toString(36).substr(2, 9),
            deckId: deckId!,
            front: c.front,
            back: c.back,
            level: 'Novo',
            interval: 0,
            nextReview: new Date().toISOString(),
            subject: note.title
          });
        });
        alert(`${cards.length} flashcards gerados com sucesso no deck "${note.title}"!`);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setGeneratingFlashcards(false);
    }
  };

  if (selectedNote) {
    return (
      <div className="p-6 space-y-8 pb-32 animate-in slide-in-from-right duration-300">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => setSelectedNote(null)} className="p-2 bg-white/5 rounded-xl border border-white/10">
              <RotateCcw size={20} />
            </button>
            <h2 className="text-2xl font-premium-title italic uppercase">{selectedNote.title}</h2>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => exportToPDF('note-content', `Resumo_${selectedNote.title.replace(/\s+/g, '_')}`)}
              className="p-2 bg-white/5 rounded-xl border border-white/10 text-text-secondary hover:text-primary transition-colors"
              title="Exportar para PDF"
            >
              <Download size={20} />
            </button>
            <button 
              onClick={() => playAudio(selectedNote.content)}
              className="p-2 bg-white/5 rounded-xl border border-white/10 text-text-secondary hover:text-primary transition-colors"
              disabled={isLoadingAudio || isPlaying}
              title="Ouvir Resumo"
            >
              {isLoadingAudio ? <Loader2 size={20} className="animate-spin" /> : <Volume2 size={20} className={isPlaying ? "text-primary" : ""} />}
            </button>
            <button 
              onClick={() => generatePodcast(selectedNote)}
              className="p-2 bg-white/5 rounded-xl border border-white/10 text-text-secondary hover:text-primary transition-colors"
              disabled={isLoadingPodcast}
              title="Gerar Podcast IA"
            >
              {isLoadingPodcast ? <Loader2 size={20} className="animate-spin" /> : <Radio size={20} />}
            </button>
          </div>
        </header>

        <GlassCard id="note-content" className="p-6 space-y-6 bg-black/40 border-white/10">
          <div className="prose prose-invert max-w-none">
            <Markdown>{selectedNote.content}</Markdown>
          </div>
          
          <div className="pt-6 border-t border-white/10 flex gap-4">
            <AnimatedButton 
              onClick={() => handleGenerateFlashcards(selectedNote)}
              disabled={generatingFlashcards}
              className="flex-1 bg-primary text-black border-primary"
            >
              {generatingFlashcards ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  <span>Gerando...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Zap size={18} fill="currentColor" />
                  <span>Gerar Flashcards IA</span>
                </div>
              )}
            </AnimatedButton>
          </div>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8 pb-32 animate-in fade-in duration-500">
      <header className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
            <StickyNote size={20} />
          </div>
          <h2 className="text-2xl font-premium-title italic uppercase">Caderno de Notas</h2>
        </div>
      </header>

      {notes.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
          <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center text-white/20 border border-white/10">
            <StickyNote size={40} />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold">Nenhuma nota ainda</h3>
            <p className="text-sm text-text-secondary max-w-[250px]">Suas notas geradas por IA e resumos aparecerão aqui.</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {notes.map((note) => (
            <GlassCard 
              key={note.id} 
              onClick={() => setSelectedNote(note)}
              className="p-5 border-white/5 hover:border-primary/30 transition-all group cursor-pointer"
            >
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <h3 className="font-bold text-lg group-hover:text-primary transition-colors">{note.title}</h3>
                  <p className="text-xs text-text-secondary line-clamp-2 opacity-70">{note.content}</p>
                </div>
                <div className="p-2 bg-white/5 rounded-lg text-text-secondary">
                  <ChevronRight size={18} />
                </div>
              </div>
              <div className="mt-4 flex items-center gap-3 text-[10px] font-premium-mono font-bold text-text-secondary uppercase tracking-widest">
                <div className="flex items-center gap-1">
                  <Calendar size={12} />
                  <span>{new Date(note.updatedAt).toLocaleDateString('pt-BR')}</span>
                </div>
                <div className="w-1 h-1 rounded-full bg-white/20" />
                <div className="text-primary/60">IA GENERATED</div>
              </div>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotesView;
