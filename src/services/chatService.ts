import { localBackend } from '../lib/localBackend';

export interface ChatMessage {
  id?: string;
  role: 'user' | 'model' | 'assistant';
  text: string;
  timestamp: Date;
  engine?: string;
}

export interface ChatSession {
  id: string;
  topic: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  lastMessage: string;
}

export const chatService = {
  async createSession(topic: string, title: string): Promise<string> {
    const { data: { user } } = await localBackend.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await localBackend
      .from('chat_sessions')
      .insert({
        user_id: user.id,
        agent_id: topic, // Mantendo coluna agent_id no banco por ora para evitar migrations
        title,
        last_message: ''
      })
      .select()
      .single();

    if (error) {
      console.error('backend Error:', error);
      throw error;
    }
    return data.id;
  },

  async getSessions(topic?: string): Promise<ChatSession[]> {
    const { data: { user } } = await localBackend.auth.getUser();
    if (!user) return [];

    let query = localBackend
      .from('chat_sessions')
      .select('*')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false });

    if (topic) {
      query = query.eq('agent_id', topic);
    }
    
    const { data, error } = await query;
    if (error) {
      console.error('backend Error:', error);
      return [];
    }

    return data.map(item => ({
      id: item.id,
      topic: item.agent_id,
      title: item.title,
      createdAt: new Date(item.created_at),
      updatedAt: new Date(item.updated_at),
      lastMessage: item.last_message
    }));
  },

  async addMessage(sessionId: string, message: Omit<ChatMessage, 'id' | 'timestamp'>): Promise<void> {
    const { data: { user } } = await localBackend.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    // Add message
    const { error: msgError } = await localBackend
      .from('messages')
      .insert({
        session_id: sessionId,
        user_id: user.id,
        role: message.role,
        text: message.text,
        engine: message.engine
      });

    if (msgError) {
      console.error('backend error adding message:', msgError);
      throw msgError;
    }

    // Update session last message and timestamp
    const { error: sessionError } = await localBackend
      .from('chat_sessions')
      .update({
        last_message: message.text.substring(0, 100),
        updated_at: new Date().toISOString()
      })
      .eq('id', sessionId);

    if (sessionError) {
      console.error('backend error updating session:', sessionError);
    }
  },

  async getMessages(sessionId: string): Promise<ChatMessage[]> {
    const { data, error } = await localBackend
      .from('messages')
      .select('*')
      .eq('session_id', sessionId)
      .order('timestamp', { ascending: true });

    if (error) {
      console.error('backend Error:', error);
      return [];
    }

    return data.map(item => ({
      id: item.id,
      role: item.role,
      text: item.text,
      timestamp: new Date(item.timestamp),
      engine: item.engine
    }));
  }
};
