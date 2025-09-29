import React from 'react';
import { usePermissions } from '../../hooks/usePermissions';
import { useRole } from '../../hooks/usePermissions';

/**
 * Demo component showing multi-group user capabilities
 * This demonstrates how users can have multiple group memberships with different roles
 */
export const MultiGroupUserDemo: React.FC = () => {
  const { 
    getUserGroups, 
    isMultiGroupUser, 
    hasGroupRole, 
    getHighestPermissionLevel,
    hasPermission 
  } = usePermissions();
  
  const { 
    isDeveloper, 
    isManagementAdmin, 
    isERPFinanceManager,
    isERPCustomerServiceManager 
  } = useRole();

  const userGroups = getUserGroups();
  const isMultiGroup = isMultiGroupUser();

  if (!isMultiGroup) {
    return (
      <div className="p-4 bg-blue-50 rounded-lg">
        <h3 className="text-lg font-semibold text-blue-800 mb-2">Single Group User</h3>
        <p className="text-blue-600">This user belongs to one group only.</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200">
      <div className="mb-4">
        <h3 className="text-xl font-bold text-purple-800 mb-2">
          🎭 Multi-Group User Profile
        </h3>
        <p className="text-purple-600">
          This user has multiple group memberships with different roles and permissions.
        </p>
      </div>

      {/* User Groups */}
      <div className="mb-6">
        <h4 className="text-lg font-semibold text-gray-800 mb-3">Group Memberships:</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {userGroups.map((group, index) => (
            <div key={index} className="bg-white p-4 rounded-lg shadow-sm border">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-gray-800">{group.groupName}</span>
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded">
                  {group.role}
                </span>
              </div>
              <div className="text-sm text-gray-600">
                <strong>Permissions:</strong> {Object.keys(group.permissions || {}).length} permissions
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Role Capabilities */}
      <div className="mb-6">
        <h4 className="text-lg font-semibold text-gray-800 mb-3">Role Capabilities:</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className={`p-3 rounded-lg text-center ${isDeveloper() ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-500'}`}>
            <div className="font-medium">Developer</div>
            <div className="text-sm">{isDeveloper() ? '✅' : '❌'}</div>
          </div>
          <div className={`p-3 rounded-lg text-center ${isDeveloper() ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-500'}`}>
            <div className="font-medium">Marketplace Dev</div>
            <div className="text-sm">{isDeveloper() ? '✅' : '❌'}</div>
          </div>
          <div className={`p-3 rounded-lg text-center ${isManagementAdmin() ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-500'}`}>
            <div className="font-medium">Management Admin</div>
            <div className="text-sm">{isManagementAdmin() ? '✅' : '❌'}</div>
          </div>
          <div className={`p-3 rounded-lg text-center ${isERPFinanceManager() ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-500'}`}>
            <div className="font-medium">Finance Manager</div>
            <div className="text-sm">{isERPFinanceManager() ? '✅' : '❌'}</div>
          </div>
          <div className={`p-3 rounded-lg text-center ${isERPCustomerServiceManager() ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-500'}`}>
            <div className="font-medium">Customer Service</div>
            <div className="text-sm">{isERPCustomerServiceManager() ? '✅' : '❌'}</div>
          </div>
        </div>
      </div>

      {/* Permission Levels */}
      <div className="mb-6">
        <h4 className="text-lg font-semibold text-gray-800 mb-3">Permission Levels:</h4>
        <div className="space-y-2">
          {['analytics', 'users', 'groups', 'tenants'].map(feature => (
            <div key={feature} className="flex items-center justify-between p-3 bg-white rounded-lg">
              <span className="font-medium capitalize">{feature}</span>
              <span className={`px-3 py-1 rounded text-sm ${
                getHighestPermissionLevel(feature as any) === 'full' 
                  ? 'bg-green-100 text-green-800' 
                  : getHighestPermissionLevel(feature as any) === 'limited'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-gray-100 text-gray-500'
              }`}>
                {getHighestPermissionLevel(feature as any)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Group Role Checks */}
      <div className="mb-6">
        <h4 className="text-lg font-semibold text-gray-800 mb-3">Group Role Checks:</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-3 bg-white rounded-lg">
            <div className="font-medium mb-2">Marketplace Developer Check:</div>
            <div className="text-sm">
              {hasGroupRole('marketplace', 'developer') ? (
                <span className="text-green-600">✅ Has developer role in marketplace group</span>
              ) : (
                <span className="text-gray-500">❌ No developer role in marketplace group</span>
              )}
            </div>
          </div>
          <div className="p-3 bg-white rounded-lg">
            <div className="font-medium mb-2">Management User Check:</div>
            <div className="text-sm">
              {hasGroupRole('management', 'admin') || hasGroupRole('management', 'user') ? (
                <span className="text-green-600">✅ Has role in management group</span>
              ) : (
                <span className="text-gray-500">❌ No role in management group</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Benefits of Multi-Group */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <h4 className="text-lg font-semibold text-blue-800 mb-2">Multi-Group Benefits:</h4>
        <ul className="text-blue-700 space-y-1">
          <li>• Access to multiple department permissions</li>
          <li>• Can switch between different role contexts</li>
          <li>• Highest permission level is automatically granted</li>
          <li>• Flexible access control based on current task</li>
        </ul>
      </div>
    </div>
  );
};

export default MultiGroupUserDemo;
