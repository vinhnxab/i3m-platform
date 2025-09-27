import React from 'react';
import { PermissionFormField, PermissionButton } from './PermissionAwareComponents';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Textarea } from '@/shared/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { Checkbox } from '@/shared/components/ui/checkbox';
import { Switch } from '@/shared/components/ui/switch';
import { 
  Users, 
  Settings, 
  Shield, 
  Database, 
  Globe, 
  Building,
  UserCheck,
  Mail,
  Phone,
  MapPin
} from 'lucide-react';

export const UserManagementForm: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Users className="w-5 h-5" />
          <span>User Management</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Basic User Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input id="firstName" placeholder="Enter first name" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input id="lastName" placeholder="Enter last name" />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="Enter email address" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" placeholder="Enter phone number" />
        </div>

        {/* Role Management - Only for Platform/Tenant Admins */}
        <PermissionFormField feature="teams">
          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PLATFORM_ADMIN">Platform Administrator</SelectItem>
                <SelectItem value="PLATFORM_USER">Platform User</SelectItem>
                <SelectItem value="TENANT_ADMIN">Tenant Administrator</SelectItem>
                <SelectItem value="TENANT_USER">Tenant User</SelectItem>
                <SelectItem value="MARKETPLACE_DEVELOPER">Developer</SelectItem>
                <SelectItem value="END_CUSTOMER">End Customer</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </PermissionFormField>

        {/* Tenant Assignment - Only for Platform Admins */}
        <PermissionFormField feature="tenants" requireFullAccess>
          <div className="space-y-2">
            <Label htmlFor="tenant">Tenant</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select tenant" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tenant1">Tenant 1</SelectItem>
                <SelectItem value="tenant2">Tenant 2</SelectItem>
                <SelectItem value="tenant3">Tenant 3</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </PermissionFormField>

        {/* Permissions - Only for Admins */}
        <PermissionFormField feature="teams">
          <div className="space-y-4">
            <Label>Permissions</Label>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox id="read" />
                <Label htmlFor="read">Read Access</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="write" />
                <Label htmlFor="write">Write Access</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="delete" />
                <Label htmlFor="delete">Delete Access</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="admin" />
                <Label htmlFor="admin">Admin Access</Label>
              </div>
            </div>
          </div>
        </PermissionFormField>

        {/* Status Management */}
        <div className="flex items-center space-x-2">
          <Switch id="active" />
          <Label htmlFor="active">Active User</Label>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2">
          <PermissionButton feature="teams" variant="default">
            Save User
          </PermissionButton>
          <PermissionButton feature="teams" variant="outline">
            Cancel
          </PermissionButton>
        </div>
      </CardContent>
    </Card>
  );
};

export const SystemSettingsForm: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Settings className="w-5 h-5" />
          <span>System Settings</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* General Settings */}
        <div className="space-y-4">
          <Label className="text-lg font-semibold">General Settings</Label>
          
          <div className="space-y-2">
            <Label htmlFor="siteName">Site Name</Label>
            <Input id="siteName" placeholder="Enter site name" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="siteDescription">Site Description</Label>
            <Textarea id="siteDescription" placeholder="Enter site description" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="timezone">Timezone</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select timezone" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="UTC">UTC</SelectItem>
                <SelectItem value="EST">Eastern Time</SelectItem>
                <SelectItem value="PST">Pacific Time</SelectItem>
                <SelectItem value="GMT">Greenwich Mean Time</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Security Settings - Only for Security Access */}
        <PermissionFormField feature="security">
          <div className="space-y-4">
            <Label className="text-lg font-semibold">Security Settings</Label>
            
            <div className="flex items-center space-x-2">
              <Switch id="twoFactor" />
              <Label htmlFor="twoFactor">Enable Two-Factor Authentication</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch id="passwordPolicy" />
              <Label htmlFor="passwordPolicy">Enforce Password Policy</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch id="sessionTimeout" />
              <Label htmlFor="sessionTimeout">Enable Session Timeout</Label>
            </div>
          </div>
        </PermissionFormField>

        {/* API Settings - Only for API Access */}
        <PermissionFormField feature="api">
          <div className="space-y-4">
            <Label className="text-lg font-semibold">API Settings</Label>
            
            <div className="space-y-2">
              <Label htmlFor="apiKey">API Key</Label>
              <Input id="apiKey" placeholder="Enter API key" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="apiRateLimit">Rate Limit</Label>
              <Input id="apiRateLimit" type="number" placeholder="1000" />
            </div>

            <div className="flex items-center space-x-2">
              <Switch id="apiLogging" />
              <Label htmlFor="apiLogging">Enable API Logging</Label>
            </div>
          </div>
        </PermissionFormField>

        {/* Database Settings - Only for Backup Access */}
        <PermissionFormField feature="backup">
          <div className="space-y-4">
            <Label className="text-lg font-semibold">Database Settings</Label>
            
            <div className="space-y-2">
              <Label htmlFor="backupFrequency">Backup Frequency</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="retentionPeriod">Retention Period (days)</Label>
              <Input id="retentionPeriod" type="number" placeholder="30" />
            </div>

            <div className="flex items-center space-x-2">
              <Switch id="autoBackup" />
              <Label htmlFor="autoBackup">Enable Automatic Backup</Label>
            </div>
          </div>
        </PermissionFormField>

        {/* Action Buttons */}
        <div className="flex space-x-2">
          <PermissionButton feature="settings" variant="default">
            Save Settings
          </PermissionButton>
          <PermissionButton feature="settings" variant="outline">
            Reset to Default
          </PermissionButton>
        </div>
      </CardContent>
    </Card>
  );
};

export const CustomerForm: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Users className="w-5 h-5" />
          <span>Customer Information</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Basic Customer Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="customerName">Customer Name</Label>
            <Input id="customerName" placeholder="Enter customer name" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="customerEmail">Email</Label>
            <Input id="customerEmail" type="email" placeholder="Enter email address" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="customerPhone">Phone</Label>
            <Input id="customerPhone" placeholder="Enter phone number" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="customerCompany">Company</Label>
            <Input id="customerCompany" placeholder="Enter company name" />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="customerAddress">Address</Label>
          <Textarea id="customerAddress" placeholder="Enter customer address" />
        </div>

        {/* Customer Status */}
        <div className="space-y-4">
          <Label className="text-lg font-semibold">Customer Status</Label>
          
          <div className="flex items-center space-x-2">
            <Switch id="customerActive" />
            <Label htmlFor="customerActive">Active Customer</Label>
          </div>

          <div className="space-y-2">
            <Label htmlFor="customerTier">Customer Tier</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select tier" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="basic">Basic</SelectItem>
                <SelectItem value="premium">Premium</SelectItem>
                <SelectItem value="enterprise">Enterprise</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2">
          <PermissionButton feature="customers" variant="default">
            Save Customer
          </PermissionButton>
          <PermissionButton feature="customers" variant="outline">
            Cancel
          </PermissionButton>
        </div>
      </CardContent>
    </Card>
  );
};
