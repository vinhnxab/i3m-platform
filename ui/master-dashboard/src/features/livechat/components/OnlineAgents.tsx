import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Avatar, AvatarFallback, AvatarImage, Badge, Button } from '@/shared/components/ui';
import { Users, Phone, Video, MessageSquare } from 'lucide-react';

interface OnlineAgent {
  id: number;
  name: string;
  avatar: string;
  status: 'online' | 'offline' | 'away';
  activeChats: number;
}

interface OnlineAgentsProps {
  agents: OnlineAgent[];
  onCall?: (agent: OnlineAgent) => void;
  onVideoCall?: (agent: OnlineAgent) => void;
  onMessage?: (agent: OnlineAgent) => void;
}

export const OnlineAgents: React.FC<OnlineAgentsProps> = ({
  agents,
  onCall,
  onVideoCall,
  onMessage
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-chart-2';
      case 'away': return 'bg-chart-3';
      case 'offline': return 'bg-chart-4';
      default: return 'bg-gray-500';
    }
  };

  const onlineAgents = agents.filter(agent => agent.status === 'online');
  const awayAgents = agents.filter(agent => agent.status === 'away');

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Users className="w-5 h-5" />
          <span>Online Agents</span>
        </CardTitle>
        <CardDescription>
          {onlineAgents.length} online, {awayAgents.length} away
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {agents.map((agent) => (
            <div key={agent.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Avatar>
                    <AvatarImage src={agent.avatar} />
                    <AvatarFallback>{agent.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-background ${getStatusColor(agent.status)}`} />
                </div>
                <div>
                  <p className="font-medium text-sm">{agent.name}</p>
                  <p className="text-xs text-muted-foreground capitalize">{agent.status}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="text-xs">
                  {agent.activeChats} chats
                </Badge>
                
                <div className="flex space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onCall?.(agent)}
                    disabled={agent.status === 'offline'}
                  >
                    <Phone className="w-3 h-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onVideoCall?.(agent)}
                    disabled={agent.status === 'offline'}
                  >
                    <Video className="w-3 h-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onMessage?.(agent)}
                    disabled={agent.status === 'offline'}
                  >
                    <MessageSquare className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
