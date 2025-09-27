// Mock Security Stats Data
export interface MockSecurityStat {
  title: string;
  value: string;
  change: string;
  icon: string;
  color: string;
}

export const mockSecurityStats: MockSecurityStat[] = [
  { 
    title: 'Security Score', 
    value: '94.7%', 
    change: '+2.1%', 
    icon: 'Shield', 
    color: 'text-green-500' 
  },
  { 
    title: 'Active Threats', 
    value: '3', 
    change: '-5', 
    icon: 'AlertTriangle', 
    color: 'text-red-500' 
  },
  { 
    title: 'Blocked Attacks', 
    value: '1,247', 
    change: '+23%', 
    icon: 'Ban', 
    color: 'text-blue-500' 
  },
  { 
    title: 'Compliance Status', 
    value: '98.9%', 
    change: '+0.8%', 
    icon: 'CheckCircle', 
    color: 'text-purple-500' 
  }
];
