import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Badge } from "@/shared/components/ui";
import { 
  Clock,
  CheckCircle,
  AlertTriangle,
  Zap,
  RefreshCw,
} from "lucide-react";
import { Execution } from "./types";
import { EXECUTION_STATUS_COLORS } from "./constants";

interface ExecutionHistoryProps {
  executions: Execution[];
}

const ExecutionHistory: React.FC<ExecutionHistoryProps> = ({ executions }) => {
  const getStatusIcon = (status: Execution['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-4 h-4" />;
      case 'failed':
        return <AlertTriangle className="w-4 h-4" />;
      case 'running':
        return <RefreshCw className="w-4 h-4 animate-spin" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusText = (status: Execution['status']) => {
    switch (status) {
      case 'success':
        return 'Success';
      case 'failed':
        return 'Failed';
      case 'running':
        return 'Running';
      default:
        return 'Pending';
    }
  };

  return (
    <Card className="border-0 shadow-lg bg-card/90 backdrop-blur-xl rounded-2xl">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center text-xl font-semibold text-foreground">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center mr-3">
            <Zap className="w-5 h-5 text-primary" />
          </div>
          Recent Executions
        </CardTitle>
        <CardDescription className="text-base font-medium text-muted-foreground">
          Latest workflow execution history
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {executions.map((execution) => {
            const statusConfig = EXECUTION_STATUS_COLORS[execution.status];
            
            return (
              <div 
                key={execution.id} 
                className="flex items-center justify-between p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors duration-200"
              >
                <div className="flex items-center space-x-4 flex-1 min-w-0">
                  <div className={`w-2 h-2 rounded-full ${statusConfig.dot}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {execution.workflowName}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Trigger: {execution.trigger}
                    </p>
                    {execution.error && (
                      <p className="text-xs text-red-500 mt-1 truncate">
                        Error: {execution.error}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-3 ml-4">
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">
                      {execution.startTime}
                    </p>
                    {execution.duration && (
                      <p className="text-xs text-muted-foreground">
                        {execution.duration}
                      </p>
                    )}
                  </div>
                  <Badge 
                    variant="outline"
                    className={`rounded-full font-semibold px-3 py-1 ${statusConfig.badge}`}
                  >
                    {getStatusIcon(execution.status)}
                    <span className="ml-1">{getStatusText(execution.status)}</span>
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

export default ExecutionHistory;
