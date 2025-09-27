// Mock CMS Stats Data
export interface MockCMSStat {
  title: string;
  value: string;
  change: string;
  icon: string;
}

export const mockCMSStats: MockCMSStat[] = [
  { 
    title: 'Total Articles', 
    value: '1,847', 
    change: '+124', 
    icon: 'FileText' 
  },
  { 
    title: 'Published Pages', 
    value: '89', 
    change: '+12', 
    icon: 'Globe' 
  },
  { 
    title: 'Media Files', 
    value: '2,456', 
    change: '+89', 
    icon: 'Image' 
  },
  { 
    title: 'Active Themes', 
    value: '23', 
    change: '+3', 
    icon: 'Palette' 
  }
];
