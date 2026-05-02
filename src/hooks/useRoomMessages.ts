import { useState, useEffect } from 'react';
import { auth } from '../lib/firebase';
import { DUMMY_NAMES } from './useRoomUsers'; // I need to export this or recreate it

const MESSAGES_TEMPLATES = [
  "Bom dia! Bora focar 🔥",
  "Tô fazendo simulado de exatas, alguém junto?",
  "Alguém tem resumo de história?",
  "25 minutinhos de foco total agora",
  "Finalmente entendi essa matéria 🧠",
  "Pausa pra água 💧",
  "Essa playlist tá muito boa",
  "Bora bater a meta de hoje!",
  "Falta pouco pra terminar o cronograma",
  "Alguém também no pomodoro de 50min?"
];

export function useRoomMessages(roomId: string) {
  const [messages, setMessages] = useState<any[]>([]);

  useEffect(() => {
    if (!roomId) return;

    const mockMessages = Array.from({ length: 8 }).map((_, i) => ({
      id: `msg_${i}`,
      userId: `user_mock_${i}`,
      userName: `Estudante ${i+1}`,
      userAvatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${roomId}_${i}`,
      text: MESSAGES_TEMPLATES[Math.floor(Math.random() * MESSAGES_TEMPLATES.length)],
      timestamp: Date.now() - (8 - i) * 1000 * 60,
      type: 'text'
    }));
    
    mockMessages.unshift({
      id: 'msg_sys_1',
      userId: 'system',
      userName: 'Sistema',
      userAvatar: '',
      text: 'Você entrou na sala',
      timestamp: Date.now() - 10 * 1000 * 60,
      type: 'system'
    });

    setMessages(mockMessages);
  }, [roomId]);

  const sendMessage = (text: string, type: 'text' | 'reaction' = 'text') => {
    if (!auth.currentUser) return;
    setMessages(prev => [...prev, {
      id: `msg_new_${Date.now()}`,
      userId: auth.currentUser!.uid,
      userName: auth.currentUser!.displayName || 'Você',
      userAvatar: auth.currentUser!.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${auth.currentUser!.uid}`,
      text,
      timestamp: Date.now(),
      type
    }]);
  };

  return { messages, sendMessage };
}
