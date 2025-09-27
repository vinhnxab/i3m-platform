import { Card, CardContent, CardDescription, CardHeader, CardTitle, Button, Badge, Avatar } from '@/shared/components/ui';
import { Search, Filter, MoreHorizontal, Eye, Edit, UserX } from 'lucide-react';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'user' | 'viewer';
  status: 'active' | 'inactive' | 'pending';
  avatar?: string;
  lastLogin: string;
  joinedAt: string;
  permissions: string[];
  department?: string;
  phone?: string;
}

interface TeamMembersListProps {
  members: TeamMember[];
  onViewMember?: (member: TeamMember) => void;
  onEditMember?: (member: TeamMember) => void;
  onRemoveMember?: (member: TeamMember) => void;
  className?: string;
}

export function TeamMembersList({ 
  members, 
  onViewMember, 
  onEditMember, 
  onRemoveMember,
  className = "" 
}: TeamMembersListProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'manager': return 'bg-blue-100 text-blue-800';
      case 'user': return 'bg-green-100 text-green-800';
      case 'viewer': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Team Members</CardTitle>
            <CardDescription>Manage your team members and their access</CardDescription>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {members.map((member) => (
            <div key={member.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
              <div className="flex items-center space-x-4">
                <Avatar className="w-10 h-10">
                  <div className="w-full h-full bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-sm font-semibold text-primary">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                </Avatar>
                <div>
                  <h3 className="font-semibold">{member.name}</h3>
                  <p className="text-sm text-muted-foreground">{member.email}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <Badge className={getStatusColor(member.status)}>
                      {member.status}
                    </Badge>
                    <Badge className={getRoleColor(member.role)}>
                      {member.role}
                    </Badge>
                    {member.department && (
                      <span className="text-xs text-muted-foreground">
                        {member.department}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">Last login</p>
                <p className="text-xs text-muted-foreground">
                  {new Date(member.lastLogin).toLocaleDateString()}
                </p>
                <p className="text-xs text-muted-foreground">
                  Joined {new Date(member.joinedAt).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" onClick={() => onViewMember?.(member)}>
                  <Eye className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => onEditMember?.(member)}>
                  <Edit className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => onRemoveMember?.(member)}>
                  <UserX className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
