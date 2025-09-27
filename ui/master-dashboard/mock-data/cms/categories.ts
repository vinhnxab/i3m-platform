// Mock CMS Categories Data
export interface MockCategory {
  name: string;
  count: number;
  description: string;
}

export const mockCategories: MockCategory[] = [
  { 
    name: 'Tutorial', 
    count: 45, 
    description: 'Step-by-step guides' 
  },
  { 
    name: 'Documentation', 
    count: 67, 
    description: 'Technical documentation' 
  },
  { 
    name: 'Best Practices', 
    count: 23, 
    description: 'Industry best practices' 
  },
  { 
    name: 'News', 
    count: 12, 
    description: 'Company news and updates' 
  },
  { 
    name: 'Guide', 
    count: 34, 
    description: 'Comprehensive guides' 
  }
];
