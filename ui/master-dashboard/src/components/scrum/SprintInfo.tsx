import React from "react";
import { Play, Pause, CheckCircle, Calendar, Target, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, Progress, Badge } from "@/shared/components/ui";
import { Sprint } from "./types";
import { SPRINT_STATUS } from "./constants";

interface SprintInfoProps {
  sprint: Sprint;
  teamMembers?: number;
  onEditSprint?: () => void;
  showDetails?: boolean;
}

const SprintInfo: React.FC<SprintInfoProps> = ({
  sprint,
  teamMembers = 0,
  onEditSprint,
  showDetails = true,
}) => {
  const sprintProgress = (sprint.completedPoints / sprint.capacity) * 100;
  const daysRemaining = Math.ceil(
    (new Date(sprint.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );
  
  const statusConfig = SPRINT_STATUS[sprint.status];
  const StatusIcon = statusConfig.icon === "Play" ? Play : 
                    statusConfig.icon === "Pause" ? Pause : CheckCircle;

  const getProgressColor = (progress: number) => {
    if (progress >= 100) return "bg-green-500";
    if (progress >= 75) return "bg-blue-500";
    if (progress >= 50) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getDaysRemainingColor = (days: number) => {
    if (days <= 0) return "text-red-500";
    if (days <= 3) return "text-orange-500";
    if (days <= 7) return "text-yellow-500";
    return "text-green-500";
  };

  return (
    <Card className="bg-card/80 backdrop-blur-xl border-0 rounded-2xl shadow-lg flex-shrink-0">
      <CardHeader className="pb-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <CardTitle className="text-foreground truncate">
                {sprint.name}
              </CardTitle>
              <Badge
                variant="outline"
                className={`text-xs px-3 py-1 rounded-full border ${statusConfig.color} flex-shrink-0`}
              >
                <StatusIcon className="w-3 h-3 mr-1" />
                {statusConfig.label}
              </Badge>
            </div>
            <p className="text-muted-foreground text-sm line-clamp-2">
              {sprint.goal}
            </p>
          </div>

          <div className="flex items-center gap-4 flex-shrink-0">
            {/* Sprint Dates */}
            <div className="text-right">
              <div className="flex items-center gap-1 text-sm text-muted-foreground mb-1">
                <Calendar className="w-3 h-3" />
                <span>
                  {new Date(sprint.startDate).toLocaleDateString("vi-VN")} -{" "}
                  {new Date(sprint.endDate).toLocaleDateString("vi-VN")}
                </span>
              </div>
              <div className={`text-sm font-medium ${getDaysRemainingColor(daysRemaining)}`}>
                {daysRemaining > 0 ? `${daysRemaining} ngày còn lại` : "Đã hết hạn"}
              </div>
            </div>

            {/* Team Members */}
            {teamMembers > 0 && (
              <div className="text-right">
                <div className="flex items-center gap-1 text-sm text-muted-foreground mb-1">
                  <Users className="w-3 h-3" />
                  <span>Team</span>
                </div>
                <div className="text-sm font-medium text-foreground">
                  {teamMembers} thành viên
                </div>
              </div>
            )}
          </div>
        </div>
      </CardHeader>

      {showDetails && (
        <CardContent className="pt-0">
          <div className="space-y-4">
            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground flex items-center gap-1">
                  <Target className="w-3 h-3" />
                  Sprint Progress
                </span>
                <span className="font-medium text-foreground">
                  {Math.round(sprintProgress)}%
                </span>
              </div>
              <Progress
                value={sprintProgress}
                className="h-2 bg-muted/30 rounded-full"
              />
            </div>

            {/* Story Points Summary */}
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-muted/20 rounded-xl">
                <div className="text-lg font-semibold text-foreground">
                  {sprint.completedPoints}
                </div>
                <div className="text-xs text-muted-foreground">
                  Completed SP
                </div>
              </div>
              <div className="text-center p-3 bg-muted/20 rounded-xl">
                <div className="text-lg font-semibold text-foreground">
                  {sprint.capacity}
                </div>
                <div className="text-xs text-muted-foreground">
                  Total Capacity
                </div>
              </div>
            </div>

            {/* Velocity Indicator */}
            <div className="flex items-center justify-between p-3 bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl border border-primary/20">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${getProgressColor(sprintProgress)}`} />
                <span className="text-sm font-medium text-foreground">
                  Velocity: {sprint.completedPoints}/{sprint.capacity} SP
                </span>
              </div>
              <div className="text-xs text-muted-foreground">
                {sprint.capacity - sprint.completedPoints} SP remaining
              </div>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default SprintInfo;
