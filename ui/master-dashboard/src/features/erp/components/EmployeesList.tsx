import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Button, Badge, Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui';
import { motion } from 'motion/react';
import { Edit, Trash2, UserPlus, Mail, Phone } from 'lucide-react';

interface Employee {
  id: number;
  name: string;
  position: string;
  department: string;
  email: string;
  phone: string;
  avatar: string;
  status: 'active' | 'inactive' | 'on-leave';
  joinDate: string;
  salary: string;
}

interface EmployeesListProps {
  employees: Employee[];
  onEdit?: (employee: Employee) => void;
  onDelete?: (employee: Employee) => void;
  onAdd?: () => void;
}

export const EmployeesList: React.FC<EmployeesListProps> = ({
  employees,
  onEdit,
  onDelete,
  onAdd
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-chart-2';
      case 'inactive': return 'bg-chart-4';
      case 'on-leave': return 'bg-chart-3';
      default: return 'bg-gray-500';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Employees</CardTitle>
            <CardDescription>Manage your workforce</CardDescription>
          </div>
          <Button onClick={onAdd}>
            <UserPlus className="w-4 h-4 mr-2" />
            Add Employee
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {employees.map((employee, index) => (
            <motion.div
              key={employee.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg hover:shadow-md transition-shadow">
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src={employee.avatar} />
                    <AvatarFallback>{employee.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{employee.name}</p>
                    <p className="text-sm text-muted-foreground">{employee.position}</p>
                    <p className="text-xs text-muted-foreground">{employee.department}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-sm font-medium">{employee.salary}</p>
                    <p className="text-xs text-muted-foreground">Joined: {employee.joinDate}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="capitalize">{employee.status}</Badge>
                    <div className="flex space-x-1">
                      <Button variant="ghost" size="sm" onClick={() => onEdit?.(employee)}>
                        <Edit className="w-3 h-3" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => onDelete?.(employee)}>
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
