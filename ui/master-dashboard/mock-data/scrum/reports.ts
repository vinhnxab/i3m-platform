// Mock Reports Data for Scrum Management
export interface MockReport {
  id: string;
  title: string;
  type: 'velocity' | 'burndown' | 'sprint-summary' | 'team-performance';
  data: any;
  generatedAt: string;
}

export const mockReports: MockReport[] = [
  {
    id: 'report-1',
    title: 'Sprint Velocity Report',
    type: 'velocity',
    data: {
      currentSprint: 52,
      averageVelocity: 48,
      trend: 'increasing'
    },
    generatedAt: '2024-01-19T10:00:00Z'
  },
  {
    id: 'report-2',
    title: 'Sprint Burndown Chart',
    type: 'burndown',
    data: {
      idealBurndown: [84, 72, 60, 48, 36, 24, 12, 0],
      actualBurndown: [84, 78, 70, 65, 58, 52, 45, 32],
      daysRemaining: 3
    },
    generatedAt: '2024-01-19T10:00:00Z'
  },
  {
    id: 'report-3',
    title: 'Team Performance Summary',
    type: 'team-performance',
    data: {
      totalTasks: 24,
      completedTasks: 18,
      inProgressTasks: 4,
      blockedTasks: 2,
      teamEfficiency: 85
    },
    generatedAt: '2024-01-19T10:00:00Z'
  }
];
