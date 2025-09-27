import React from 'react';
import { Button } from '@/shared/components/ui';
import { Search, Filter, Settings, Users } from 'lucide-react';

interface LiveChatHeaderProps {
  onSearch?: () => void;
  onFilter?: () => void;
  onSettings?: () => void;
  onViewAgents?: () => void;
}

export const LiveChatHeader: React.FC<LiveChatHeaderProps> = ({
  onSearch,
  onFilter,
  onSettings,
  onViewAgents
}) => {
  return (
    <div className="flex items-center justify-between p-4 border-b border-border">
      <div className="flex items-center space-x-4">
        <h1 className="text-lg font-semibold">Live Chat</h1>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" onClick={onSearch}>
            <Search className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={onFilter}>
            <Filter className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={onSettings}>
            <Settings className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={onViewAgents}>
            <Users className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
