import { useState, useEffect } from 'react';
import { SupportState, Ticket, Agent, KnowledgeArticle, SupportStat } from '../types';
import { MessageSquare, Users, Star, TrendingUp } from 'lucide-react';

const mockTickets: Ticket[] = [
  {
    id: 'TKT-001',
    subject: 'Unable to access ERP module',
    customer: 'TechCorp Inc.',
    agent: 'Sarah Johnson',
    priority: 'high',
    status: 'open',
    category: 'Technical',
    created: '2024-01-15 09:30',
    updated: '2024-01-15 14:20'
  },
  {
    id: 'TKT-002',
    subject: 'Payment processing issue',
    customer: 'StartupCo',
    agent: 'Mike Chen',
    priority: 'urgent',
    status: 'in-progress',
    category: 'Billing',
    created: '2024-01-15 10:15',
    updated: '2024-01-15 15:30'
  }
];

const mockAgents: Agent[] = [
  {
    id: 'AG-001',
    name: 'Sarah Johnson',
    email: 'sarah@company.com',
    status: 'online',
    department: 'Technical Support',
    ticketsAssigned: 12,
    responseTime: '2.5 min',
    rating: 4.8
  },
  {
    id: 'AG-002',
    name: 'Mike Chen',
    email: 'mike@company.com',
    status: 'busy',
    department: 'Billing Support',
    ticketsAssigned: 8,
    responseTime: '1.8 min',
    rating: 4.9
  }
];

const mockArticles: KnowledgeArticle[] = [
  {
    id: 'KB-001',
    title: 'How to reset your password',
    category: 'Account Management',
    tags: ['password', 'security', 'account'],
    views: 1250,
    likes: 45,
    lastUpdated: '2024-01-10',
    status: 'published'
  },
  {
    id: 'KB-002',
    title: 'API Integration Guide',
    category: 'Technical',
    tags: ['api', 'integration', 'developer'],
    views: 890,
    likes: 32,
    lastUpdated: '2024-01-05',
    status: 'published'
  }
];

const mockStats: SupportStat[] = [
  { title: 'Open Tickets', value: '142', change: '-15', icon: MessageSquare, color: 'text-orange-500' },
  { title: 'Active Agents', value: '24', change: '+2', icon: Users, color: 'text-blue-500' },
  { title: 'Live Chats', value: '18', change: '+5', icon: MessageSquare, color: 'text-green-500' },
  { title: 'Satisfaction Rate', value: '94%', change: '+3%', icon: Star, color: 'text-purple-500' },
];

export function useSupport() {
  const [state, setState] = useState<SupportState>({
    tickets: [],
    agents: [],
    articles: [],
    stats: [],
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    const loadSupportData = async () => {
      try {
        setState(prev => ({ ...prev, isLoading: true, error: null }));
        
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setState(prev => ({
          ...prev,
          tickets: mockTickets,
          agents: mockAgents,
          articles: mockArticles,
          stats: mockStats,
          isLoading: false,
        }));
      } catch (error) {
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: error instanceof Error ? error.message : 'Failed to load support data',
        }));
      }
    };

    loadSupportData();
  }, []);

  const refreshData = async () => {
    console.log('Refreshing support data...');
  };

  return {
    ...state,
    refreshData,
  };
}
