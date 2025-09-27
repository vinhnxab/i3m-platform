import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Button, Badge } from '@/shared/components/ui';
import { Image, File, Download, Trash2, Eye } from 'lucide-react';

interface MediaFile {
  id: number;
  name: string;
  type: 'image' | 'video' | 'document';
  size: string;
  uploadDate: string;
  url: string;
}

interface MediaLibraryProps {
  files: MediaFile[];
  onView?: (file: MediaFile) => void;
  onDownload?: (file: MediaFile) => void;
  onDelete?: (file: MediaFile) => void;
}

export const MediaLibrary: React.FC<MediaLibraryProps> = ({
  files,
  onView,
  onDownload,
  onDelete
}) => {
  const getFileIcon = (type: string) => {
    switch (type) {
      case 'image': return <Image className="w-4 h-4" />;
      case 'video': return <File className="w-4 h-4" />;
      case 'document': return <File className="w-4 h-4" />;
      default: return <File className="w-4 h-4" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Media Library</CardTitle>
        <CardDescription>Manage your media files and assets</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {files.map((file) => (
            <div key={file.id} className="p-3 border rounded-lg hover:shadow-md transition-shadow">
              <div className="flex items-center space-x-2 mb-2">
                {getFileIcon(file.type)}
                <span className="text-sm font-medium truncate">{file.name}</span>
              </div>
              <div className="text-xs text-muted-foreground mb-2">
                {file.size} • {file.uploadDate}
              </div>
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="capitalize">{file.type}</Badge>
                <div className="flex space-x-1">
                  <Button variant="ghost" size="sm" onClick={() => onView?.(file)}>
                    <Eye className="w-3 h-3" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => onDownload?.(file)}>
                    <Download className="w-3 h-3" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => onDelete?.(file)}>
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
