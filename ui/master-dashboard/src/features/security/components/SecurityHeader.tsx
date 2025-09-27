import { Button, Badge } from '@/shared/components/ui';
import { Shield, CheckCircle, AlertTriangle } from 'lucide-react';

interface SecurityHeaderProps {
  title?: string;
  description?: string;
  showStatus?: boolean;
  statusText?: string;
  onScanNow?: () => void;
  onViewReports?: () => void;
}

export function SecurityHeader({ 
  title = "Security Center",
  description = "Comprehensive security monitoring and management",
  showStatus = true,
  statusText = "Security Status: Good",
  onScanNow,
  onViewReports
}: SecurityHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 gap-2">
      <div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-foreground tracking-tight">
          {title}
        </h1>
        <p className="text-base lg:text-lg text-muted-foreground font-medium mt-1 lg:mt-2">
          {description}
        </p>
      </div>
      <div className="flex items-center space-x-3">
        {showStatus && (
          <Badge variant="outline" className="text-chart-2 border-current bg-chart-2/10 backdrop-blur-sm px-3 lg:px-4 py-1.5 lg:py-2 rounded-full font-semibold text-sm">
            <Shield className="w-3 lg:w-4 h-3 lg:h-4 mr-1 lg:mr-2" />
            {statusText}
          </Badge>
        )}
        <Button variant="outline" onClick={onViewReports}>
          <AlertTriangle className="w-4 h-4 mr-2" />
          View Reports
        </Button>
        <Button onClick={onScanNow}>
          <Shield className="w-4 h-4 mr-2" />
          Scan Now
        </Button>
      </div>
    </div>
  );
}
