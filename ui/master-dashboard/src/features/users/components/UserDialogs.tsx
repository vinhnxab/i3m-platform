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
import { Textarea } from '@/shared/components/ui/textarea';
import { Badge } from '@/shared/components/ui/badge';
import { Switch } from '@/shared/components/ui/switch';

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
  permissions?: string[];
  customPermissions?: string[];
}

interface UserDialogsProps {
  // View User Dialog
  selectedUser: User | null;
  isViewDialogOpen: boolean;
  onCloseViewDialog: () => void;

  // Edit User Dialog
  isEditDialogOpen: boolean;
  onCloseEditDialog: () => void;
  userForm: {
    firstName: string;
    lastName: string;
    email: string;
    username: string;
    role: string;
    department: string;
    isActive: boolean;
    website: string;
  };
  onFormChange: (field: string, value: string | boolean) => void;
  onSaveUser: () => void;
  isSaving: boolean;

  // Delete User Dialog
  isDeleteDialogOpen: boolean;
  onCloseDeleteDialog: () => void;
  onConfirmDelete: () => void;
  isDeleting: boolean;
}

export const UserDialogs: React.FC<UserDialogsProps> = ({
  selectedUser,
  isViewDialogOpen,
  onCloseViewDialog,
  isEditDialogOpen,
  onCloseEditDialog,
  userForm,
  onFormChange,
  onSaveUser,
  isSaving,
  isDeleteDialogOpen,
  onCloseDeleteDialog,
  onConfirmDelete,
  isDeleting,
}) => {
  return (
    <>
      {/* View User Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={onCloseViewDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
            <DialogDescription>
              View detailed information about this user.
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">First Name</Label>
                  <p className="text-sm text-muted-foreground">{selectedUser.firstName}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Last Name</Label>
                  <p className="text-sm text-muted-foreground">{selectedUser.lastName}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Email</Label>
                  <p className="text-sm text-muted-foreground">{selectedUser.email}</p>
                </div>
                {selectedUser.username && (
                  <div>
                    <Label className="text-sm font-medium">Username</Label>
                    <p className="text-sm text-muted-foreground">{selectedUser.username}</p>
                  </div>
                )}
                <div>
                  <Label className="text-sm font-medium">Role</Label>
                  <Badge variant="outline">{selectedUser.role}</Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium">Department</Label>
                  <p className="text-sm text-muted-foreground">{selectedUser.department || 'N/A'}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Status</Label>
                  <Badge variant={selectedUser.isActive ? 'default' : 'secondary'}>
                    {selectedUser.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium">Last Login</Label>
                  <p className="text-sm text-muted-foreground">
                    {selectedUser.lastLoginAt ? new Date(selectedUser.lastLoginAt).toLocaleDateString() : 'Never'}
                  </p>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium">Permissions</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {(selectedUser.permissions || []).map((permission, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {permission}
                    </Badge>
                  ))}
                  {(selectedUser.customPermissions || []).map((permission, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {permission}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={onCloseViewDialog}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={onCloseEditDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update user information and settings.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={userForm.firstName}
                onChange={(e) => onFormChange('firstName', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={userForm.lastName}
                onChange={(e) => onFormChange('lastName', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={userForm.email}
                onChange={(e) => onFormChange('email', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={userForm.username}
                onChange={(e) => onFormChange('username', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="role">Role</Label>
              <Select value={userForm.role} onValueChange={(value) => onFormChange('role', value)}>
                <SelectTrigger>
                  <SelectValue />
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
                value={userForm.department}
                onChange={(e) => onFormChange('department', e.target.value)}
              />
            </div>
            <div className="col-span-2">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                value={userForm.website}
                onChange={(e) => onFormChange('website', e.target.value)}
              />
            </div>
            <div className="col-span-2 flex items-center space-x-2">
              <Switch
                id="isActive"
                checked={userForm.isActive}
                onCheckedChange={(checked) => onFormChange('isActive', checked)}
              />
              <Label htmlFor="isActive">Active User</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={onCloseEditDialog}>
              Cancel
            </Button>
            <Button onClick={onSaveUser} disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete User Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={onCloseDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this user? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={onCloseDeleteDialog}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={onConfirmDelete} disabled={isDeleting}>
              {isDeleting ? 'Deleting...' : 'Delete User'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
