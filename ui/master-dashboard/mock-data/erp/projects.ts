// Mock ERP Projects Data
export interface MockProject {
  id: number;
  name: string;
  progress: number;
  status: 'planning' | 'in-progress' | 'review' | 'completed';
  team: number;
  deadline: string;
}

export const mockProjects: MockProject[] = [
  { 
    id: 1, 
    name: 'ERP Module Update', 
    progress: 75, 
    status: 'in-progress', 
    team: 8, 
    deadline: '2024-02-15' 
  },
  { 
    id: 2, 
    name: 'Customer Portal', 
    progress: 45, 
    status: 'in-progress', 
    team: 6, 
    deadline: '2024-03-01' 
  },
  { 
    id: 3, 
    name: 'Mobile App V2', 
    progress: 90, 
    status: 'review', 
    team: 5, 
    deadline: '2024-01-30' 
  },
  { 
    id: 4, 
    name: 'Analytics Dashboard', 
    progress: 25, 
    status: 'planning', 
    team: 4, 
    deadline: '2024-04-15' 
  }
];
