import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Button, Badge } from '@/shared/components/ui';
import { Palette, Eye, Download, Check } from 'lucide-react';

interface Theme {
  id: number;
  name: string;
  description: string;
  version: string;
  isActive: boolean;
  author: string;
  lastUpdated: string;
}

interface ThemesListProps {
  themes: Theme[];
  onPreview?: (theme: Theme) => void;
  onActivate?: (theme: Theme) => void;
  onDownload?: (theme: Theme) => void;
}

export const ThemesList: React.FC<ThemesListProps> = ({
  themes,
  onPreview,
  onActivate,
  onDownload
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Available Themes</CardTitle>
        <CardDescription>Manage your website themes and templates</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {themes.map((theme) => (
            <div key={theme.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <Palette className="w-4 h-4" />
                  <h3 className="font-medium">{theme.name}</h3>
                  {theme.isActive && (
                    <Badge className="bg-chart-2">
                      <Check className="w-3 h-3 mr-1" />
                      Active
                    </Badge>
                  )}
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-2">{theme.description}</p>
              <div className="text-xs text-muted-foreground mb-3">
                v{theme.version} • by {theme.author} • {theme.lastUpdated}
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" onClick={() => onPreview?.(theme)}>
                  <Eye className="w-3 h-3 mr-1" />
                  Preview
                </Button>
                {!theme.isActive && (
                  <Button size="sm" onClick={() => onActivate?.(theme)}>
                    Activate
                  </Button>
                )}
                <Button variant="ghost" size="sm" onClick={() => onDownload?.(theme)}>
                  <Download className="w-3 h-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
