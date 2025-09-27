import { Card, CardContent, CardDescription, CardHeader, CardTitle, Button, Input, Label, Switch } from '@/shared/components/ui';

export function TenantSettings({ className = "" }: { className?: string }) {
  return (
    <div className={`space-y-6 ${className}`}>
      {/* General Settings */}
      <Card>
        <CardHeader>
          <CardTitle>General Settings</CardTitle>
          <CardDescription>Basic tenant configuration</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="tenant-name">Tenant Name</Label>
            <Input id="tenant-name" placeholder="Enter tenant name" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tenant-domain">Domain</Label>
            <Input id="tenant-domain" placeholder="tenant.i3m.com" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tenant-owner">Owner Email</Label>
            <Input id="tenant-owner" type="email" placeholder="owner@company.com" />
          </div>
        </CardContent>
      </Card>

      {/* Feature Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Feature Settings</CardTitle>
          <CardDescription>Enable or disable platform features</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="erp-enabled">ERP Management</Label>
              <p className="text-sm text-muted-foreground">Enterprise Resource Planning</p>
            </div>
            <Switch id="erp-enabled" />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="ecommerce-enabled">E-commerce</Label>
              <p className="text-sm text-muted-foreground">Online store management</p>
            </div>
            <Switch id="ecommerce-enabled" />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="cms-enabled">CMS</Label>
              <p className="text-sm text-muted-foreground">Content Management System</p>
            </div>
            <Switch id="cms-enabled" />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="analytics-enabled">Analytics</Label>
              <p className="text-sm text-muted-foreground">Data analytics and reporting</p>
            </div>
            <Switch id="analytics-enabled" />
          </div>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Security Settings</CardTitle>
          <CardDescription>Tenant security configuration</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="2fa-enabled">Two-Factor Authentication</Label>
              <p className="text-sm text-muted-foreground">Require 2FA for all users</p>
            </div>
            <Switch id="2fa-enabled" />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="sso-enabled">Single Sign-On</Label>
              <p className="text-sm text-muted-foreground">Enable SSO integration</p>
            </div>
            <Switch id="sso-enabled" />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="audit-enabled">Audit Logging</Label>
              <p className="text-sm text-muted-foreground">Log all user activities</p>
            </div>
            <Switch id="audit-enabled" />
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-end space-x-2">
        <Button variant="outline">Cancel</Button>
        <Button>Save Changes</Button>
      </div>
    </div>
  );
}
