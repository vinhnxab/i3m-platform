import { Card, CardContent, CardDescription, CardHeader, CardTitle, Button } from '@/shared/components/ui';
import { Search, Filter } from 'lucide-react';
import { TicketCard } from './TicketCard';

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

interface TicketsListProps {
  tickets: Ticket[];
  onViewTicket?: (ticket: Ticket) => void;
  onAssignTicket?: (ticket: Ticket) => void;
  onSearch?: () => void;
  onFilter?: () => void;
  className?: string;
}

export function TicketsList({ 
  tickets, 
  onViewTicket, 
  onAssignTicket, 
  onSearch, 
  onFilter,
  className = ""
}: TicketsListProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Support Tickets</CardTitle>
            <CardDescription>Manage customer support requests</CardDescription>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={onSearch}>
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
            <Button variant="outline" size="sm" onClick={onFilter}>
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {tickets.map((ticket) => (
            <TicketCard
              key={ticket.id}
              ticket={ticket}
              onView={onViewTicket}
              onAssign={onAssignTicket}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
