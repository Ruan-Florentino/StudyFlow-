import { ChatSession } from '../types/chat.types';

const STORAGE_KEY = 'athena_chat_history';

export const historyStorage = {
  saveSessions: (sessions: ChatSession[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
  },

  getSessions: (): ChatSession[] => {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  },

  addMessage: (sessionId: string, message: any) => {
    const sessions = historyStorage.getSessions();
    const session = sessions.find(s => s.id === sessionId);
    if (session) {
      session.messages.push(message);
      session.lastUpdated = Date.now();
      historyStorage.saveSessions(sessions);
    }
  }
};
