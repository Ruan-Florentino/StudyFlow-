import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ensureNoteUuid } from '../lib/ensureNoteUuid';
import { syncNoteToSupabase } from '../lib/supabase/syncNoteToSupabase';
import { toast } from './useToastStore';
import type { StudySession, StudyRoutine, Message, Note, MindMap, Essay } from './types';

export interface SessionStore {
  sessions: StudySession[];
  routine: StudyRoutine | null;
  chatHistory: Message[];
  studyRooms: {
    activeRoom: string | null;
    rooms: Array<{ id: string; name: string; vibe: string; users: number; icon: string; youtubeId?: string }>;
    globalPulse: number;
    audioVolume: number;
    audioPlaying: boolean;
  };
  
  // Method Tools
  notes: Note[];
  mindMaps: MindMap[];
  essays: Essay[];
  memoryRooms: any[];
  neuralSync: number;
  savedTopics: string[];
  essayCoPilot: {
    enabled: boolean;
    suggestions: any[];
  };

  // Focus Tools
  isAppBlockerActive: boolean;

  // Actions
  addSession: (session: StudySession) => void;
  setRoutine: (routine: StudyRoutine) => void;
  addChatMessage: (msg: Message) => void;
  joinRoom: (roomId: string | null) => void;
  updateGlobalPulse: () => void;
  setAudioVolume: (volume: number) => void;
  setAudioPlaying: (playing: boolean) => void;
  
  addNote: (note: Note) => void;
  addMindMap: (map: MindMap) => void;
  addEssay: (essay: Essay) => void;
  toggleSavedTopic: (topicId: string) => void;
  toggleEssayCoPilot: () => void;
  addEssaySuggestion: (suggestion: any) => void;
  clearEssaySuggestions: () => void;
  addMemoryRoom: (room: any) => void;
  addMemoryItem: (roomId: string, item: any) => void;
  updateNeuralSync: (val: number) => void;
  toggleAppBlocker: (val?: boolean) => void;
}

export const useSessionStore = create<SessionStore>()(
  persist(
    (set, get) => ({
      // ...
      sessions: [],
      routine: null,
      chatHistory: [],
      studyRooms: {
        activeRoom: null,
        rooms: [
          { id: 'library', name: 'Biblioteca Central', vibe: 'Lofi & Chuva', users: 1242, icon: 'Library', youtubeId: '5qap5aO4i9A' },
          { id: 'cafe', name: 'Cyberpunk Café', vibe: 'Synthwave & Neon', users: 856, icon: 'Coffee', youtubeId: 'W1B5Z9A2bEQ' },
          { id: 'forest', name: 'Cabana na Floresta', vibe: 'Natureza & Calma', users: 432, icon: 'Trees', youtubeId: 'xNN7iTA57jM' },
        ],
        globalPulse: 2745,
        audioVolume: 50,
        audioPlaying: false
      },
      notes: [],
      mindMaps: [],
      essays: [],
      memoryRooms: [],
      neuralSync: 0,
      savedTopics: [],
      essayCoPilot: {
        enabled: false,
        suggestions: []
      },
      isAppBlockerActive: false,

      addSession: (session) => set((state) => ({ sessions: [session, ...state.sessions] })),
      setRoutine: (routine) => set({ routine }),
      addChatMessage: (msg) => set((state) => ({ chatHistory: [...state.chatHistory, msg] })),
      joinRoom: (roomId) => set((state) => ({
        studyRooms: { ...state.studyRooms, activeRoom: roomId, audioPlaying: !!roomId }
      })),
      updateGlobalPulse: () => set(state => ({ 
        studyRooms: { ...state.studyRooms, globalPulse: state.studyRooms.globalPulse + Math.floor(Math.random() * 5) } 
      })),
      setAudioVolume: (volume) => set((state) => ({
        studyRooms: { ...state.studyRooms, audioVolume: volume }
      })),
      setAudioPlaying: (playing) => set((state) => ({
        studyRooms: { ...state.studyRooms, audioPlaying: playing }
      })),
      
      addNote: (note) => {
        const id = ensureNoteUuid(note.id);
        const updatedAt = note.updatedAt || new Date().toISOString();
        const normalized: Note = { ...note, id, updatedAt };
        set((state) => ({
          notes: [normalized, ...state.notes.filter((n) => n.id !== id)],
        }));
        void syncNoteToSupabase(normalized).catch(() => {
          toast.error(
            'Notas',
            'Não foi possível salvar na nuvem. Verifique a conexão; a nota permanece neste aparelho.'
          );
        });
      },
      addMindMap: (map) => set((state) => ({ mindMaps: [map, ...state.mindMaps] })),
      addEssay: (essay) => set((state) => ({ essays: [essay, ...state.essays] })),
      toggleSavedTopic: (id) => set(state => ({
        savedTopics: state.savedTopics.includes(id) ? state.savedTopics.filter(t => t !== id) : [...state.savedTopics, id]
      })),
      toggleEssayCoPilot: () => set(state => ({
        essayCoPilot: { ...state.essayCoPilot, enabled: !state.essayCoPilot.enabled }
      })),
      addEssaySuggestion: (s) => set(state => ({
        essayCoPilot: { ...state.essayCoPilot, suggestions: [...state.essayCoPilot.suggestions, s] }
      })),
      clearEssaySuggestions: () => set(state => ({
        essayCoPilot: { ...state.essayCoPilot, suggestions: [] }
      })),
      addMemoryRoom: (room) => set(state => ({ memoryRooms: [...state.memoryRooms, room] })),
      addMemoryItem: (roomId, item) => set(state => ({
        memoryRooms: state.memoryRooms.map(r => r.id === roomId ? { ...r, items: [...r.items, item] } : r)
      })),
      updateNeuralSync: (val) => set({ neuralSync: val }),
      toggleAppBlocker: (val) => set(state => ({ isAppBlockerActive: val ?? !state.isAppBlockerActive })),
    }),
    { name: 'studyflow-sessions' }
  )
);
