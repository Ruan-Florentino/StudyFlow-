import React, { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { staggerContainer, staggerItem } from '../../lib/animations/variants';
import { easings, springs } from '../../lib/animations/easings';
import { 
  Check, 
  ChevronLeft, 
  Layers, 
  Plus, 
  Trash2, 
  Sparkles, 
  Loader2 
} from 'lucide-react';
import { useStore } from '../../store';
import { 
  AnimatedButton, 
  GlassCard, 
  Header 
} from '../../components/UI';
import { Flashcard } from '../../components/Flashcard';
import { aiService } from '../../services/aiService';
import { useAppNavigation } from '../../app/router/useAppNavigation';
import { playSuccessSound, triggerConfetti } from '../../lib/studyUtils';

const FlashcardsView = () => {
  const { goBack } = useAppNavigation();
  const { decks, flashcards, addDeck, addFlashcard, reviewFlashcard } = useStore();
  const [view, setView] = useState<'list' | 'study' | 'add-deck' | 'add-card' | 'ai-generate'>('list');
  const [selectedDeckId, setSelectedDeckId] = useState<string | null>(null);
  const [currentCardIdx, setCurrentCardIdx] = useState(0);
  const [newDeckName, setNewDeckName] = useState('');
  const [newCardFront, setNewCardFront] = useState('');
  const [newCardBack, setNewCardBack] = useState('');
  const [newCardSubject, setNewCardSubject] = useState('');
  const [aiTopic, setAiTopic] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const reduceMotion = useReducedMotion() ?? false;

  const deckCards = selectedDeckId ? flashcards.filter(f => f.deckId === selectedDeckId) : [];
  const cardsToReview = deckCards.filter(f => new Date(f.nextReview) <= new Date());

  const handleDifficulty = (difficulty: 'again' | 'hard' | 'good' | 'easy') => {
    const card = cardsToReview[currentCardIdx];
    
    reviewFlashcard(card.id, difficulty);

    if (difficulty === 'good' || difficulty === 'easy') {
      playSuccessSound();
      triggerConfetti();
    }

    if (currentCardIdx < cardsToReview.length - 1) {
      setCurrentCardIdx(currentCardIdx + 1);
    } else {
      setView('list');
      setSelectedDeckId(null);
    }
  };

  if (view === 'study' && selectedDeckId) {
    const card = cardsToReview[currentCardIdx];
    const progress = ((currentCardIdx) / cardsToReview.length) * 100;

    if (!card) return (
      <div className="app-shell-premium pt-6 md:pt-8 h-screen flex flex-col items-center justify-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shadow-[0_0_30px_rgba(0,255,148,0.2)]">
          <Check size={40} />
        </div>
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold">Deck Finalizado!</h2>
          <p className="text-text-secondary">Você revisou todos os cards de hoje.</p>
        </div>
        <AnimatedButton onClick={() => setView('list')} className="px-8">Voltar ao Início</AnimatedButton>
      </div>
    );

    return (
      <div className="app-shell-premium pt-6 md:pt-8 app-stack-premium h-screen flex flex-col bg-background/50">
        <header className="flex justify-between items-center">
          <button onClick={() => setView('list')} className="p-2 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors">
            <ChevronLeft size={20} />
          </button>
          <div className="text-center">
            <p className="text-[10px] font-bold text-primary uppercase tracking-widest">Sessão de Estudo</p>
            <p className="text-sm font-black italic">STUDY<span className="text-primary">FLOW</span></p>
          </div>
          <div className="px-3 py-1 bg-white/5 rounded-xl border border-white/10 text-[10px] font-bold font-mono">
            {currentCardIdx + 1} / {cardsToReview.length}
          </div>
        </header>

        {/* Progress Bar */}
        <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={reduceMotion ? { duration: 0.2, ease: easings.smoothOut } : springs.soft}
            className="h-full bg-primary shadow-[0_0_10px_rgba(var(--hub-primary-rgb),0.5)]"
          />
        </div>

        <div className="flex-1 flex flex-col items-center justify-center overflow-hidden">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={card.id}
              className="w-full flex flex-col items-center"
              initial={{ opacity: 0, x: reduceMotion ? 0 : 60, scale: reduceMotion ? 1 : 0.96 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: reduceMotion ? 0 : -60, scale: reduceMotion ? 1 : 0.96 }}
              transition={reduceMotion ? { duration: 0.15, ease: easings.smoothOut } : springs.soft}
            >
              <Flashcard 
                front={card.front}
                back={card.back}
                subject={card.subject}
                onDifficulty={handleDifficulty}
                currentInterval={card.interval}
                easeFactor={card.easeFactor}
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    );
  }

  return (
    <div className="app-shell-premium pt-6 md:pt-8 space-y-6 pb-28">
      <div className="flex justify-between items-center relative z-10">
        <Header 
          title={view === 'list' ? 'Meus Decks' : view === 'add-deck' ? 'Novo Deck' : view === 'add-card' ? 'Novo Card' : 'Estudo'}
          icon={Layers}
          color="blue"
          onBack={() => {
            if (view === 'list') goBack();
            else setView('list');
          }}
          className="flex-1"
        />
        {view === 'list' && (
          <button onClick={() => setView('add-deck')} className="p-3 bg-primary text-black rounded-xl shadow-[0_0_15px_rgba(0,255,148,0.3)] hover:scale-105 active:scale-95 transition-all">
            <Plus size={20} strokeWidth={2} />
          </button>
        )}
      </div>

      {view === 'add-deck' && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
          <div className="p-4 bg-primary/10 border border-primary/20 rounded-2xl text-sm text-primary">
            Crie um novo conjunto de cards para organizar seus estudos por temas ou matérias.
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-text-secondary uppercase tracking-widest">Nome do Deck</label>
            <input 
              value={newDeckName}
              onChange={(e) => setNewDeckName(e.target.value)}
              placeholder="Ex: Biologia Molecular, Direito Civil..."
              className="w-full bg-card border border-border rounded-2xl p-4 outline-none focus:border-primary transition-colors"
            />
          </div>
          <AnimatedButton onClick={() => {
            if (!newDeckName.trim()) return;
            addDeck({
              id: Math.random().toString(36).substr(2, 9),
              name: newDeckName,
              subject: 'Geral',
              cardCount: 0,
              newCards: 0,
              reviewCards: 0
            });
            setNewDeckName('');
            setView('list');
          }} className="w-full py-4">
            Criar Deck
          </AnimatedButton>
        </div>
      )}

      {view === 'add-card' && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="flex-1 h-1 bg-primary rounded-full" />
            <div className="flex-1 h-1 bg-white/10 rounded-full" />
            <div className="flex-1 h-1 bg-white/10 rounded-full" />
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-text-secondary uppercase tracking-widest">Assunto/Tópico</label>
              <input 
                value={newCardSubject}
                onChange={(e) => setNewCardSubject(e.target.value)}
                placeholder="Ex: Mitocôndrias, Artigo 5º..."
                className="w-full bg-card border border-border rounded-2xl p-4 outline-none focus:border-primary transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-text-secondary uppercase tracking-widest">Frente (Pergunta)</label>
              <textarea 
                value={newCardFront}
                onChange={(e) => setNewCardFront(e.target.value)}
                placeholder="O que você quer perguntar?"
                rows={3}
                className="w-full bg-card border border-border rounded-2xl p-4 outline-none focus:border-primary transition-colors resize-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-text-secondary uppercase tracking-widest">Verso (Resposta)</label>
              <textarea 
                value={newCardBack}
                onChange={(e) => setNewCardBack(e.target.value)}
                placeholder="Qual é a resposta correta?"
                rows={3}
                className="w-full bg-card border border-border rounded-2xl p-4 outline-none focus:border-primary transition-colors resize-none"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <AnimatedButton onClick={() => setView('list')} variant="secondary" className="flex-1">Cancelar</AnimatedButton>
            <AnimatedButton onClick={() => {
              if (selectedDeckId && newCardFront.trim() && newCardBack.trim()) {
                addFlashcard({
                  id: Math.random().toString(36).substr(2, 9),
                  deckId: selectedDeckId,
                  front: newCardFront,
                  back: newCardBack,
                  subject: newCardSubject || 'Geral',
                  level: 'Novo',
                  interval: 0,
                  nextReview: new Date().toISOString()
                });
                const { trackFeature } = useStore.getState();
                trackFeature('flashcards');
                setNewCardFront('');
                setNewCardBack('');
                setNewCardSubject('');
                setView('list');
              }
            }} className="flex-1">Adicionar Card</AnimatedButton>
          </div>
        </div>
      )}

      <motion.div
        className="grid gap-4"
        variants={staggerContainer}
        initial="hidden"
        animate="show"
      >
        {decks.map(deck => {
          const cards = flashcards.filter(f => f.deckId === deck.id);
          const reviewCount = cards.filter(f => new Date(f.nextReview) <= new Date()).length;

          return (
            <motion.div key={deck.id} variants={staggerItem}>
            <GlassCard enterAnimation={false} className="space-y-4 group relative">
              <button 
                onClick={() => {
                  if (confirm(`Excluir deck "${deck.name}" e todos os seus cards?`)) {
                    useStore.getState().deleteDeck(deck.id);
                  }
                }}
                className="absolute top-4 right-4 p-2 text-red-400 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/10 rounded-lg z-10"
              >
                <Trash2 size={16} />
              </button>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-bold">{deck.name}</h3>
                  <p className="text-xs text-text-secondary">{cards.length} cards no total</p>
                </div>
                {reviewCount > 0 && (
                  <div className="px-2 py-1 bg-primary/20 text-primary text-[10px] font-bold rounded-lg border border-primary/30 mr-8">
                    {reviewCount} PARA REVISAR
                  </div>
                )}
              </div>
              
              <div className="flex gap-2">
                <AnimatedButton 
                  onClick={() => {
                    setSelectedDeckId(deck.id);
                    setCurrentCardIdx(0);
                    setView('study');
                  }} 
                  className="flex-1 py-2 text-xs"
                  disabled={reviewCount === 0}
                >
                  Estudar Agora
                </AnimatedButton>
                <AnimatedButton 
                  onClick={() => {
                    setSelectedDeckId(deck.id);
                    setView('add-card');
                  }} 
                  variant="secondary" 
                  className="flex-1 py-2 text-xs"
                >
                  + Card
                </AnimatedButton>
                <AnimatedButton 
                  onClick={() => {
                    setSelectedDeckId(deck.id);
                    setView('ai-generate');
                  }} 
                  variant="ghost" 
                  className="p-2 rounded-xl border border-primary/20 text-primary hover:bg-primary/10"
                >
                  <Sparkles size={16} />
                </AnimatedButton>
              </div>
            </GlassCard>
            </motion.div>
          );
        })}
      </motion.div>

      {view === 'ai-generate' && (
        <div className="fixed inset-0 z-[60] bg-black/90 backdrop-blur-xl flex items-center justify-center p-6">
          <motion.div 
            initial={{ opacity: 0, scale: reduceMotion ? 1 : 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={reduceMotion ? { duration: 0.15, ease: easings.smoothOut } : springs.card}
            className="w-full max-w-md space-y-6"
          >
            <div className="text-center space-y-2">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto border border-primary/20 shadow-[0_0_30px_rgba(var(--hub-primary-rgb),0.2)]">
                <Sparkles size={32} className="text-primary" />
              </div>
              <h2 className="text-2xl font-bold">Gerar Automaticamente</h2>
              <p className="text-xs text-text-secondary uppercase tracking-widest">StudyFlow Study Engine</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-text-secondary uppercase tracking-widest">Sobre qual tópico?</label>
                <input 
                  value={aiTopic}
                  onChange={(e) => setAiTopic(e.target.value)}
                  placeholder="Ex: Mitocôndrias, Revolução Francesa..."
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 outline-none focus:border-primary transition-colors"
                />
              </div>

              <div className="p-4 bg-primary/5 border border-primary/20 rounded-2xl text-[10px] text-primary leading-relaxed">
                O sistema irá analisar o tópico e gerar 5 flashcards otimizados para memorização de longo prazo.
              </div>

              <div className="flex gap-3">
                <AnimatedButton onClick={() => setView('list')} variant="secondary" className="flex-1">Cancelar</AnimatedButton>
                <AnimatedButton 
                  onClick={async () => {
                    if (!aiTopic.trim() || isGenerating) return;
                    setIsGenerating(true);
                    try {
                      const result = await aiService.generateFlashcards(aiTopic);
                      if (result && result.flashcards) {
                        result.flashcards.forEach((f: any) => {
                          addFlashcard({
                            id: Math.random().toString(36).substr(2, 9),
                            deckId: selectedDeckId!,
                            front: f.front,
                            back: f.back,
                            subject: aiTopic,
                            level: 'Novo',
                            interval: 0,
                            nextReview: new Date().toISOString()
                          });
                        });
                        setAiTopic('');
                        setView('list');
                      }
                    } catch (e) {
                      console.error(e);
                    } finally {
                      setIsGenerating(false);
                    }
                  }} 
                  className="flex-1"
                  disabled={isGenerating}
                >
                  {isGenerating ? <Loader2 className="animate-spin" /> : 'Gerar Cards'}
                </AnimatedButton>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default FlashcardsView;
