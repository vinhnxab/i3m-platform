import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui';
import { LoadingState, ErrorState } from '@/shared/components/dashboard';
import { 
  TeamHeader, 
  TeamStats, 
  TeamMembersList,
  TeamRoles,
  TeamPermissions
} from '@/features/teams';
import { useTeam } from '@/features/teams';

export function TeamManagement() {
  const [activeTab, setActiveTab] = useState('members');
  const { teamMembers, stats, roles, permissions, isLoading, error } = useTeam();

  if (isLoading) {
    return <LoadingState message="Loading team data..." />;
  }

  if (error) {
    return <ErrorState message={error} />;
  }

  const handleInviteMember = () => {
    console.log('Inviting new team member...');
  };

  const handleViewMember = (member: any) => {
    console.log('Viewing team member:', member.id);
  };

  const handleEditMember = (member: any) => {
    console.log('Editing team member:', member.id);
  };

  const handleRemoveMember = (member: any) => {
    console.log('Removing team member:', member.id);
  };

  return (
    <div className="w-full px-4 lg:px-6 py-4 lg:py-6 space-y-4 lg:space-y-6">
      {/* Header */}
      <TeamHeader 
        onInviteMember={handleInviteMember}
      />

      {/* Team Stats */}
      <TeamStats stats={stats} />

      {/* Team Modules */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="members">Members</TabsTrigger>
          <TabsTrigger value="roles">Roles</TabsTrigger>
          <TabsTrigger value="permissions">Permissions</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        {/* Members Tab */}
        <TabsContent value="members" className="space-y-6">
          <TeamMembersList 
            members={teamMembers}
            onViewMember={handleViewMember}
            onEditMember={handleEditMember}
            onRemoveMember={handleRemoveMember}
          />
        </TabsContent>

        {/* Roles Tab */}
        <TabsContent value="roles" className="space-y-6">
          <TeamRoles roles={roles} />
        </TabsContent>

        {/* Permissions Tab */}
        <TabsContent value="permissions" className="space-y-6">
          <TeamPermissions permissions={permissions} />
        </TabsContent>

        {/* Activity Tab */}
        <TabsContent value="activity" className="space-y-6">
          <div className="text-center py-12">
            <h3 className="text-lg font-semibold mb-2">Team Activity</h3>
            <p className="text-muted-foreground">Team activity log coming soon...</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
