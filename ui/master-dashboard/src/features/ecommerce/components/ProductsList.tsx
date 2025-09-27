import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Button, Badge } from '@/shared/components/ui';
import { Package, Eye, Edit, Trash2, Plus } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  price: string;
  stock: number;
  category: string;
  status: 'active' | 'inactive' | 'out-of-stock';
  image: string;
  sales: number;
  rating: number;
}

interface ProductsListProps {
  products: Product[];
  onView?: (product: Product) => void;
  onEdit?: (product: Product) => void;
  onDelete?: (product: Product) => void;
  onAdd?: () => void;
}

export const ProductsList: React.FC<ProductsListProps> = ({
  products,
  onView,
  onEdit,
  onDelete,
  onAdd
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-chart-2';
      case 'inactive': return 'bg-chart-4';
      case 'out-of-stock': return 'bg-chart-3';
      default: return 'bg-gray-500';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Products</CardTitle>
            <CardDescription>Manage your product catalog</CardDescription>
          </div>
          <Button onClick={onAdd}>
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {products.map((product) => (
            <div key={product.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg hover:shadow-md transition-shadow">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                  <Package className="w-6 h-6 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-medium">{product.name}</p>
                  <p className="text-sm text-muted-foreground">{product.category}</p>
                  <p className="text-xs text-muted-foreground">
                    {product.sales} sales • {product.rating}★ rating
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="font-medium">{product.price}</p>
                  <p className="text-sm text-muted-foreground">{product.stock} in stock</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="capitalize">{product.status}</Badge>
                  <div className="flex space-x-1">
                    <Button variant="ghost" size="sm" onClick={() => onView?.(product)}>
                      <Eye className="w-3 h-3" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => onEdit?.(product)}>
                      <Edit className="w-3 h-3" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => onDelete?.(product)}>
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
