// Mock ERP Employees Data
export interface MockEmployee {
  id: number;
  name: string;
  position: string;
  department: string;
  status: 'active' | 'on-leave' | 'inactive';
  salary: string;
}

export const mockEmployees: MockEmployee[] = [
  { 
    id: 1, 
    name: 'John Smith', 
    position: 'Senior Developer', 
    department: 'Engineering', 
    status: 'active', 
    salary: '$85,000' 
  },
  { 
    id: 2, 
    name: 'Sarah Johnson', 
    position: 'Product Manager', 
    department: 'Product', 
    status: 'active', 
    salary: '$95,000' 
  },
  { 
    id: 3, 
    name: 'Mike Chen', 
    position: 'UX Designer', 
    department: 'Design', 
    status: 'active', 
    salary: '$70,000' 
  },
  { 
    id: 4, 
    name: 'Emily Davis', 
    position: 'Data Analyst', 
    department: 'Analytics', 
    status: 'on-leave', 
    salary: '$65,000' 
  }
];
