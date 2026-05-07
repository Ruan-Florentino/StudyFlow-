import { ChatSession } from '../types/chat.types';

export const ATHENA_CHAT_HISTORY_KEY = 'athena_chat_history';

export const historyStorage = {
  saveSessions: (sessions: ChatSession[]) => {
    localStorage.setItem(ATHENA_CHAT_HISTORY_KEY, JSON.stringify(sessions));
  },

  getSessions: (): ChatSession[] => {
    const data = localStorage.getItem(ATHENA_CHAT_HISTORY_KEY);
    if (!data) return [];
    try {
      const parsed = JSON.parse(data) as ChatSession[];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
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
