import React from 'react';
import { Badge, Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui';
import { MessageSquare, Clock, CheckCircle, AlertCircle } from 'lucide-react';

interface ChatRoom {
  id: number;
  name: string;
  type: 'technical' | 'sales' | 'billing' | 'general';
  customer: {
    id: number;
    name: string;
    email: string;
    avatar: string;
    company: string;
    status: 'online' | 'offline' | 'away';
  };
  agent?: {
    id: number;
    name: string;
    avatar: string;
    status: 'online' | 'offline' | 'away';
  };
  unreadCount: number;
  status: 'active' | 'waiting' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

interface ChatRoomsListProps {
  chatRooms: ChatRoom[];
  selectedRoom?: number;
  onSelectRoom?: (room: ChatRoom) => void;
}

export const ChatRoomsList: React.FC<ChatRoomsListProps> = ({
  chatRooms,
  selectedRoom,
  onSelectRoom
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-chart-2';
      case 'waiting': return 'bg-chart-3';
      case 'closed': return 'bg-chart-4';
      default: return 'bg-gray-500';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-chart-4';
      case 'high': return 'bg-chart-3';
      case 'medium': return 'bg-chart-1';
      case 'low': return 'bg-chart-2';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="w-80 bg-card border-r border-border flex flex-col">
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Chat Rooms</h2>
          <Badge variant="outline">{chatRooms.length} active</Badge>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {chatRooms.map((room) => (
          <div
            key={room.id}
            className={`p-4 border-b border-border cursor-pointer hover:bg-muted/50 transition-colors ${
              selectedRoom === room.id ? 'bg-muted' : ''
            }`}
            onClick={() => onSelectRoom?.(room)}
          >
            <div className="flex items-start space-x-3">
              <Avatar className="w-10 h-10">
                <AvatarImage src={room.customer.avatar} />
                <AvatarFallback>{room.customer.name.charAt(0)}</AvatarFallback>
              </Avatar>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-medium text-sm truncate">{room.name}</h3>
                  <div className="flex items-center space-x-1">
                    <div className={`w-2 h-2 rounded-full ${getStatusColor(room.status)}`} />
                    {room.unreadCount > 0 && (
                      <Badge variant="destructive" className="text-xs">
                        {room.unreadCount}
                      </Badge>
                    )}
                  </div>
                </div>
                
                <p className="text-xs text-muted-foreground mb-2">
                  {room.customer.name} • {room.customer.company}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${getPriorityColor(room.priority)}`}
                    >
                      {room.priority}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {room.type}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {room.updatedAt}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
