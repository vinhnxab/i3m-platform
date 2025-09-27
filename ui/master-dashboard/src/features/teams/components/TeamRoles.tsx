import { Card, CardContent, CardDescription, CardHeader, CardTitle, Button, Badge } from '@/shared/components/ui';
import { Plus, Edit, Trash2, Users } from 'lucide-react';

interface TeamRole {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  memberCount: number;
  isDefault: boolean;
}

interface TeamRolesProps {
  roles: TeamRole[];
  className?: string;
}

export function TeamRoles({ roles, className = "" }: TeamRolesProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Team Roles</CardTitle>
            <CardDescription>Manage team roles and their permissions</CardDescription>
          </div>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Role
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {roles.map((role) => (
            <div key={role.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="font-semibold">{role.name}</h3>
                    {role.isDefault && (
                      <Badge variant="secondary">Default</Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{role.description}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-xs text-muted-foreground">
                      {role.memberCount} members
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {role.permissions.length} permissions
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm">
                  <Edit className="w-4 h-4" />
                </Button>
                {!role.isDefault && (
                  <Button variant="ghost" size="sm">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
