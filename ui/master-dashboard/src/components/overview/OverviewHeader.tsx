import React from "react";
import { Badge } from "@/shared/components/ui";
import { CheckCircle } from "lucide-react";

interface OverviewHeaderProps {
  title?: string;
  description?: string;
  isSystemOperational?: boolean;
}

const OverviewHeader: React.FC<OverviewHeaderProps> = ({
  title = "I3M Platform Overview",
  description = "Comprehensive enterprise management dashboard",
  isSystemOperational = true,
}) => {
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
        <Badge 
          variant="outline" 
          className={`border-current backdrop-blur-sm px-3 lg:px-4 py-1.5 lg:py-2 rounded-full font-semibold text-sm ${
            isSystemOperational 
              ? "text-chart-2 bg-chart-2/10" 
              : "text-red-500 bg-red-500/10"
          }`}
        >
          <CheckCircle className="w-3 lg:w-4 h-3 lg:h-4 mr-1 lg:mr-2" />
          {isSystemOperational ? "All Systems Operational" : "System Issues"}
        </Badge>
      </div>
    </div>
  );
};

export default OverviewHeader;
