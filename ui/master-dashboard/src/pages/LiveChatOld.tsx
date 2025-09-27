import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Button, Badge, Input, Textarea, ScrollArea, Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui';
import { mockChatRooms, mockMessages, mockOnlineAgents } from '../../mock-data/livechat';
import { 
  MessageSquare, 
  Send, 
  Paperclip, 
  Smile,
  Phone,
  Video,
  MoreHorizontal,
  Search,
  Filter,
  Settings,
  Users,
  Clock,
  CheckCircle,
  Check,
  AlertCircle,
  Mic,
  Image,
  File,
  X,
  Maximize2,
  Minimize2,
  Volume2,
  VolumeX
} from 'lucide-react';

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

interface ChatRoom {
  id: number;
  name: string;
  type: 'support' | 'sales' | 'technical' | 'general';
  customer: {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    company: string;
    status: 'online' | 'offline' | 'away';
  };
  agent?: {
    id: number;
    name: string;
    avatar?: string;
    status: 'online' | 'offline' | 'away';
  };
  lastMessage?: Message;
  unreadCount: number;
  status: 'active' | 'waiting' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export function LiveChat() {
  const [selectedRoom, setSelectedRoom] = useState<number | null>(1);
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const chatRooms: ChatRoom[] = mockChatRooms;

  const messages: Message[] = mockMessages;

  const onlineAgents = mockOnlineAgents;

  const currentRoom = chatRooms.find(room => room.id === selectedRoom);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (message.trim()) {
      // Here you would typically send the message to your backend
      console.log('Sending message:', message);
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'away': return 'bg-yellow-500';
      case 'offline': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="w-full px-4 lg:px-6 py-4 lg:py-6">
    <div className={`flex h-screen bg-background ${isExpanded ? 'fixed inset-0 z-50' : 'h-[800px]'}`}>
      {/* Chat Rooms Sidebar */}
      <div className="w-80 bg-card border-r border-border flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold flex items-center">
              <MessageSquare className="w-5 h-5 mr-2" />
              Live Chat
            </h2>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" onClick={() => setSoundEnabled(!soundEnabled)}>
                {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setIsExpanded(!isExpanded)}>
                {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </Button>
            </div>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Chat Rooms List */}
        <ScrollArea className="flex-1">
          <div className="p-2">
            {chatRooms.map((room) => (
              <div
                key={room.id}
                className={`p-3 rounded-lg cursor-pointer transition-colors mb-2 ${
                  selectedRoom === room.id ? 'bg-primary/10 border border-primary/20' : 'hover:bg-muted/50'
                }`}
                onClick={() => setSelectedRoom(room.id)}
              >
                <div className="flex items-start space-x-3">
                  <div className="relative">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={room.customer.avatar} />
                      <AvatarFallback>{room.customer.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-background ${getStatusColor(room.customer.status)}`} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-sm truncate">{room.customer.name}</h4>
                      <div className="flex items-center space-x-1">
                        <div className={`w-2 h-2 rounded-full ${getPriorityColor(room.priority)}`} />
                        {room.unreadCount > 0 && (
                          <Badge variant="destructive" className="text-xs h-5 min-w-5 flex items-center justify-center">
                            {room.unreadCount}
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <p className="text-xs text-muted-foreground truncate">{room.customer.company}</p>
                    
                    <div className="flex items-center justify-between mt-1">
                      <Badge variant="outline" className="text-xs">
                        {room.type}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {formatTime(room.updatedAt)}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-1 mt-1">
                      {room.tags.slice(0, 2).map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs px-1 py-0">
                          {tag}
                        </Badge>
                      ))}
                      {room.tags.length > 2 && (
                        <span className="text-xs text-muted-foreground">+{room.tags.length - 2}</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Online Agents */}
        <div className="p-4 border-t border-border">
          <h3 className="font-medium text-sm mb-3 flex items-center">
            <Users className="w-4 h-4 mr-2" />
            Online Agents ({onlineAgents.filter(a => a.status === 'online').length})
          </h3>
          <div className="space-y-2">
            {onlineAgents.slice(0, 3).map((agent) => (
              <div key={agent.id} className="flex items-center space-x-2">
                <div className="relative">
                  <Avatar className="w-6 h-6">
                    <AvatarImage src={agent.avatar} />
                    <AvatarFallback className="text-xs">{agent.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div className={`absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full border border-background ${getStatusColor(agent.status)}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium truncate">{agent.name}</p>
                  <p className="text-xs text-muted-foreground">{agent.activeChats} active</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Chat Area */}
      {currentRoom ? (
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="p-4 border-b border-border bg-card">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={currentRoom.customer.avatar} />
                    <AvatarFallback>{currentRoom.customer.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-background ${getStatusColor(currentRoom.customer.status)}`} />
                </div>
                
                <div>
                  <h3 className="font-semibold">{currentRoom.customer.name}</h3>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <span>{currentRoom.customer.company}</span>
                    <span>•</span>
                    <span>{currentRoom.customer.email}</span>
                  </div>
                  <div className="flex items-center space-x-2 mt-1">
                    <Badge variant={currentRoom.status === 'active' ? 'default' : 'secondary'} className="text-xs">
                      {currentRoom.status}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {currentRoom.priority} priority
                    </Badge>
                    {currentRoom.agent && (
                      <span className="text-xs text-muted-foreground">
                        Agent: {currentRoom.agent.name}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm">
                  <Phone className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Video className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Settings className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Messages Area */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender.role === 'agent' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex items-start space-x-2 max-w-[70%] ${
                    msg.sender.role === 'agent' ? 'flex-row-reverse space-x-reverse' : ''
                  }`}>
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={msg.sender.avatar} />
                      <AvatarFallback className="text-xs">
                        {msg.sender.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div>
                      <div className={`rounded-lg px-3 py-2 ${
                        msg.sender.role === 'agent'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      }`}>
                        {msg.type === 'text' && (
                          <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                        )}
                        
                        {msg.type === 'file' && msg.attachment && (
                          <div>
                            <p className="text-sm mb-2">{msg.content}</p>
                            <div className="flex items-center space-x-2 p-2 bg-background/10 rounded border">
                              <File className="w-4 h-4" />
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-medium truncate">{msg.attachment.name}</p>
                                <p className="text-xs opacity-75">{msg.attachment.size}</p>
                              </div>
                              <Button variant="ghost" size="sm">
                                Download
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div className={`flex items-center space-x-2 mt-1 text-xs text-muted-foreground ${
                        msg.sender.role === 'agent' ? 'justify-end' : 'justify-start'
                      }`}>
                        <span>{formatTime(msg.timestamp)}</span>
                        {msg.sender.role === 'agent' && (
                          <div className="flex items-center">
                            {msg.status === 'sending' && <Clock className="w-3 h-3" />}
                            {msg.status === 'sent' && <Check className="w-3 h-3" />}
                            {msg.status === 'delivered' && <CheckCircle className="w-3 h-3" />}
                            {msg.status === 'read' && <CheckCircle className="w-3 h-3 text-blue-500" />}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex items-start space-x-2">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="text-xs">
                      {currentRoom.customer.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="bg-muted rounded-lg px-3 py-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Message Input */}
          <div className="p-4 border-t border-border bg-card">
            <div className="flex items-end space-x-2">
              <div className="flex space-x-1">
                <Button variant="ghost" size="sm">
                  <Paperclip className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Image className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Mic className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="flex-1">
                <Textarea
                  placeholder="Type your message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="min-h-[40px] max-h-[120px] resize-none"
                  rows={1}
                />
              </div>
              
              <div className="flex space-x-1">
                <Button variant="ghost" size="sm">
                  <Smile className="w-4 h-4" />
                </Button>
                <Button
                  onClick={handleSendMessage}
                  disabled={!message.trim()}
                  size="sm"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
              <span>Press Enter to send, Shift+Enter for new line</span>
              <span>{message.length}/1000</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center bg-muted/20">
          <div className="text-center">
            <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Select a conversation</h3>
            <p className="text-muted-foreground">Choose a chat from the sidebar to start messaging</p>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}