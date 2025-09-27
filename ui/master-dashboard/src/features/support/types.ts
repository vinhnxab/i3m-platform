// Support feature types
export interface Ticket {
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

export interface Agent {
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

export interface KnowledgeArticle {
  id: string;
  title: string;
  category: string;
  tags: string[];
  views: number;
  likes: number;
  lastUpdated: string;
  status: 'published' | 'draft' | 'archived';
}

export interface SupportStat {
  title: string;
  value: string;
  change: string;
  icon: any; // LucideIcon
  color: string;
}

export interface SupportState {
  tickets: Ticket[];
  agents: Agent[];
  articles: KnowledgeArticle[];
  stats: SupportStat[];
  isLoading: boolean;
  error: string | null;
}
