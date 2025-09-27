import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Button, Badge } from "@/shared/components/ui";
import { 
  Play, 
  Pause, 
  Square,
  GitBranch,
  Clock,
  CheckCircle,
  Edit,
  Eye,
  MoreHorizontal,
  ArrowRight,
} from "lucide-react";
import { Workflow } from "./types";
import { WORKFLOW_STATUS_COLORS } from "./constants";

interface WorkflowCardProps {
  workflow: Workflow;
  onEdit: (workflow: Workflow) => void;
  onView: (workflow: Workflow) => void;
  onToggleStatus: (workflow: Workflow) => void;
}

const WorkflowCard: React.FC<WorkflowCardProps> = ({
  workflow,
  onEdit,
  onView,
  onToggleStatus,
}) => {
  const statusConfig = WORKFLOW_STATUS_COLORS[workflow.status];

  const getStatusIcon = () => {
    switch (workflow.status) {
      case 'active':
        return <Play className="w-4 h-4" />;
      case 'paused':
        return <Pause className="w-4 h-4" />;
      case 'scheduled':
        return <Clock className="w-4 h-4" />;
      default:
        return <Square className="w-4 h-4" />;
    }
  };

  const getStatusText = () => {
    switch (workflow.status) {
      case 'active':
        return 'Active';
      case 'paused':
        return 'Paused';
      case 'scheduled':
        return 'Scheduled';
      default:
        return 'Draft';
    }
  };

  return (
    <Card className="border-0 shadow-lg bg-card/90 backdrop-blur-xl rounded-2xl hover:shadow-xl transition-all duration-200">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg font-semibold text-foreground mb-2">
              {workflow.name}
            </CardTitle>
            <CardDescription className="text-sm text-muted-foreground mb-3">
              {workflow.description}
            </CardDescription>
            <div className="flex items-center space-x-2 mb-3">
              <Badge 
                variant="outline"
                className={`rounded-full font-semibold px-3 py-1 ${statusConfig.badge}`}
              >
                <div className={`w-2 h-2 rounded-full ${statusConfig.dot} mr-2`} />
                {getStatusText()}
              </Badge>
              <Badge variant="outline" className="rounded-full text-xs">
                {workflow.category}
              </Badge>
            </div>
          </div>
          <div className="flex items-center space-x-1 ml-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onView(workflow)}
              className="h-8 w-8 p-0"
            >
              <Eye className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(workflow)}
              className="h-8 w-8 p-0"
            >
              <Edit className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
            >
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {/* Trigger Info */}
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <GitBranch className="w-4 h-4" />
            <span>Trigger: {workflow.trigger}</span>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-lg font-semibold text-foreground">{workflow.executions}</div>
              <div className="text-xs text-muted-foreground">Executions</div>
            </div>
            <div>
              <div className="text-lg font-semibold text-foreground">{workflow.successRate}%</div>
              <div className="text-xs text-muted-foreground">Success Rate</div>
            </div>
            <div>
              <div className="text-lg font-semibold text-foreground">{workflow.avgTime}</div>
              <div className="text-xs text-muted-foreground">Avg Time</div>
            </div>
          </div>

          {/* Last Run */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2 text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>Last run: {workflow.lastRun}</span>
            </div>
            <div className="flex items-center space-x-1 text-muted-foreground">
              <span>{workflow.steps} steps</span>
              <ArrowRight className="w-3 h-3" />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2 pt-2">
            <Button
              variant={workflow.status === 'active' ? 'secondary' : 'default'}
              size="sm"
              onClick={() => onToggleStatus(workflow)}
              className="flex-1"
            >
              {getStatusIcon()}
              <span className="ml-2">
                {workflow.status === 'active' ? 'Pause' : 'Start'}
              </span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onView(workflow)}
              className="flex-1"
            >
              <Eye className="w-4 h-4 mr-2" />
              View Details
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WorkflowCard;
