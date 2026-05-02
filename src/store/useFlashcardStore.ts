import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Deck, Flashcard } from './types';

export interface FlashcardStore {
  decks: Deck[];
  flashcards: Flashcard[];
  
  dailyFlashcardsUsed: number;
  lastFlashcardResetDate: string | null;
  
  addDeck: (deck: Deck) => void;
  deleteDeck: (id: string) => void;
  addFlashcard: (card: Flashcard) => void;
  updateFlashcard: (id: string, updates: Partial<Flashcard>) => void;
  deleteFlashcard: (id: string) => void;
  reviewFlashcard: (id: string, rating: 'again' | 'hard' | 'good' | 'easy') => void;
  incrementFlashcardUsage: () => void;
}

export const useFlashcardStore = create<FlashcardStore>()(
  persist(
    (set, get) => ({
      decks: [
        { id: '1', name: 'Biologia Celular', subject: 'Biologia', cardCount: 12, newCards: 5, reviewCards: 7 },
        { id: '2', name: 'Mecânica', subject: 'Física', cardCount: 8, newCards: 2, reviewCards: 6 },
      ],
      flashcards: [],
      dailyFlashcardsUsed: 0,
      lastFlashcardResetDate: null,

      incrementFlashcardUsage: () => {
        const today = new Date().toISOString().split('T')[0];
        const { lastFlashcardResetDate, dailyFlashcardsUsed } = get();
        if (lastFlashcardResetDate !== today) {
          set({ dailyFlashcardsUsed: 1, lastFlashcardResetDate: today });
        } else {
          set({ dailyFlashcardsUsed: dailyFlashcardsUsed + 1 });
        }
      },

      addFlashcard: (card) => set((state) => ({ 
        flashcards: [{ ...card, easeFactor: 2.5, repetitions: 0 }, ...state.flashcards] 
      })),

      deleteFlashcard: (id) => set((state) => ({
        flashcards: state.flashcards.filter(f => f.id !== id)
      })),

      updateFlashcard: (id, updates) => set((state) => ({
        flashcards: state.flashcards.map(f => f.id === id ? { ...f, ...updates } : f)
      })),

      reviewFlashcard: (id, rating) => set((state) => {
        const flashcards = state.flashcards.map(f => {
          if (f.id !== id) return f;
          let { easeFactor = 2.5, repetitions = 0, interval = 0 } = f;
          
          if (rating === 'again') {
            repetitions = 0;
            interval = 1;
            easeFactor = Math.max(1.3, easeFactor - 0.2);
          } else if (rating === 'hard') {
            repetitions = Math.max(1, repetitions);
            interval = Math.max(1, interval * 1.2);
            easeFactor = Math.max(1.3, easeFactor - 0.15);
          } else if (rating === 'good') {
            repetitions += 1;
            interval = repetitions === 1 ? 1 : repetitions === 2 ? 6 : interval * easeFactor;
          } else if (rating === 'easy') {
            repetitions += 1;
            interval = repetitions === 1 ? 4 : interval * easeFactor * 1.3;
            easeFactor += 0.15;
          }

          const nextReview = new Date();
          nextReview.setDate(nextReview.getDate() + Math.round(interval));

          let level: Flashcard['level'] = 'Novo';
          if (interval > 21) level = 'Dominado';
          else if (interval > 7) level = 'Revisando';
          else if (interval > 0) level = 'Aprendendo';

          return { ...f, easeFactor, repetitions, interval: Math.round(interval), level, nextReview: nextReview.toISOString(), lastReviewed: new Date().toISOString() };
        });
        return { flashcards };
      }),

      addDeck: (deck) => set((state) => ({ decks: [deck, ...state.decks] })),
      deleteDeck: (id) => set((state) => ({
        decks: state.decks.filter(d => d.id !== id),
        flashcards: state.flashcards.filter(f => f.deckId !== id)
      })),
    }),
    { name: 'studyflow-flashcards' }
  )
);
