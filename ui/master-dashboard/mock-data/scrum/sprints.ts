// Mock Sprint Data for Scrum Management
export interface MockSprint {
  id: string;
  name: string;
  goal: string;
  startDate: string;
  endDate: string;
  status: 'planning' | 'active' | 'completed';
  capacity: number;
  completedPoints: number;
}

export const mockSprint: MockSprint = {
  id: '1',
  name: 'Sprint 24 - Q1 2024',
  goal: 'Hoàn thiện tính năng user management và dashboard analytics',
  startDate: '2024-01-15',
  endDate: '2024-01-29',
  status: 'active',
  capacity: 84,
  completedPoints: 52
};
