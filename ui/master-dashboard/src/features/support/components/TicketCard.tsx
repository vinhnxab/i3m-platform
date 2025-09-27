import { Card, CardContent } from '@/shared/components/ui';
import { Badge } from '@/shared/components/ui';
import { MessageSquare, Clock, User } from 'lucide-react';

interface Ticket {
  id: string;
  subject: string;
  customer: string;
  agent: string;
  priority: 'urgent' | 'high' | 'medium' | 'low';
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  category: string;
  created: string;
  updated: string;
}

interface TicketCardProps {
  ticket: Ticket;
  onView?: (ticket: Ticket) => void;
  onAssign?: (ticket: Ticket) => void;
  className?: string;
}

export function TicketCard({ ticket, onView, onAssign, className = "" }: TicketCardProps) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'destructive';
      case 'high':
        return 'default';
      case 'medium':
        return 'secondary';
      case 'low':
        return 'outline';
      default:
        return 'outline';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-red-100 text-red-800';
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      case 'closed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className={`hover:shadow-md transition-shadow cursor-pointer ${className}`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-primary" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h4 className="font-medium">{ticket.id}</h4>
                <Badge variant={getPriorityColor(ticket.priority) as any}>
                  {ticket.priority}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-1">{ticket.subject}</p>
              <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                <span>{ticket.customer}</span>
                <span>Agent: {ticket.agent}</span>
                <span>Created: {ticket.created}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
              {ticket.status}
            </span>
            <div className="flex space-x-1">
              <button
                onClick={() => onView?.(ticket)}
                className="p-1 hover:bg-muted rounded"
                title="View Ticket"
              >
                <User className="w-4 h-4" />
              </button>
              <button
                onClick={() => onAssign?.(ticket)}
                className="p-1 hover:bg-muted rounded"
                title="Assign Ticket"
              >
                <Clock className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
