import React, { useRef, useEffect } from 'react';
import { ScrollArea, Avatar, AvatarFallback, AvatarImage, Badge } from '@/shared/components/ui';
import { CheckCircle, Clock, AlertCircle, File, Image } from 'lucide-react';

interface Message {
  id: number;
  content: string;
  type: 'text' | 'image' | 'file' | 'system';
  sender: {
    id: number;
    name: string;
    avatar?: string;
    role: 'customer' | 'agent' | 'system';
  };
  timestamp: string;
  status: 'sending' | 'sent' | 'delivered' | 'read';
  replyTo?: number;
  attachment?: {
    name: string;
    size: string;
    type: string;
    url: string;
  };
}

interface ChatWindowProps {
  messages: Message[];
  currentRoom?: {
    id: number;
    name: string;
    customer: {
      name: string;
      avatar: string;
      status: 'online' | 'offline' | 'away';
    };
  };
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
  messages,
  currentRoom
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'read': return <CheckCircle className="w-3 h-3 text-chart-2" />;
      case 'delivered': return <CheckCircle className="w-3 h-3 text-chart-1" />;
      case 'sent': return <Clock className="w-3 h-3 text-muted-foreground" />;
      case 'sending': return <AlertCircle className="w-3 h-3 text-chart-3" />;
      default: return null;
    }
  };

  const getAttachmentIcon = (type: string) => {
    switch (type) {
      case 'image': return <Image className="w-4 h-4" />;
      case 'file': return <File className="w-4 h-4" />;
      default: return <File className="w-4 h-4" />;
    }
  };

  if (!currentRoom) {
    return (
      <div className="flex-1 flex items-center justify-center bg-muted/30">
        <div className="text-center">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">💬</span>
          </div>
          <h3 className="text-lg font-medium mb-2">Select a conversation</h3>
          <p className="text-muted-foreground">Choose a chat from the sidebar to start messaging</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      {/* Chat Header */}
      <div className="p-4 border-b border-border bg-card">
        <div className="flex items-center space-x-3">
          <Avatar>
            <AvatarImage src={currentRoom.customer.avatar} />
            <AvatarFallback>{currentRoom.customer.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-medium">{currentRoom.name}</h3>
            <p className="text-sm text-muted-foreground">
              {currentRoom.customer.name} • 
              <span className={`ml-1 ${
                currentRoom.customer.status === 'online' ? 'text-chart-2' : 
                currentRoom.customer.status === 'away' ? 'text-chart-3' : 'text-muted-foreground'
              }`}>
                {currentRoom.customer.status}
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-start space-x-3 ${
                message.sender.role === 'agent' ? 'flex-row-reverse space-x-reverse' : ''
              }`}
            >
              <Avatar className="w-8 h-8">
                <AvatarImage src={message.sender.avatar} />
                <AvatarFallback>{message.sender.name.charAt(0)}</AvatarFallback>
              </Avatar>
              
              <div className={`flex-1 max-w-xs ${
                message.sender.role === 'agent' ? 'text-right' : ''
              }`}>
                <div className={`p-3 rounded-lg ${
                  message.sender.role === 'agent' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted'
                }`}>
                  {message.type === 'file' && message.attachment && (
                    <div className="flex items-center space-x-2 mb-2">
                      {getAttachmentIcon(message.attachment.type)}
                      <span className="text-sm">{message.attachment.name}</span>
                    </div>
                  )}
                  <p className="text-sm">{message.content}</p>
                </div>
                
                <div className={`flex items-center space-x-1 mt-1 ${
                  message.sender.role === 'agent' ? 'justify-end' : ''
                }`}>
                  <span className="text-xs text-muted-foreground">
                    {message.timestamp}
                  </span>
                  {getStatusIcon(message.status)}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div ref={messagesEndRef} />
      </ScrollArea>
    </div>
  );
};
