import { LucideIcon } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui';

interface PlaceholderPageProps {
  title: string;
  description: string;
  icon: LucideIcon;
  features?: string[];
}

export function PlaceholderPage({ title, description, icon: Icon, features = [] }: PlaceholderPageProps) {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="text-center py-12">
        <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
          <Icon className="w-12 h-12 text-muted-foreground" />
        </div>
        <h1 className="text-4xl font-bold text-foreground mb-4">{title}</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">{description}</p>
      </div>

      {/* Features Preview */}
      {features.length > 0 && (
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-semibold text-center mb-8">Coming Soon Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="text-center">
                <CardHeader>
                  <CardTitle className="text-lg">{feature}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    This feature will be available in the next update.
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Status */}
      <div className="text-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="pt-6">
            <div className="flex items-center justify-center space-x-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-muted-foreground">In Development</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
