import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({ 
  icon: Icon,
  title,
  description,
  action,
  className = ""
}: EmptyStateProps) {
  return (
    <Card className={`max-w-md mx-auto ${className}`}>
      <CardHeader className="text-center">
        {Icon && <Icon className="w-12 h-12 mx-auto text-muted-foreground mb-4" />}
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      {action && (
        <CardContent className="text-center">
          {action}
        </CardContent>
      )}
    </Card>
  );
}
