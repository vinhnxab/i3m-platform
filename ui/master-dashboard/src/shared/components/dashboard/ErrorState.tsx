import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui';
import { AlertCircle } from 'lucide-react';

interface ErrorStateProps {
  title?: string;
  message: string;
  className?: string;
}

export function ErrorState({ 
  title = "Error Loading Dashboard",
  message,
  className = ""
}: ErrorStateProps) {
  return (
    <div className={`w-full px-4 lg:px-6 py-4 lg:py-6 flex items-center justify-center min-h-[400px] ${className}`}>
      <Card className="max-w-md">
        <CardHeader>
          <CardTitle className="text-destructive flex items-center space-x-2">
            <AlertCircle className="w-5 h-5" />
            <span>{title}</span>
          </CardTitle>
          <CardDescription>{message}</CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
