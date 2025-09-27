// Mock Team Data for Scrum Management
export interface MockTeamMember {
  id: string;
  name: string;
  avatar: string;
  role: string;
  tasksCount: number;
  storyPoints: number;
}

export const mockTeamMembers: MockTeamMember[] = [
  {
    id: '1',
    name: 'Nguyễn Văn A',
    avatar: '',
    role: 'Frontend Developer',
    tasksCount: 3,
    storyPoints: 18
  },
  {
    id: '2',
    name: 'Trần Thị B',
    avatar: '',
    role: 'Backend Developer',
    tasksCount: 2,
    storyPoints: 11
  },
  {
    id: '3',
    name: 'Lê Văn C',
    avatar: '',
    role: 'Full-stack Developer',
    tasksCount: 3,
    storyPoints: 29
  },
  {
    id: '4',
    name: 'Phạm Thị D',
    avatar: '',
    role: 'DevOps Engineer',
    tasksCount: 2,
    storyPoints: 15
  },
  {
    id: '5',
    name: 'Hoàng Văn E',
    avatar: '',
    role: 'QA Engineer',
    tasksCount: 1,
    storyPoints: 3
  },
  {
    id: '6',
    name: 'Nguyễn Thị F',
    avatar: '',
    role: 'Mobile Developer',
    tasksCount: 1,
    storyPoints: 5
  },
  {
    id: '7',
    name: 'Võ Văn G',
    avatar: '',
    role: 'Database Engineer',
    tasksCount: 3,
    storyPoints: 21
  },
  {
    id: '8',
    name: 'Đặng Thị H',
    avatar: '',
    role: 'Security Engineer',
    tasksCount: 1,
    storyPoints: 8
  }
];
