export interface CMSContent {
  id: string;
  title: string;
  type: 'page' | 'post' | 'media' | 'template';
  status: 'draft' | 'published' | 'archived';
  author: string;
  createdAt: Date;
  updatedAt: Date;
  views?: number;
}

export interface CMSCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  postCount: number;
}

export interface CMSTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  preview: string;
  isActive: boolean;
}
