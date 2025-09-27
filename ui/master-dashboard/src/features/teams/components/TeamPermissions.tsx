import { Card, CardContent, CardDescription, CardHeader, CardTitle, Switch, Label } from '@/shared/components/ui';

interface TeamPermission {
  id: string;
  name: string;
  description: string;
  category: string;
  enabled: boolean;
}

interface TeamPermissionsProps {
  permissions: TeamPermission[];
  className?: string;
}

export function TeamPermissions({ permissions, className = "" }: TeamPermissionsProps) {
  const groupedPermissions = permissions.reduce((acc, permission) => {
    if (!acc[permission.category]) {
      acc[permission.category] = [];
    }
    acc[permission.category].push(permission);
    return acc;
  }, {} as Record<string, TeamPermission[]>);

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Team Permissions</CardTitle>
        <CardDescription>Configure team permissions and access levels</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {Object.entries(groupedPermissions).map(([category, categoryPermissions]) => (
            <div key={category}>
              <h3 className="text-lg font-semibold mb-4">{category}</h3>
              <div className="space-y-4">
                {categoryPermissions.map((permission) => (
                  <div key={permission.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <Label htmlFor={permission.id} className="text-base font-medium">
                        {permission.name}
                      </Label>
                      <p className="text-sm text-muted-foreground mt-1">
                        {permission.description}
                      </p>
                    </div>
                    <Switch 
                      id={permission.id} 
                      checked={permission.enabled}
                      onCheckedChange={(checked) => {
                        // Handle permission toggle
                        console.log(`Permission ${permission.id} toggled to ${checked}`);
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
