import React from 'react';
import { Button } from '@/shared/components/ui';
import { Plus } from 'lucide-react';

interface CMSHeaderProps {
  onNewContent?: () => void;
  onUploadMedia?: () => void;
}

export const CMSHeader: React.FC<CMSHeaderProps> = ({
  onNewContent,
  onUploadMedia
}) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-semibold">CMS Management</h1>
        <p className="text-muted-foreground">Content Management System Dashboard</p>
      </div>
      <div className="flex space-x-2">
        <Button variant="outline" onClick={onNewContent}>
          <Plus className="w-4 h-4 mr-2" />
          New Content
        </Button>
        <Button onClick={onUploadMedia}>
          <Plus className="w-4 h-4 mr-2" />
          Upload Media
        </Button>
      </div>
    </div>
  );
};
