// Mock LiveChat Agents Data
export interface MockOnlineAgent {
  id: number;
  name: string;
  avatar: string;
  status: 'online' | 'offline' | 'away';
  activeChats: number;
}

export const mockOnlineAgents: MockOnlineAgent[] = [
  { 
    id: 1, 
    name: 'Sarah Wilson', 
    avatar: '', 
    status: 'online', 
    activeChats: 3 
  },
  { 
    id: 2, 
    name: 'Mike Johnson', 
    avatar: '', 
    status: 'online', 
    activeChats: 2 
  },
  { 
    id: 3, 
    name: 'David Brown', 
    avatar: '', 
    status: 'online', 
    activeChats: 1 
  },
  { 
    id: 4, 
    name: 'Emma Davis', 
    avatar: '', 
    status: 'away', 
    activeChats: 0 
  },
  { 
    id: 5, 
    name: 'James Wilson', 
    avatar: '', 
    status: 'offline', 
    activeChats: 0 
  }
];
