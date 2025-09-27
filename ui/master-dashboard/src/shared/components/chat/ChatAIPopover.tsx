import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/shared/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/ui/popover';
import { ScrollArea } from '@/shared/components/ui/scroll-area';
import { Input } from '@/shared/components/ui/input';
import { Separator } from '@/shared/components/ui/separator';
import { Badge } from '@/shared/components/ui/badge';
import { chatService, ChatMessage } from '@/shared/services/chatService';
import { aiService } from '@/shared/services/aiService';
import { 
  Bot, 
  Send, 
  Trash2, 
  Copy, 
  Download, 
  Settings,
  MessageCircle,
  Sparkles,
  Loader2,
  User,
  Bot as BotIcon
} from 'lucide-react';


interface ChatAIPopoverProps {
  isMobile?: boolean;
}

export function ChatAIPopover({ isMobile = false }: ChatAIPopoverProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load messages from chat service
  useEffect(() => {
    const session = chatService.getCurrentSession();
    if (session) {
      setMessages(session.messages);
    }
  }, []);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  // Focus input when popover opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage = chatService.addMessage({
      content: inputValue.trim(),
      role: 'user'
    });

    setMessages(chatService.getMessages());
    setInputValue('');
    setIsLoading(true);

    try {
      // Send to AI service
      const aiResponse = await aiService.sendMessage(userMessage.content);
      
      // Add AI response to chat
      const aiMessage = chatService.addMessage({
        content: aiResponse.content,
        role: 'assistant'
      });

      setMessages(chatService.getMessages());
    } catch (error) {
      console.error('AI service error:', error);
      // Add error message
      const errorMessage = chatService.addMessage({
        content: 'Sorry, I encountered an error. Please try again.',
        role: 'assistant'
      });
      setMessages(chatService.getMessages());
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearChat = () => {
    chatService.clearSession();
    setMessages([]);
  };

  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content);
  };

  const exportChat = () => {
    const chatText = chatService.exportChat();
    
    const blob = new Blob([chatText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chat-export-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={`rounded-xl p-2 bg-muted/50 hover:bg-muted ${
            isMobile ? 'w-10 h-10 min-w-[2.5rem] min-h-[2.5rem]' : 'w-10 h-10 min-w-[2.5rem] min-h-[2.5rem]'
          } aspect-square flex items-center justify-center relative`}
        >
          <Bot className={`${isMobile ? 'w-5 h-5' : 'w-6 h-6'} text-primary`} />
          {messages.length > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs"
            >
              {messages.length}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className={`w-96 p-0 border-0 shadow-xl bg-card/95 backdrop-blur-xl rounded-2xl animate-in fade-in-0 zoom-in-95 slide-in-from-top-2 ${
          isMobile ? 'w-[calc(100vw-2rem)] max-w-sm' : ''
        }`}
        align="end"
        sideOffset={8}
      >
        {/* Header */}
        <div className="p-4 border-b border-border/50 bg-gradient-to-r from-primary/10 to-primary/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">AI Assistant</h3>
                <p className="text-xs text-muted-foreground">Powered by I3M AI</p>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={clearChat}
                className="h-8 w-8 p-0 hover:bg-destructive/10"
                disabled={messages.length === 0}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={exportChat}
                className="h-8 w-8 p-0"
                disabled={messages.length === 0}
              >
                <Download className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Messages */}
        <ScrollArea 
          ref={scrollAreaRef}
          className="h-80 p-4"
        >
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <BotIcon className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h4 className="font-semibold text-sm">Welcome to AI Assistant</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  Ask me anything about your I3M platform
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-foreground'
                    }`}
                  >
                    <div className="flex items-start space-x-2">
                      {message.role === 'assistant' && (
                        <BotIcon className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      )}
                      <div className="flex-1">
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs opacity-70">
                            {formatTime(message.timestamp)}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyMessage(message.content)}
                            className="h-6 w-6 p-0 opacity-70 hover:opacity-100"
                          >
                            <Copy className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-muted text-foreground rounded-2xl px-4 py-3 max-w-[80%]">
                    <div className="flex items-center space-x-2">
                      <BotIcon className="w-4 h-4" />
                      <div className="flex items-center space-x-1">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span className="text-sm">AI is thinking...</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </ScrollArea>

        {/* Input */}
        <div className="p-4 border-t border-border/50">
          <div className="flex items-center space-x-2">
            <Input
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask AI anything..."
              className="flex-1"
              disabled={isLoading}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
              size="sm"
              className="px-3"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            Press Enter to send, Shift+Enter for new line
          </p>
        </div>
      </PopoverContent>
    </Popover>
  );
}
