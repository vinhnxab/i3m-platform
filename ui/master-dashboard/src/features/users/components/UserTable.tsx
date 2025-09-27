import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/components/ui/table';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { Avatar, AvatarFallback } from '@/shared/components/ui/avatar';
import { Eye, Edit, Trash2, UserX, UserCheck } from 'lucide-react';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  username?: string;
  role: string;
  department?: string;
  isActive: boolean;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
}

interface UserTableProps {
  users: User[];
  onViewUser: (user: User) => void;
  onEditUser: (user: User) => void;
  onDeleteUser: (userId: string) => void;
  onToggleStatus: (userId: string) => void;
}

export const UserTable: React.FC<UserTableProps> = ({
  users,
  onViewUser,
  onEditUser,
  onDeleteUser,
  onToggleStatus,
}) => {
  const getRoleBadgeColor = (role: string) => {
    const colors = {
      'PLATFORM_ADMIN': 'bg-red-100 text-red-800',
      'PLATFORM_USER': 'bg-blue-100 text-blue-800',
      'MARKETPLACE_DEVELOPER': 'bg-green-100 text-green-800',
      'TENANT_ADMIN': 'bg-purple-100 text-purple-800',
      'TENANT_USER': 'bg-orange-100 text-orange-800',
      'END_CUSTOMER': 'bg-gray-100 text-gray-800',
    };
    return colors[role as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getStatusBadge = (isActive: boolean) => {
    return (
      <Badge variant={isActive ? 'default' : 'secondary'}>
        {isActive ? 'Active' : 'Inactive'}
      </Badge>
    );
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>User</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Department</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Last Login</TableHead>
          <TableHead>Created</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell>
              <div className="flex items-center space-x-3">
                <Avatar className="w-8 h-8">
                  <AvatarFallback>
                    {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{user.firstName} {user.lastName}</div>
                  <div className="text-sm text-muted-foreground">{user.email}</div>
                  {user.username && (
                    <div className="text-xs text-muted-foreground">@{user.username}</div>
                  )}
                </div>
              </div>
            </TableCell>
            <TableCell>
              <Badge className={getRoleBadgeColor(user.role)}>
                {user.role}
              </Badge>
            </TableCell>
            <TableCell>
              <span className="text-sm text-muted-foreground">
                {user.department || 'N/A'}
              </span>
            </TableCell>
            <TableCell>
              {getStatusBadge(user.isActive)}
            </TableCell>
            <TableCell>
              <span className="text-sm text-muted-foreground">
                {user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleDateString() : 'Never'}
              </span>
            </TableCell>
            <TableCell>
              <span className="text-sm text-muted-foreground">
                {new Date(user.createdAt).toLocaleDateString()}
              </span>
            </TableCell>
            <TableCell>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onViewUser(user)}
                  title="View user details"
                >
                  <Eye className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEditUser(user)}
                  title="Edit user"
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onToggleStatus(user.id)}
                  title={user.isActive ? "Deactivate user" : "Activate user"}
                >
                  {user.isActive ? (
                    <UserX className="w-4 h-4" />
                  ) : (
                    <UserCheck className="w-4 h-4" />
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDeleteUser(user.id)}
                  title="Delete user"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
