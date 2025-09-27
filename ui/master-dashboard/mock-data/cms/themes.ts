// Mock CMS Themes Data
export interface MockTheme {
  id: number;
  name: string;
  status: 'active' | 'inactive';
  version: string;
  installations: number;
}

export const mockThemes: MockTheme[] = [
  { 
    id: 1, 
    name: 'Corporate Pro', 
    status: 'active', 
    version: '2.1.3', 
    installations: 1234 
  },
  { 
    id: 2, 
    name: 'Tech Startup', 
    status: 'active', 
    version: '1.8.5', 
    installations: 892 
  },
  { 
    id: 3, 
    name: 'E-commerce Pro', 
    status: 'inactive', 
    version: '3.0.2', 
    installations: 654 
  },
  { 
    id: 4, 
    name: 'Minimalist Clean', 
    status: 'active', 
    version: '1.5.1', 
    installations: 445 
  }
];
