// Mock ERP HR Stats Data
export interface MockHRStat {
  title: string;
  value: string;
  change: string;
  icon: string;
}

export const mockHRStats: MockHRStat[] = [
  { 
    title: 'Total Employees', 
    value: '1,247', 
    change: '+12', 
    icon: 'Users' 
  },
  { 
    title: 'Active Projects', 
    value: '89', 
    change: '+5', 
    icon: 'FolderOpen' 
  },
  { 
    title: 'Pending Reviews', 
    value: '23', 
    change: '-3', 
    icon: 'Clock' 
  },
  { 
    title: 'New Hires', 
    value: '8', 
    change: '+8', 
    icon: 'UserPlus' 
  }
];
