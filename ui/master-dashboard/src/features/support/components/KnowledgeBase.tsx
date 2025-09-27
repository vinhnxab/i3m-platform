import { Card, CardContent, CardDescription, CardHeader, CardTitle, Button } from '@/shared/components/ui';
import { Badge } from '@/shared/components/ui';
import { BookOpen, Search, Plus, Eye, ThumbsUp } from 'lucide-react';

interface KnowledgeArticle {
  id: string;
  title: string;
  category: string;
  tags: string[];
  views: number;
  likes: number;
  lastUpdated: string;
  status: 'published' | 'draft' | 'archived';
}

interface KnowledgeBaseProps {
  articles: KnowledgeArticle[];
  onViewArticle?: (article: KnowledgeArticle) => void;
  onCreateArticle?: () => void;
  onSearch?: () => void;
  className?: string;
}

export function KnowledgeBase({ 
  articles, 
  onViewArticle, 
  onCreateArticle, 
  onSearch,
  className = ""
}: KnowledgeBaseProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      case 'archived':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Knowledge Base</CardTitle>
            <CardDescription>Manage help articles and documentation</CardDescription>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={onSearch}>
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
            <Button size="sm" onClick={onCreateArticle}>
              <Plus className="w-4 h-4 mr-2" />
              New Article
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {articles.map((article) => (
            <div key={article.id} className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h4 className="font-medium">{article.title}</h4>
                    <Badge variant="outline" className={getStatusColor(article.status)}>
                      {article.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{article.category}</p>
                  <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                    <span>Updated: {article.lastUpdated}</span>
                    <div className="flex items-center space-x-1">
                      <Eye className="w-3 h-3" />
                      <span>{article.views}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <ThumbsUp className="w-3 h-3" />
                      <span>{article.likes}</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {article.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={() => onViewArticle?.(article)}>
                View
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
