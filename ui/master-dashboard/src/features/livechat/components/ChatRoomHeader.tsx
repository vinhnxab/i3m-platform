import React from 'react';
import { Button, Badge, Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui';
import { Phone, Video, MoreHorizontal, Maximize2, Minimize2 } from 'lucide-react';

interface ChatRoomHeaderProps {
  room: {
    id: number;
    name: string;
    customer: {
      name: string;
      avatar: string;
      status: 'online' | 'offline' | 'away';
    };
    agent?: {
      name: string;
      avatar: string;
      status: 'online' | 'offline' | 'away';
    };
    status: 'active' | 'waiting' | 'closed';
    priority: 'low' | 'medium' | 'high' | 'urgent';
  };
  isExpanded?: boolean;
  onCall?: () => void;
  onVideoCall?: () => void;
  onExpand?: () => void;
  onMinimize?: () => void;
  onMore?: () => void;
}

export const ChatRoomHeader: React.FC<ChatRoomHeaderProps> = ({
  room,
  isExpanded = false,
  onCall,
  onVideoCall,
  onExpand,
  onMinimize,
  onMore
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-chart-2';
      case 'away': return 'bg-chart-3';
      case 'offline': return 'bg-chart-4';
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
    <div className="p-4 border-b border-border bg-card">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Avatar>
              <AvatarImage src={room.customer.avatar} />
              <AvatarFallback>{room.customer.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-background ${getStatusColor(room.customer.status)}`} />
          </div>
          
          <div>
            <h3 className="font-medium">{room.name}</h3>
            <div className="flex items-center space-x-2">
              <p className="text-sm text-muted-foreground">{room.customer.name}</p>
              <Badge 
                variant="outline" 
                className={`text-xs ${getPriorityColor(room.priority)}`}
              >
                {room.priority}
              </Badge>
              <Badge variant="outline" className="text-xs capitalize">
                {room.status}
              </Badge>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" onClick={onCall}>
            <Phone className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={onVideoCall}>
            <Video className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={onMore}>
            <MoreHorizontal className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={isExpanded ? onMinimize : onExpand}>
            {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </Button>
        </div>
      </div>
    </div>
  );
};
