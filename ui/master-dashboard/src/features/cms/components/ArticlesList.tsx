import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Button, Badge } from '@/shared/components/ui';
import { Edit, Trash2, Eye, Calendar, User } from 'lucide-react';

interface Article {
  id: number;
  title: string;
  status: 'published' | 'draft' | 'archived';
  author: string;
  publishDate: string;
  views: number;
  category: string;
}

interface ArticlesListProps {
  articles: Article[];
  onEdit?: (article: Article) => void;
  onDelete?: (article: Article) => void;
  onView?: (article: Article) => void;
}

export const ArticlesList: React.FC<ArticlesListProps> = ({
  articles,
  onEdit,
  onDelete,
  onView
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-chart-2';
      case 'draft': return 'bg-chart-3';
      case 'archived': return 'bg-chart-4';
      default: return 'bg-gray-500';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Articles</CardTitle>
        <CardDescription>Manage your content articles</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {articles.map((article) => (
            <div key={article.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className={`w-2 h-2 rounded-full ${getStatusColor(article.status)}`} />
                <div>
                  <p className="font-medium text-sm">{article.title}</p>
                  <p className="text-xs text-muted-foreground">
                    by {article.author} • {article.publishDate} • {article.views} views
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="capitalize">{article.status}</Badge>
                <Badge variant="outline">{article.category}</Badge>
                <div className="flex space-x-1">
                  <Button variant="ghost" size="sm" onClick={() => onView?.(article)}>
                    <Eye className="w-3 h-3" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => onEdit?.(article)}>
                    <Edit className="w-3 h-3" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => onDelete?.(article)}>
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
