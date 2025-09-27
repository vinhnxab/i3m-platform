import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { Switch } from '@/shared/components/ui/switch';

interface CreateUserDialogProps {
  isOpen: boolean;
  onClose: () => void;
  newUserData: {
    firstName: string;
    lastName: string;
    email: string;
    username: string;
    password: string;
    role: string;
    department: string;
    isActive: boolean;
  };
  onFormChange: (field: string, value: string | boolean) => void;
  onSave: () => void;
  isSaving: boolean;
  tenants: string[];
}

export const CreateUserDialog: React.FC<CreateUserDialogProps> = ({
  isOpen,
  onClose,
  newUserData,
  onFormChange,
  onSave,
  isSaving,
  tenants,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create New User</DialogTitle>
          <DialogDescription>
            Add a new user to the system with appropriate permissions.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="firstName">First Name *</Label>
            <Input
              id="firstName"
              value={newUserData.firstName}
              onChange={(e) => onFormChange('firstName', e.target.value)}
              placeholder="John"
            />
          </div>
          <div>
            <Label htmlFor="lastName">Last Name *</Label>
            <Input
              id="lastName"
              value={newUserData.lastName}
              onChange={(e) => onFormChange('lastName', e.target.value)}
              placeholder="Doe"
            />
          </div>
          <div>
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={newUserData.email}
              onChange={(e) => onFormChange('email', e.target.value)}
              placeholder="john.doe@example.com"
            />
          </div>
          <div>
            <Label htmlFor="username">Username *</Label>
            <Input
              id="username"
              value={newUserData.username}
              onChange={(e) => onFormChange('username', e.target.value)}
              placeholder="john.doe"
            />
          </div>
          <div>
            <Label htmlFor="password">Password *</Label>
            <Input
              id="password"
              type="password"
              value={newUserData.password}
              onChange={(e) => onFormChange('password', e.target.value)}
              placeholder="Enter password"
            />
          </div>
          <div>
            <Label htmlFor="role">Role *</Label>
            <Select value={newUserData.role} onValueChange={(value) => onFormChange('role', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PLATFORM_ADMIN">Platform Admin</SelectItem>
                <SelectItem value="PLATFORM_USER">Platform User</SelectItem>
                <SelectItem value="MARKETPLACE_DEVELOPER">Developer</SelectItem>
                <SelectItem value="TENANT_ADMIN">Tenant Admin</SelectItem>
                <SelectItem value="TENANT_USER">Tenant User</SelectItem>
                <SelectItem value="END_CUSTOMER">End Customer</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="department">Department</Label>
            <Input
              id="department"
              value={newUserData.department}
              onChange={(e) => onFormChange('department', e.target.value)}
              placeholder="Engineering"
            />
          </div>
          <div>
            <Label htmlFor="tenant">Tenant</Label>
            <Select value="" onValueChange={(value) => onFormChange('tenant', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select tenant" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="platform">Platform</SelectItem>
                {(tenants || []).map(tenant => (
                  <SelectItem key={tenant} value={tenant || ''}>
                    {tenant}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="col-span-2 flex items-center space-x-2">
            <Switch
              id="isActive"
              checked={newUserData.isActive}
              onCheckedChange={(checked) => onFormChange('isActive', checked)}
            />
            <Label htmlFor="isActive">Active User</Label>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onSave} disabled={isSaving}>
            {isSaving ? 'Creating...' : 'Create User'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
