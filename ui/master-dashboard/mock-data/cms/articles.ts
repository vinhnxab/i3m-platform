// Mock CMS Articles Data
export interface MockArticle {
  id: number;
  title: string;
  author: string;
  status: 'published' | 'draft' | 'archived';
  category: string;
  views: number;
  publishedAt: string | null;
  featured: boolean;
}

export const mockArticles: MockArticle[] = [
  { 
    id: 1, 
    title: 'Getting Started with I3M Platform', 
    author: 'John Smith', 
    status: 'published', 
    category: 'Tutorial',
    views: 2847,
    publishedAt: '2024-01-15',
    featured: true
  },
  { 
    id: 2, 
    title: 'Advanced ERP Features Guide', 
    author: 'Sarah Johnson', 
    status: 'draft', 
    category: 'Documentation',
    views: 0,
    publishedAt: null,
    featured: false
  },
  { 
    id: 3, 
    title: 'E-commerce Integration Tips', 
    author: 'Mike Chen', 
    status: 'published', 
    category: 'Guide',
    views: 1523,
    publishedAt: '2024-01-12',
    featured: false
  },
  { 
    id: 4, 
    title: 'CMS Best Practices', 
    author: 'Lisa Wang', 
    status: 'published', 
    category: 'Best Practices',
    views: 3421,
    publishedAt: '2024-01-10',
    featured: true
  }
];
