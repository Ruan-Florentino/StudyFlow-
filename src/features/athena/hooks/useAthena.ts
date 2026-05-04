import { useState, useCallback, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Message, ChatSession } from '../types/chat.types';
import { AIModel } from '../types/model.types';
import { athenaClient } from '../services/athenaClient';
import { historyStorage } from '../services/historyStorage';
import { BASE_SYSTEM_PROMPT } from '../prompts/systemPrompts';
import { toast } from 'sonner';

export function useAthena(initialModel: AIModel, context: string = 'home', customSystemPrompt?: string) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string>(uuidv4());
  
  const systemPrompt = customSystemPrompt || BASE_SYSTEM_PROMPT;

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

    } catch (error: any) {
      console.error('💥 [ATHENA] Erro no Stream:', error);
      toast.error(error.message || 'Erro ao falar com Athena');
    } finally {
      setLoading(false);
    }
  }, [messages, sessionId, systemPrompt]);

  const clearChat = () => {
    setMessages([]);
    setSessionId(uuidv4());
  };

  return {
    messages,
    loading,
    sendMessage,
    clearChat,
    setMessages,
    setSessionId
  };
}
