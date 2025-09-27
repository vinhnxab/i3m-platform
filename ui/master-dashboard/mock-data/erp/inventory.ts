// Mock ERP Inventory Data
export interface MockInventoryStat {
  title: string;
  value: string;
  change: string;
  icon: string;
}

export const mockInventoryStats: MockInventoryStat[] = [
  { 
    title: 'Total Products', 
    value: '2,847', 
    change: '+124', 
    icon: 'Package' 
  },
  { 
    title: 'Low Stock Items', 
    value: '23', 
    change: '-5', 
    icon: 'AlertTriangle' 
  },
  { 
    title: 'Warehouses', 
    value: '8', 
    change: '+1', 
    icon: 'Package' 
  },
  { 
    title: 'Pending Orders', 
    value: '156', 
    change: '+12', 
    icon: 'ShoppingCart' 
  }
];
