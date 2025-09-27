// Mock CMS Media Files Data
export interface MockMediaFile {
  id: number;
  name: string;
  type: string;
  size: string;
  uploadedAt: string;
  usage: number;
}

export const mockMediaFiles: MockMediaFile[] = [
  { 
    id: 1, 
    name: 'hero-banner.jpg', 
    type: 'image', 
    size: '2.4 MB', 
    uploadedAt: '2024-01-15', 
    usage: 12 
  },
  { 
    id: 2, 
    name: 'product-demo.mp4', 
    type: 'video', 
    size: '15.7 MB', 
    uploadedAt: '2024-01-14', 
    usage: 8 
  },
  { 
    id: 3, 
    name: 'company-logo.svg', 
    type: 'vector', 
    size: '45 KB', 
    uploadedAt: '2024-01-13', 
    usage: 156 
  },
  { 
    id: 4, 
    name: 'user-guide.pdf', 
    type: 'document', 
    size: '1.2 MB', 
    uploadedAt: '2024-01-12', 
    usage: 23 
  }
];
