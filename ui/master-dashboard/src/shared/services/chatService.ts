export interface ChatMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

export interface ChatSession {
  id: string;
  messages: ChatMessage[];
  createdAt: Date;
  updatedAt: Date;
}

export interface AIResponse {
  content: string;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

class ChatService {
  private sessions: Map<string, ChatSession> = new Map();
  private currentSessionId: string | null = null;

  // Create a new chat session
  createSession(): string {
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const session: ChatSession = {
      id: sessionId,
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    this.sessions.set(sessionId, session);
    this.currentSessionId = sessionId;
    return sessionId;
  }

  // Get current session
  getCurrentSession(): ChatSession | null {
    if (!this.currentSessionId) return null;
    return this.sessions.get(this.currentSessionId) || null;
  }

  // Add message to current session
  addMessage(message: Omit<ChatMessage, 'id' | 'timestamp'>): ChatMessage {
    if (!this.currentSessionId) {
      this.createSession();
    }

    const newMessage: ChatMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      ...message
    };

    const session = this.sessions.get(this.currentSessionId!);
    if (session) {
      session.messages.push(newMessage);
      session.updatedAt = new Date();
    }

    return newMessage;
  }

  // Get all messages from current session
  getMessages(): ChatMessage[] {
    const session = this.getCurrentSession();
    return session?.messages || [];
  }

  // Clear current session
  clearSession(): void {
    if (this.currentSessionId) {
      this.sessions.delete(this.currentSessionId);
      this.currentSessionId = null;
    }
  }

  // Get all sessions
  getAllSessions(): ChatSession[] {
    return Array.from(this.sessions.values()).sort((a, b) => 
      b.updatedAt.getTime() - a.updatedAt.getTime()
    );
  }

  // Switch to a different session
  switchSession(sessionId: string): boolean {
    if (this.sessions.has(sessionId)) {
      this.currentSessionId = sessionId;
      return true;
    }
    return false;
  }

  // Delete a session
  deleteSession(sessionId: string): boolean {
    if (this.sessions.has(sessionId)) {
      this.sessions.delete(sessionId);
      if (this.currentSessionId === sessionId) {
        this.currentSessionId = null;
      }
      return true;
    }
    return false;
  }

  // Export chat history
  exportChat(sessionId?: string): string {
    const targetSessionId = sessionId || this.currentSessionId;
    if (!targetSessionId) return '';

    const session = this.sessions.get(targetSessionId);
    if (!session) return '';

    const chatText = session.messages.map(msg => 
      `${msg.role === 'user' ? 'User' : 'AI'}: ${msg.content}`
    ).join('\n\n');
    
    return chatText;
  }

  // Simulate AI response (replace with actual AI service integration)
  async sendMessageToAI(message: string): Promise<AIResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

    // Simulate different AI responses based on message content
    const responses = [
      `I understand you're asking about "${message}". This is a simulated AI response. In a real implementation, this would connect to an AI service like OpenAI, Claude, or a custom AI model.`,
      `That's an interesting question about "${message}". Let me help you with that. This is a demo response from the I3M AI Assistant.`,
      `I can help you with "${message}". Here's what I think: This is a simulated response for demonstration purposes.`,
      `Great question! Regarding "${message}", I'd suggest the following approach. This is a demo AI response.`,
      `I understand your concern about "${message}". Let me provide some insights. This is a simulated response.`
    ];

    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    
    return {
      content: randomResponse,
      usage: {
        prompt_tokens: Math.floor(message.length / 4),
        completion_tokens: Math.floor(randomResponse.length / 4),
        total_tokens: Math.floor((message.length + randomResponse.length) / 4)
      }
    };
  }

  // Real AI integration methods (to be implemented)
  async sendToOpenAI(messages: ChatMessage[]): Promise<AIResponse> {
    // TODO: Implement OpenAI API integration
    throw new Error('OpenAI integration not implemented yet');
  }

  async sendToClaude(messages: ChatMessage[]): Promise<AIResponse> {
    // TODO: Implement Claude API integration
    throw new Error('Claude integration not implemented yet');
  }

  async sendToCustomAI(messages: ChatMessage[]): Promise<AIResponse> {
    // TODO: Implement custom AI service integration
    throw new Error('Custom AI integration not implemented yet');
  }
}

// Export singleton instance
export const chatService = new ChatService();
