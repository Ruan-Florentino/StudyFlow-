import { useState, useCallback, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { User } from '@supabase/supabase-js';
import { chatWithFallback } from '../services/aiService';
import { AgentKey } from '../config/aiAgents';
import { GeminiModelKey } from '../config/aiModels';
import { chatService } from '../services/chatService';

export interface ChatMessage {
  role: 'user' | 'model';
  parts: string;
  timestamp: number;
}

export function useAIChat(agentKey: AgentKey | null, sessionId?: string | null) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(sessionId || null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user));
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    setActiveSessionId(sessionId || null);
  }, [sessionId]);

  // Load history when session or agent changes
  useEffect(() => {
    if (!user) return;
    
    let isMounted = true;
    const loadHistory = async () => {
      try {
        if (activeSessionId) {
          const msgs = await chatService.getMessages(activeSessionId);
          if (isMounted) {
            setMessages(msgs.map(m => ({
              role: m.role,
              parts: m.text,
              timestamp: m.timestamp.getTime()
            })));
          }
        } else if (agentKey) {
          // If no session but agent selected, we could load latest session for that agent
          // or just start fresh. Let's start fresh for now as we might want to "New Chat" always.
          setMessages([]);
        }
      } catch (err) {
        console.error("Error loading chat history:", err);
      }
    };
    loadHistory();
    
    return () => { isMounted = false; };
  }, [agentKey, activeSessionId, user]);

  const sendMessage = useCallback(async (text: string, modelOverride?: GeminiModelKey) => {
    if (!agentKey || !user) return;
    
    setLoading(true);
    setError(null);

    let currentSessionId = activeSessionId;

    try {
      // Create session if it doesn't exist
      if (!currentSessionId) {
        currentSessionId = await chatService.createSession(agentKey, text.substring(0, 30) + '...');
        setActiveSessionId(currentSessionId);
      }

      const newMessage: ChatMessage = { role: 'user', parts: text, timestamp: Date.now() };
      const newMessages = [...messages, newMessage];
      setMessages(newMessages);

      // Save user message
      await chatService.addMessage(currentSessionId, { role: 'user', text });

      // Get AI response
      const responseText = await chatWithFallback(agentKey, text, messages);
      
      const modelMessage: ChatMessage = { role: 'model', parts: responseText, timestamp: Date.now() };
      setMessages([...newMessages, modelMessage]);
      
      // Save model message
      await chatService.addMessage(currentSessionId, { role: 'model', text: responseText });
      
    } catch (err) {
      console.error("AI Chat error:", err);
      setError("Falha ao se comunicar com o agente.");
    } finally {
      setLoading(false);
    }
  }, [agentKey, messages, user, activeSessionId]);

  const clearHistory = useCallback(async () => {
    setMessages([]);
    setActiveSessionId(null);
    // In session mode, clearing means starting a new session
  }, []);

  return {
    messages,
    loading,
    error,
    activeSessionId,
    sendMessage,
    clearHistory
  };
}
