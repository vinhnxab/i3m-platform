import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Button, Badge } from '@/shared/components/ui';
import { Edit, Trash2, Plus } from 'lucide-react';

interface Category {
  id: number;
  name: string;
  description: string;
  articleCount: number;
  color: string;
}

interface CategoriesListProps {
  categories: Category[];
  onEdit?: (category: Category) => void;
  onDelete?: (category: Category) => void;
  onAdd?: () => void;
}

export const CategoriesList: React.FC<CategoriesListProps> = ({
  categories,
  onEdit,
  onDelete,
  onAdd
}) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Content Categories</CardTitle>
            <CardDescription>Organize your content by categories</CardDescription>
          </div>
          <Button onClick={onAdd}>
            <Plus className="w-4 h-4 mr-2" />
            Add Category
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category) => (
            <div key={category.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${category.color}`} />
                  <h3 className="font-medium">{category.name}</h3>
                </div>
                <div className="flex space-x-1">
                  <Button variant="ghost" size="sm" onClick={() => onEdit?.(category)}>
                    <Edit className="w-3 h-3" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => onDelete?.(category)}>
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-2">{category.description}</p>
              <Badge variant="outline">{category.articleCount} articles</Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
