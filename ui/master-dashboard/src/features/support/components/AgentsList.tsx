import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui';
import { Badge } from '@/shared/components/ui';
import { User, MessageSquare, Clock, Star } from 'lucide-react';

interface Agent {
  id: string;
  name: string;
  email: string;
  status: 'online' | 'busy' | 'away' | 'offline';
  department: string;
  ticketsAssigned: number;
  responseTime: string;
  rating: number;
  avatar?: string;
}

interface AgentsListProps {
  agents: Agent[];
  className?: string;
}

export function AgentsList({ agents, className = "" }: AgentsListProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'bg-green-100 text-green-800';
      case 'busy':
        return 'bg-yellow-100 text-yellow-800';
      case 'away':
        return 'bg-orange-100 text-orange-800';
      case 'offline':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Support Agents</CardTitle>
        <CardDescription>Manage your support team</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {agents.map((agent) => (
            <div key={agent.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <User className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h4 className="font-medium">{agent.name}</h4>
                    <Badge variant="outline" className={getStatusColor(agent.status)}>
                      {agent.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{agent.email}</p>
                  <p className="text-xs text-muted-foreground">{agent.department}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <MessageSquare className="w-4 h-4" />
                  <span>{agent.ticketsAssigned}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{agent.responseTime}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span>{agent.rating}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
