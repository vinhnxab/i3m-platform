/**
 * ERP Department Role Functions
 * Comprehensive role checking for ERP system departments
 */

export interface ERPRoleContext {
  user: {
    role: string;
    userRoles?: string[];
    userGroups?: Array<{
      groupId: string;
      groupName: string;
      role: string;
      permissions: Record<string, any>;
      assignedAt: string;
    }>;
    tenantId?: string;
  } | null;
  hasRole: (role: string) => boolean;
  hasAnyRole: (roles: string[]) => boolean;
}

/**
 * Basic ERP Department Role Functions
 */
export const createBasicERPRoles = ({ user, hasRole, hasAnyRole }: ERPRoleContext) => {
  const isERPAdmin = (): boolean => {
    // Check groups first - MANAGEMENT_USERS or TENANT_USERS with admin role
    if (user?.userGroups) {
      return user.userGroups.some(group => 
        (group.groupName.toLowerCase().includes('management') || 
         group.groupName.toLowerCase().includes('tenant')) &&
        group.role.toLowerCase().includes('admin')
      );
    }
    // Fallback to role check
    // Check userGroups first
    if (user?.userGroups && user.userGroups.length > 0) {
      return user.userGroups.some(group => 
        group.role.toLowerCase().includes('admin') &&
        (group.groupName.toLowerCase().includes('management') || 
         group.groupName.toLowerCase().includes('tenant'))
      );
    }
    
    // Fallback to hasAnyRole
    return hasAnyRole(['MANAGEMENT_ADMIN', 'TENANT_ADMIN']);
  };

  const isERPManager = (): boolean => {
    // Check groups first - MANAGEMENT_USERS or TENANT_USERS with manager role
    if (user?.userGroups) {
      return user.userGroups.some(group => 
        (group.groupName.toLowerCase().includes('management') || 
         group.groupName.toLowerCase().includes('tenant')) &&
        group.role.toLowerCase().includes('manager')
      );
    }
    // Fallback to role check
    return hasRole('MANAGER');
  };

  const isERPUser = (): boolean => {
    // Check groups first - MANAGEMENT_USERS or TENANT_USERS with user role
    if (user?.userGroups) {
      return user.userGroups.some(group => 
        (group.groupName.toLowerCase().includes('management') || 
         group.groupName.toLowerCase().includes('tenant')) &&
        group.role.toLowerCase().includes('user')
      );
    }
    // Fallback to role check
    return hasRole('USER');
  };

  const isERPAuthor = (): boolean => {
    // Check groups first - MANAGEMENT_USERS or TENANT_USERS with author role
    if (user?.userGroups) {
      return user.userGroups.some(group => 
        (group.groupName.toLowerCase().includes('management') || 
         group.groupName.toLowerCase().includes('tenant')) &&
        group.role.toLowerCase().includes('author')
      );
    }
    // Fallback to role check
    return hasRole('AUTHOR');
  };

  const isERPEditor = (): boolean => {
    // Check groups first - MANAGEMENT_USERS or TENANT_USERS with editor role
    if (user?.userGroups) {
      return user.userGroups.some(group => 
        (group.groupName.toLowerCase().includes('management') || 
         group.groupName.toLowerCase().includes('tenant')) &&
        group.role.toLowerCase().includes('editor')
      );
    }
    // Fallback to role check
    return hasRole('EDITOR');
  };

  return {
    isERPAdmin,
    isERPManager,
    isERPUser,
    isERPAuthor,
    isERPEditor
  };
};

/**
 * Comprehensive ERP Department Role Functions
 */
