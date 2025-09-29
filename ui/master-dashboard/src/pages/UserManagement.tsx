import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { toast } from 'sonner';
import { User, userService } from '@/services/userService';
import { usePermissions, PERMISSION_LEVELS } from '../hooks/usePermissions';
import { Plus, RefreshCcw } from 'lucide-react';
import { AuthLayout } from '@/shared/components/layout/AuthLayout';
import { UserTable, UserFilters, UserStats, UserDialogs, CreateUserDialog } from '@/features/users';

const UserManagement: React.FC = () => {
  const { isAuthenticated, getPermissionLevel } = usePermissions();
  const [users, setUsers] = useState<User[]>([]);
  const [usersLoaded, setUsersLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [tenantFilter, setTenantFilter] = useState('all');

  // Dialog states
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Form states
  const [userForm, setUserForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    username: '',
    role: '',
    department: '',
    isActive: true,
    website: '',
  });

  const [newUserData, setNewUserData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    username: '',
    password: '',
    role: '',
    department: '',
    isActive: true,
  });

  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Load users
  const loadUsers = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const usersData = await userService.getUsers();
      setUsers(usersData || []);
      setUsersLoaded(true);
    } catch (err) {
      setError('Failed to load users');
      console.error('Error loading users:', err);
      setUsers([]);
      setUsersLoaded(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadUsers();
    }
  }, [isAuthenticated]);

  // Get unique tenants for filter
  const tenants = usersLoaded ? Array.from(new Set(users.map(user => (user as any).tenantId).filter(Boolean))) as string[] : [];

  // Filter users
  const filteredUsers = usersLoaded ? users.filter(user => {
      const matchesSearch = 
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ((user as any).username && (user as any).username.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'active' && user.isActive) ||
      (statusFilter === 'inactive' && !user.isActive);
    const matchesTenant = tenantFilter === 'all' || (user as any).tenantId === tenantFilter;

    return matchesSearch && matchesRole && matchesStatus && matchesTenant;
  }) : [];

  // Calculate stats
  const totalUsers = usersLoaded ? users.length : 0;
  const activeUsers = usersLoaded ? users.filter(user => user.isActive).length : 0;
  const inactiveUsers = usersLoaded ? users.filter(user => !user.isActive).length : 0;

  // Event handlers
  const handleViewUser = (user: User) => {
    setSelectedUser(user);
    setIsViewDialogOpen(true);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setUserForm({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      username: user.username,
      role: user.role,
      department: user.department || '',
      isActive: user.isActive,
      website: '',
    });
    setIsEditDialogOpen(true);
  };

  const handleDeleteUser = (userId: string) => {
    if (!usersLoaded) return;
    const user = users.find(u => u.id === userId);
    if (user) {
      setSelectedUser(user);
      setIsDeleteDialogOpen(true);
    }
  };

  const handleToggleStatus = async (userId: string) => {
    if (!usersLoaded) {
      console.warn('Users not loaded yet');
      return;
    }
    try {
      setIsLoading(true);
      setError(null);
      const user = users.find(u => u.id === userId);
      if (user) {
        console.log('Toggling user status:', { userId, currentStatus: user.isActive });
        const updatedUser = await userService.toggleUserStatus(userId, !user.isActive);
        console.log('Updated user:', updatedUser);
        setUsers(prevUsers => prevUsers.map(u => u.id === userId ? updatedUser : u));
        toast.success(`User ${updatedUser.isActive ? 'activated' : 'deactivated'} successfully`);
      } else {
        console.error('User not found:', userId);
        toast.error('User not found');
      }
    } catch (err) {
      setError('Failed to toggle user status');
      console.error('Error toggling user status:', err);
      toast.error('Failed to toggle user status');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormChange = (field: string, value: string | boolean) => {
    setUserForm(prev => ({ ...prev, [field]: value }));
  };

  const handleNewUserFormChange = (field: string, value: string | boolean) => {
    setNewUserData(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveUser = async () => {
    try {
      setIsSaving(true);
      const updateData = {
        firstName: userForm.firstName,
        lastName: userForm.lastName,
        email: userForm.email,
        username: userForm.username,
        role: userForm.role,
        department: userForm.department || undefined,
        isActive: userForm.isActive,
        website: userForm.website || undefined
      };
      
      const updatedUser = await userService.updateUser(selectedUser!.id, updateData);
      setUsers(prevUsers => prevUsers.map(user => user.id === selectedUser!.id ? updatedUser : user));
      setSelectedUser(null);
      setIsEditDialogOpen(false);
      toast.success('User updated successfully');
    } catch (err) {
      setError('Failed to update user');
      console.error('Error updating user:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCreateUser = async () => {
    try {
      setIsSaving(true);
      const userData = {
        firstName: newUserData.firstName,
        lastName: newUserData.lastName,
        email: newUserData.email,
        username: newUserData.username,
        password: newUserData.password,
        role: newUserData.role,
        department: newUserData.department || undefined,
        isActive: newUserData.isActive,
      };

      const newUser = await userService.createUser(userData);
      setUsers(users => [...users, newUser]);
      setIsCreateDialogOpen(false);
      setNewUserData({
        firstName: '',
        lastName: '',
        email: '',
        username: '',
        password: '',
        role: '',
        department: '',
        isActive: true,
      });
      toast.success('User created successfully');
    } catch (err) {
      setError('Failed to create user');
      console.error('Error creating user:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleConfirmDelete = async () => {
    try {
      setIsDeleting(true);
      await userService.deleteUser(selectedUser!.id);
      setUsers(prevUsers => prevUsers.filter(user => user.id !== selectedUser!.id));
      setIsDeleteDialogOpen(false);
      setSelectedUser(null);
      toast.success('User deleted successfully');
    } catch (err) {
      setError('Failed to delete user');
      console.error('Error deleting user:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setRoleFilter('all');
    setStatusFilter('all');
    setTenantFilter('all');
  };

  if (!isAuthenticated) {
    return (
      <AuthLayout>
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Please log in to access user management.</p>
        </div>
      </AuthLayout>
    );
  }

  const userPermissionLevel = getPermissionLevel('users');
  if (userPermissionLevel === PERMISSION_LEVELS.NONE) {
    return (
      <AuthLayout>
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">You don't have permission to access user management.</p>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
            <p className="text-muted-foreground">
              Manage users, roles, and permissions across the platform.
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              onClick={loadUsers}
              disabled={isLoading}
            >
              <RefreshCcw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            {userPermissionLevel !== PERMISSION_LEVELS.NONE && (
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add User
              </Button>
            )}
          </div>
        </div>

        {/* Stats */}
        <UserStats
          totalUsers={totalUsers}
          activeUsers={activeUsers}
          inactiveUsers={inactiveUsers}
          isLoading={isLoading}
        />

        {/* Filters */}
        <UserFilters
          searchTerm={searchTerm}
          roleFilter={roleFilter}
          statusFilter={statusFilter}
          tenantFilter={tenantFilter}
          tenants={tenants}
          onSearchChange={setSearchTerm}
          onRoleFilterChange={setRoleFilter}
          onStatusFilterChange={setStatusFilter}
          onTenantFilterChange={setTenantFilter}
          onClearFilters={handleClearFilters}
        />

        {/* Users Table */}
        <Card>
          <CardHeader>
            <CardTitle>Users ({filteredUsers.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {!usersLoaded ? (
              <div className="flex items-center justify-center h-32">
                <div className="text-muted-foreground">Loading users...</div>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center h-32">
                <div className="text-red-600">{error}</div>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="flex items-center justify-center h-32">
                <div className="text-muted-foreground">No users found</div>
              </div>
            ) : (
              <UserTable
                users={filteredUsers as any}
                onViewUser={handleViewUser as any}
                onEditUser={handleEditUser as any}
                onDeleteUser={handleDeleteUser}
                onToggleStatus={handleToggleStatus}
              />
            )}
          </CardContent>
        </Card>

        {/* Dialogs */}
        <UserDialogs
          selectedUser={selectedUser as any}
          isViewDialogOpen={isViewDialogOpen}
          onCloseViewDialog={() => setIsViewDialogOpen(false)}
          isEditDialogOpen={isEditDialogOpen}
          onCloseEditDialog={() => setIsEditDialogOpen(false)}
          userForm={userForm}
          onFormChange={handleFormChange}
          onSaveUser={handleSaveUser}
          isSaving={isSaving}
          isDeleteDialogOpen={isDeleteDialogOpen}
          onCloseDeleteDialog={() => setIsDeleteDialogOpen(false)}
          onConfirmDelete={handleConfirmDelete}
          isDeleting={isDeleting}
        />

        <CreateUserDialog
          isOpen={isCreateDialogOpen}
          onClose={() => setIsCreateDialogOpen(false)}
          newUserData={newUserData}
          onFormChange={handleNewUserFormChange}
          onSave={handleCreateUser}
          isSaving={isSaving}
          tenants={tenants}
        />
      </div>
    </AuthLayout>
  );
};

export default UserManagement;
