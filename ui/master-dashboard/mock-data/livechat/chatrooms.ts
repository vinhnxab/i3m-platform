// Mock LiveChat ChatRooms Data
export interface MockCustomer {
  id: number;
  name: string;
  email: string;
  avatar: string;
  company: string;
  status: 'online' | 'offline' | 'away';
}

export interface MockAgent {
  id: number;
  name: string;
  avatar: string;
  status: 'online' | 'offline' | 'away';
}

export interface MockChatRoom {
  id: number;
  name: string;
  type: 'technical' | 'sales' | 'billing' | 'general';
  customer: MockCustomer;
  agent: MockAgent;
  unreadCount: number;
  status: 'active' | 'waiting' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export const mockChatRooms: MockChatRoom[] = [
  {
    id: 1,
    name: 'Technical Support - TechCorp',
    type: 'technical',
    customer: {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@techcorp.com',
      avatar: '',
      company: 'TechCorp Inc.',
      status: 'online'
    },
    agent: {
      id: 1,
      name: 'Sarah Wilson',
      avatar: '',
      status: 'online'
    },
    unreadCount: 3,
    status: 'active',
    priority: 'high',
    tags: ['api', 'integration', 'urgent'],
    createdAt: '2024-01-15 10:30:00',
    updatedAt: '2024-01-15 14:25:00'
  },
  {
    id: 2,
    name: 'Sales Inquiry - Global Solutions',
    type: 'sales',
    customer: {
      id: 2,
      name: 'Emily Chen',
      email: 'emily.chen@globalsolutions.com',
      avatar: '',
      company: 'Global Solutions Ltd.',
      status: 'online'
    },
    agent: {
      id: 2,
      name: 'Mike Johnson',
      avatar: '',
      status: 'online'
    },
    unreadCount: 1,
    status: 'active',
    priority: 'medium',
    tags: ['pricing', 'enterprise'],
    createdAt: '2024-01-15 09:15:00',
    updatedAt: '2024-01-15 14:20:00'
  }
];
