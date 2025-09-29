export interface UserGroup {
  groupId: string;
  groupName: string;
  role: string;
  permissions: Record<string, any>;
  assignedAt: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: 'admin' | 'user' | 'manager' | 'MANAGEMENT_ADMIN' | 'MANAGEMENT_USER' | 'MARKETPLACE_DEVELOPER' | 'TENANT_ADMIN' | 'TENANT_USER' | 'TENANT_CUSTOMER';
  userRoles?: string[];
  userGroups?: UserGroup[];
  tenantId?: string;
  createdAt: string;
  lastLogin?: string;
  isActive: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  updateUser: (user: Partial<User>) => void;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, newPassword: string) => Promise<void>;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
}

export interface PasswordResetData {
  email: string;
}

export interface PasswordChangeData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}
