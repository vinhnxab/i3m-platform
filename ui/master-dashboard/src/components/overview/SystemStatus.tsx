import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Badge } from "@/shared/components/ui";
import { Zap } from "lucide-react";
import { SystemService } from "./types";
import { STATUS_COLORS } from "./constants";

interface SystemStatusProps {
  services: SystemService[];
}

const SystemStatus: React.FC<SystemStatusProps> = ({ services }) => {
  return (
    <Card className="border-0 shadow-lg bg-card/90 backdrop-blur-xl rounded-2xl">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center text-xl font-semibold text-foreground">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center mr-3">
            <Zap className="w-5 h-5 text-primary" />
          </div>
          System Status
        </CardTitle>
        <CardDescription className="text-base font-medium text-muted-foreground">
          Real-time status of all microservices
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {services.map((service, index) => {
            const statusConfig = STATUS_COLORS[service.status];
            
            return (
              <div 
                key={index} 
                className="flex items-center justify-between p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors duration-200"
              >
                <div className="flex items-center space-x-4">
                  <div className={`w-2 h-2 rounded-full ${statusConfig.dot}`} />
                  <span className="text-sm font-medium text-foreground">
                    {service.service}
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-muted-foreground font-medium">
                    {service.uptime}
                  </span>
                  <Badge 
                    variant="outline"
                    className={`rounded-full font-semibold px-3 py-1 ${statusConfig.badge}`}
                  >
                    {service.status === 'operational' ? 'Operational' : 
                     service.status === 'maintenance' ? 'Maintenance' : 'Down'}
                  </Badge>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default SystemStatus;
