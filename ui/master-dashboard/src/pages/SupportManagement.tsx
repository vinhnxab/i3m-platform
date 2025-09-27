import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui';
import { LoadingState, ErrorState } from '@/shared/components/dashboard';
import { 
  SupportHeader, 
  SupportStats, 
  TicketsList, 
  AgentsList, 
  KnowledgeBase 
} from '@/features/support';
import { useSupport } from '@/features/support';

export function SupportManagement() {
  const [activeTab, setActiveTab] = useState('tickets');
  const { tickets, agents, articles, stats, isLoading, error } = useSupport();

  if (isLoading) {
    return <LoadingState message="Loading support data..." />;
  }

  if (error) {
    return <ErrorState message={error} />;
  }

  const handleNewTicket = () => {
    console.log('Creating new ticket...');
  };

  const handleLiveChat = () => {
    console.log('Starting live chat...');
  };

  const handleViewTicket = (ticket: any) => {
    console.log('Viewing ticket:', ticket.id);
  };

  const handleAssignTicket = (ticket: any) => {
    console.log('Assigning ticket:', ticket.id);
  };

  const handleViewArticle = (article: any) => {
    console.log('Viewing article:', article.id);
  };

  const handleCreateArticle = () => {
    console.log('Creating new article...');
  };

  return (
    <div className="space-y-4 lg:space-y-6">
      {/* Header */}
      <SupportHeader 
        onNewTicket={handleNewTicket}
        onLiveChat={handleLiveChat}
      />

      {/* Support Stats */}
      <SupportStats stats={stats} />

      {/* Support Modules */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="tickets">Support Tickets</TabsTrigger>
          <TabsTrigger value="agents">Agents</TabsTrigger>
          <TabsTrigger value="chat">Live Chat</TabsTrigger>
          <TabsTrigger value="knowledge">Knowledge Base</TabsTrigger>
        </TabsList>

        {/* Support Tickets Tab */}
        <TabsContent value="tickets" className="space-y-6">
          <TicketsList 
            tickets={tickets}
            onViewTicket={handleViewTicket}
            onAssignTicket={handleAssignTicket}
          />
        </TabsContent>

        {/* Agents Tab */}
        <TabsContent value="agents" className="space-y-6">
          <AgentsList agents={agents} />
        </TabsContent>

        {/* Live Chat Tab */}
        <TabsContent value="chat" className="space-y-6">
          <div className="text-center py-12">
            <h3 className="text-lg font-semibold mb-2">Live Chat</h3>
            <p className="text-muted-foreground">Live chat functionality coming soon...</p>
          </div>
        </TabsContent>

        {/* Knowledge Base Tab */}
        <TabsContent value="knowledge" className="space-y-6">
          <KnowledgeBase 
            articles={articles}
            onViewArticle={handleViewArticle}
            onCreateArticle={handleCreateArticle}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
