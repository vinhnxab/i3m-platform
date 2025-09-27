import { Card, CardContent, CardDescription, CardHeader, CardTitle, Button } from '@/shared/components/ui';
import { UserPlus, Search, Filter, Download } from 'lucide-react';

interface TeamHeaderProps {
  onInviteMember?: () => void;
  onSearch?: () => void;
  onFilter?: () => void;
  onExport?: () => void;
  className?: string;
}

export function TeamHeader({ 
  onInviteMember, 
  onSearch, 
  onFilter, 
  onExport,
  className = "" 
}: TeamHeaderProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center space-x-2">
              <span>Team Management</span>
            </CardTitle>
            <CardDescription>
              Manage team members, roles, and permissions
            </CardDescription>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={onSearch}>
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
            <Button variant="outline" size="sm" onClick={onFilter}>
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
            <Button variant="outline" size="sm" onClick={onExport}>
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button onClick={onInviteMember}>
              <UserPlus className="w-4 h-4 mr-2" />
              Invite Member
            </Button>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
}