export const createComprehensiveERPRoles = ({ user, hasRole, hasAnyRole }: ERPRoleContext) => {
  // Finance & Accounting
  const isERPFinanceManager = (): boolean => {
    if (user?.userGroups) {
      return user.userGroups.some(group => 
        (group.groupName.toLowerCase().includes('management') || 
         group.groupName.toLowerCase().includes('tenant')) &&
        group.role.toLowerCase().includes('finance') && 
        group.role.toLowerCase().includes('manager')
      );
    }
    return hasRole('FINANCE_MANAGER');
  };

  const isERPFinanceUser = (): boolean => {
    if (user?.userGroups) {
      return user.userGroups.some(group => 
        (group.groupName.toLowerCase().includes('management') || 
         group.groupName.toLowerCase().includes('tenant')) &&
        group.role.toLowerCase().includes('finance') && 
        group.role.toLowerCase().includes('user')
      );
    }
    return hasRole('FINANCE_USER');
  };

  const isERPAccountingManager = (): boolean => {
    if (user?.userGroups) {
      return user.userGroups.some(group => 
        (group.groupName.toLowerCase().includes('management') || 
         group.groupName.toLowerCase().includes('tenant')) &&
        group.role.toLowerCase().includes('accounting') && 
        group.role.toLowerCase().includes('manager')
      );
    }
    return hasRole('ACCOUNTING_MANAGER');
  };

  const isERPAccountingUser = (): boolean => {
    if (user?.userGroups) {
      return user.userGroups.some(group => 
        (group.groupName.toLowerCase().includes('management') || 
         group.groupName.toLowerCase().includes('tenant')) &&
        group.role.toLowerCase().includes('accounting') && 
        group.role.toLowerCase().includes('user')
      );
    }
    return hasRole('ACCOUNTING_USER');
  };

  // Human Resources
  const isERPHumanResourcesManager = (): boolean => {
    if (user?.userGroups) {
      return user.userGroups.some(group => 
        (group.groupName.toLowerCase().includes('management') || 
         group.groupName.toLowerCase().includes('tenant')) &&
        (group.role.toLowerCase().includes('hr') || group.role.toLowerCase().includes('human')) && 
        group.role.toLowerCase().includes('manager')
      );
    }
    return hasRole('HR_MANAGER');
  };

  const isERPHumanResourcesUser = (): boolean => {
    if (user?.userGroups) {
      return user.userGroups.some(group => 
        (group.groupName.toLowerCase().includes('management') || 
         group.groupName.toLowerCase().includes('tenant')) &&
        (group.role.toLowerCase().includes('hr') || group.role.toLowerCase().includes('human')) && 
        group.role.toLowerCase().includes('user')
      );
    }
    return hasRole('HR_USER');
  };

  // Sales & Marketing
  const isERPSalesManager = (): boolean => {
    if (user?.userGroups) {
      return user.userGroups.some(group => 
        (group.groupName.toLowerCase().includes('management') || 
         group.groupName.toLowerCase().includes('tenant')) &&
        group.role.toLowerCase().includes('sales') && 
        group.role.toLowerCase().includes('manager')
      );
    }
    return hasRole('SALES_MANAGER');
  };

  const isERPSalesUser = (): boolean => {
    if (user?.userGroups) {
      return user.userGroups.some(group => 
        (group.groupName.toLowerCase().includes('management') || 
         group.groupName.toLowerCase().includes('tenant')) &&
        group.role.toLowerCase().includes('sales') && 
        group.role.toLowerCase().includes('user')
      );
    }
    return hasRole('SALES_USER');
  };

  const isERPMarketingManager = (): boolean => {
    if (user?.userGroups) {
      return user.userGroups.some(group => 
        (group.groupName.toLowerCase().includes('management') || 
         group.groupName.toLowerCase().includes('tenant')) &&
        group.role.toLowerCase().includes('marketing') && 
        group.role.toLowerCase().includes('manager')
      );
    }
    return hasRole('MARKETING_MANAGER');
  };

  const isERPMarketingUser = (): boolean => {
    if (user?.userGroups) {
      return user.userGroups.some(group => 
        (group.groupName.toLowerCase().includes('management') || 
         group.groupName.toLowerCase().includes('tenant')) &&
        group.role.toLowerCase().includes('marketing') && 
        group.role.toLowerCase().includes('user')
      );
    }
    return hasRole('MARKETING_USER');
  };

  // Operations & Production
  const isERPInventoryManager = (): boolean => {
    if (user?.userGroups) {
      return user.userGroups.some(group => 
        (group.groupName.toLowerCase().includes('management') || 
         group.groupName.toLowerCase().includes('tenant')) &&
        group.role.toLowerCase().includes('inventory') && 
        group.role.toLowerCase().includes('manager')
      );
    }
    return hasRole('INVENTORY_MANAGER');
  };

  const isERPInventoryUser = (): boolean => {
    if (user?.userGroups) {
      return user.userGroups.some(group => 
        (group.groupName.toLowerCase().includes('management') || 
         group.groupName.toLowerCase().includes('tenant')) &&
        group.role.toLowerCase().includes('inventory') && 
        group.role.toLowerCase().includes('user')
      );
    }
    return hasRole('INVENTORY_USER');
  };

  const isERPPurchasingManager = (): boolean => {
    if (user?.userGroups) {
      return user.userGroups.some(group => 
        (group.groupName.toLowerCase().includes('management') || 
         group.groupName.toLowerCase().includes('tenant')) &&
        group.role.toLowerCase().includes('purchasing') && 
        group.role.toLowerCase().includes('manager')
      );
    }
    return hasRole('PURCHASING_MANAGER');
  };

  const isERPPurchasingUser = (): boolean => {
    if (user?.userGroups) {
      return user.userGroups.some(group => 
        (group.groupName.toLowerCase().includes('management') || 
         group.groupName.toLowerCase().includes('tenant')) &&
        group.role.toLowerCase().includes('purchasing') && 
        group.role.toLowerCase().includes('user')
      );
    }
    return hasRole('PURCHASING_USER');
  };

  const isERPProductionManager = (): boolean => {
    if (user?.userGroups) {
      return user.userGroups.some(group => 
        (group.groupName.toLowerCase().includes('management') || 
         group.groupName.toLowerCase().includes('tenant')) &&
        group.role.toLowerCase().includes('production') && 
        group.role.toLowerCase().includes('manager')
      );
    }
    return hasRole('PRODUCTION_MANAGER');
  };

  const isERPProductionUser = (): boolean => {
    if (user?.userGroups) {
      return user.userGroups.some(group => 
        (group.groupName.toLowerCase().includes('management') || 
         group.groupName.toLowerCase().includes('tenant')) &&
        group.role.toLowerCase().includes('production') && 
        group.role.toLowerCase().includes('user')
      );
    }
    return hasRole('PRODUCTION_USER');
  };

  const isERPQualityManager = (): boolean => {
    if (user?.userGroups) {
      return user.userGroups.some(group => 
        (group.groupName.toLowerCase().includes('management') || 
         group.groupName.toLowerCase().includes('tenant')) &&
        group.role.toLowerCase().includes('quality') && 
        group.role.toLowerCase().includes('manager')
      );
    }
    return hasRole('QUALITY_MANAGER');
  };

  const isERPQualityUser = (): boolean => {
    if (user?.userGroups) {
      return user.userGroups.some(group => 
        (group.groupName.toLowerCase().includes('management') || 
         group.groupName.toLowerCase().includes('tenant')) &&
        group.role.toLowerCase().includes('quality') && 
        group.role.toLowerCase().includes('user')
      );
    }
    return hasRole('QUALITY_USER');
  };

  // Technology & Support
  const isERPITManager = (): boolean => {
    if (user?.userGroups) {
      return user.userGroups.some(group => 
        (group.groupName.toLowerCase().includes('management') || 
         group.groupName.toLowerCase().includes('tenant')) &&
        (group.role.toLowerCase().includes('it') || group.role.toLowerCase().includes('information')) && 
        group.role.toLowerCase().includes('manager')
      );
    }
    return hasRole('IT_MANAGER');
  };

  const isERPITUser = (): boolean => {
    if (user?.userGroups) {
      return user.userGroups.some(group => 
        (group.groupName.toLowerCase().includes('management') || 
         group.groupName.toLowerCase().includes('tenant')) &&
        (group.role.toLowerCase().includes('it') || group.role.toLowerCase().includes('information')) && 
        group.role.toLowerCase().includes('user')
      );
    }
    return hasRole('IT_USER');
  };

  const isERPCustomerServiceManager = (): boolean => {
    if (user?.userGroups) {
      return user.userGroups.some(group => 
        (group.groupName.toLowerCase().includes('management') || 
         group.groupName.toLowerCase().includes('tenant')) &&
        (group.role.toLowerCase().includes('customer') || group.role.toLowerCase().includes('service')) && 
        group.role.toLowerCase().includes('manager')
      );
    }
    return hasRole('CUSTOMER_SERVICE_MANAGER');
  };

  const isERPCustomerServiceUser = (): boolean => {
    if (user?.userGroups) {
      return user.userGroups.some(group => 
        (group.groupName.toLowerCase().includes('management') || 
         group.groupName.toLowerCase().includes('tenant')) &&
        (group.role.toLowerCase().includes('customer') || group.role.toLowerCase().includes('service')) && 
        group.role.toLowerCase().includes('user')
      );
    }
    return hasRole('CUSTOMER_SERVICE_USER');
  };

  // Logistics & Legal
  const isERPLogisticsManager = (): boolean => {
    if (user?.userGroups) {
      return user.userGroups.some(group => 
        (group.groupName.toLowerCase().includes('management') || 
         group.groupName.toLowerCase().includes('tenant')) &&
        group.role.toLowerCase().includes('logistics') && 
        group.role.toLowerCase().includes('manager')
      );
    }
    return hasRole('LOGISTICS_MANAGER');
  };

  const isERPLogisticsUser = (): boolean => {
    if (user?.userGroups) {
      return user.userGroups.some(group => 
        (group.groupName.toLowerCase().includes('management') || 
         group.groupName.toLowerCase().includes('tenant')) &&
        group.role.toLowerCase().includes('logistics') && 
        group.role.toLowerCase().includes('user')
      );
    }
    return hasRole('LOGISTICS_USER');
  };

  const isERPLegalManager = (): boolean => {
    if (user?.userGroups) {
      return user.userGroups.some(group => 
        (group.groupName.toLowerCase().includes('management') || 
         group.groupName.toLowerCase().includes('tenant')) &&
        group.role.toLowerCase().includes('legal') && 
        group.role.toLowerCase().includes('manager')
      );
    }
    return hasRole('LEGAL_MANAGER');
  };

  const isERPLegalUser = (): boolean => {
    if (user?.userGroups) {
      return user.userGroups.some(group => 
        (group.groupName.toLowerCase().includes('management') || 
         group.groupName.toLowerCase().includes('tenant')) &&
        group.role.toLowerCase().includes('legal') && 
        group.role.toLowerCase().includes('user')
      );
    }
    return hasRole('LEGAL_USER');
  };

  return {
    // Finance & Accounting
    isERPFinanceManager,
    isERPFinanceUser,
    isERPAccountingManager,
    isERPAccountingUser,
    // Human Resources
    isERPHumanResourcesManager,
    isERPHumanResourcesUser,
    // Sales & Marketing
    isERPSalesManager,
    isERPSalesUser,
    isERPMarketingManager,
    isERPMarketingUser,
    // Operations & Production
    isERPInventoryManager,
    isERPInventoryUser,
    isERPPurchasingManager,
    isERPPurchasingUser,
    isERPProductionManager,
    isERPProductionUser,
    isERPQualityManager,
    isERPQualityUser,
    // Technology & Support
    isERPITManager,
    isERPITUser,
    isERPCustomerServiceManager,
    isERPCustomerServiceUser,
    // Logistics & Legal
    isERPLogisticsManager,
    isERPLogisticsUser,
    isERPLegalManager,
    isERPLegalUser
  };
};

