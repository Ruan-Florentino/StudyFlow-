import { useState, useCallback, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Message, ChatSession } from '../types/chat.types';
import { AIModel } from '../types/model.types';
import { athenaClient } from '../services/athenaClient';
import { historyStorage, ATHENA_CHAT_HISTORY_KEY } from '../services/historyStorage';
import { BASE_SYSTEM_PROMPT } from '../prompts/systemPrompts';
import { toast } from 'sonner';

function sortSessionsDesc(sessions: ChatSession[]): ChatSession[] {
  return [...sessions].sort((a, b) => b.lastUpdated - a.lastUpdated);
}

export function useAthena(initialModel: AIModel, _context: string = 'home', customSystemPrompt?: string) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string>(uuidv4());
  const [sessions, setSessions] = useState<ChatSession[]>(() =>
    sortSessionsDesc(historyStorage.getSessions())
  );

  const systemPrompt = customSystemPrompt || BASE_SYSTEM_PROMPT;

  const refreshSessions = useCallback(() => {
    setSessions(sortSessionsDesc(historyStorage.getSessions()));
  }, []);

  useEffect(() => {
    refreshSessions();
  }, [refreshSessions]);

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === ATHENA_CHAT_HISTORY_KEY) refreshSessions();
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [refreshSessions]);

  const loadSession = useCallback((id: string): ChatSession | null => {
    const found = historyStorage.getSessions().find((s) => s.id === id);
    if (!found) return null;
    setSessionId(found.id);
    setMessages(found.messages);
    return found;
  }, []);

  const deleteSession = useCallback((id: string) => {
    const next = historyStorage.getSessions().filter((s) => s.id !== id);
    historyStorage.saveSessions(next);
    setSessions(sortSessionsDesc(next));
    setSessionId((prev) => {
      if (prev !== id) return prev;
      setMessages([]);
      return uuidv4();
    });
  }, []);

  const clearChat = useCallback(() => {
    setMessages([]);
    setSessionId(uuidv4());
  }, []);

  const sendMessage = useCallback(async (content: string, model: AIModel) => {
    if (!content.trim()) return;

    const userMessage: Message = {
      id: uuidv4(),
      role: 'user',
      content,
      timestamp: Date.now()
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setLoading(true);

    let assistantMessageId = uuidv4();
    let accumulatedContent = '';

    try {
      const apiMessages = [
        { role: 'system', content: systemPrompt },
        ...newMessages.map(m => ({ role: m.role, content: m.content }))
      ];

      // Streaming implementation
      const stream = athenaClient.streamChat({
        messages: apiMessages,
        model: model.modelId
      });

      for await (const chunk of stream) {
        accumulatedContent += chunk;
        
        const assistantMessage: Message = {
          id: assistantMessageId,
          role: 'assistant',
          content: accumulatedContent,
          timestamp: Date.now()
        };

        setMessages([...newMessages, assistantMessage]);
      }
      
      // Save to history after stream completes
      const updatedMessages = [...newMessages, {
        id: assistantMessageId,
        role: 'assistant',
        content: accumulatedContent,
        timestamp: Date.now()
      } as Message];

      const currentSessions = historyStorage.getSessions();
      const existingSession = currentSessions.find(s => s.id === sessionId);
      
      if (existingSession) {
        existingSession.messages = updatedMessages;
        existingSession.lastUpdated = Date.now();
      } else {
        currentSessions.unshift({
          id: sessionId,
          title: content.substring(0, 30) + (content.length > 30 ? '...' : ''),
          messages: updatedMessages,
          modelId: model.id,
          lastUpdated: Date.now()
        });
      }
      historyStorage.saveSessions(currentSessions);
      setSessions(sortSessionsDesc(currentSessions));

    } catch (error: any) {
      console.warn('ATHENA stream handled error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erro ao falar com Athena';
      const friendlyMessage = /autentic|supabase/i.test(errorMessage)
        ? 'Nao consegui conectar a IA porque este ambiente ainda nao esta autenticado/configurado. Entre com uma sessao valida ou configure o Supabase para usar a ATHENA.'
        : `Nao consegui responder agora. ${errorMessage}`;
      setMessages([...newMessages, {
        id: assistantMessageId,
        role: 'assistant',
        content: friendlyMessage,
        timestamp: Date.now()
      }]);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [messages, sessionId, systemPrompt]);

  return {
    messages,
    loading,
    sessions,
    sendMessage,
    clearChat,
    loadSession,
    deleteSession,
    refreshSessions,
    setMessages,
    setSessionId,
  };
}
