import React, { useState } from "react";
import { TrendingUp, TrendingDown, BarChart3, PieChart, Calendar, Users, Target } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, Button, Badge } from "@/shared/components/ui";
import { Task, Sprint } from "./types";

interface ReportsTabProps {
  tasks: Task[];
  sprint: Sprint;
  teamMembers?: Array<{ id: string; name: string; tasksCount: number; storyPoints: number }>;
}

const ReportsTab: React.FC<ReportsTabProps> = ({
  tasks,
  sprint,
  teamMembers = [],
}) => {
  const [selectedPeriod, setSelectedPeriod] = useState<"sprint" | "month" | "quarter">("sprint");

  // Calculate statistics
  const getTasksByStatus = (status: string) => tasks.filter(task => task.status === status);
  
  const completedTasks = getTasksByStatus("done").length + getTasksByStatus("deployed").length;
  const inProgressTasks = getTasksByStatus("in-progress").length + getTasksByStatus("review").length;
  const totalTasks = tasks.length;
  
  const completedPoints = tasks
    .filter(task => task.status === "done" || task.status === "deployed")
    .reduce((sum, task) => sum + task.storyPoints, 0);
  
  const totalPoints = tasks.reduce((sum, task) => sum + task.storyPoints, 0);
  
  const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  const pointsCompletionRate = totalPoints > 0 ? (completedPoints / totalPoints) * 100 : 0;

  // Priority distribution
  const priorityStats = {
    critical: tasks.filter(t => t.priority === "critical").length,
    high: tasks.filter(t => t.priority === "high").length,
    medium: tasks.filter(t => t.priority === "medium").length,
    low: tasks.filter(t => t.priority === "low").length,
  };

  // Type distribution
  const typeStats = {
    story: tasks.filter(t => t.type === "story").length,
    task: tasks.filter(t => t.type === "task").length,
    bug: tasks.filter(t => t.type === "bug").length,
    epic: tasks.filter(t => t.type === "epic").length,
  };

  // Team performance
  const teamStats = teamMembers.map(member => {
    const memberTasks = tasks.filter(task => task.assignee.id === member.id);
    const memberCompleted = memberTasks.filter(task => 
      task.status === "done" || task.status === "deployed"
    ).length;
    const memberPoints = memberTasks.reduce((sum, task) => sum + task.storyPoints, 0);
    const memberCompletedPoints = memberTasks
      .filter(task => task.status === "done" || task.status === "deployed")
      .reduce((sum, task) => sum + task.storyPoints, 0);
    
    return {
      ...member,
      completedTasks: memberCompleted,
      totalTasks: memberTasks.length,
      completedPoints: memberCompletedPoints,
      totalPoints: memberPoints,
      completionRate: memberTasks.length > 0 ? (memberCompleted / memberTasks.length) * 100 : 0,
    };
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "backlog": return "bg-gray-500";
      case "todo": return "bg-blue-500";
      case "in-progress": return "bg-yellow-500";
      case "review": return "bg-orange-500";
      case "testing": return "bg-purple-500";
      case "done": return "bg-green-500";
      case "deployed": return "bg-emerald-500";
      default: return "bg-gray-500";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical": return "bg-red-500";
      case "high": return "bg-orange-500";
      case "medium": return "bg-yellow-500";
      case "low": return "bg-green-500";
      default: return "bg-gray-500";
    }
  };

  return (
    <div className="w-full px-4 lg:px-6 py-4 lg:py-6 space-y-4 lg:space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-card/80 backdrop-blur-xl border-0 rounded-2xl shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Completion Rate</p>
                <p className="text-2xl font-bold text-foreground">{Math.round(completionRate)}%</p>
              </div>
              <div className="h-12 w-12 bg-green-500/10 rounded-full flex items-center justify-center">
                <Target className="h-6 w-6 text-green-500" />
              </div>
            </div>
            <div className="mt-4">
              <div className="w-full bg-muted/30 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${completionRate}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/80 backdrop-blur-xl border-0 rounded-2xl shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Story Points</p>
                <p className="text-2xl font-bold text-foreground">{completedPoints}/{totalPoints}</p>
              </div>
              <div className="h-12 w-12 bg-blue-500/10 rounded-full flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-blue-500" />
              </div>
            </div>
            <div className="mt-4">
              <div className="w-full bg-muted/30 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${pointsCompletionRate}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/80 backdrop-blur-xl border-0 rounded-2xl shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">In Progress</p>
                <p className="text-2xl font-bold text-foreground">{inProgressTasks}</p>
              </div>
              <div className="h-12 w-12 bg-yellow-500/10 rounded-full flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-yellow-500" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {totalTasks - completedTasks - inProgressTasks} remaining
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card/80 backdrop-blur-xl border-0 rounded-2xl shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Team Members</p>
                <p className="text-2xl font-bold text-foreground">{teamMembers.length}</p>
              </div>
              <div className="h-12 w-12 bg-purple-500/10 rounded-full flex items-center justify-center">
                <Users className="h-6 w-6 text-purple-500" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Active contributors
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Status Distribution */}
      <Card className="bg-card/80 backdrop-blur-xl border-0 rounded-2xl shadow-lg">
        <CardHeader>
          <CardTitle className="text-foreground flex items-center gap-2">
            <PieChart className="w-5 h-5" />
            Task Status Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {["backlog", "todo", "in-progress", "review", "testing", "done", "deployed"].map((status) => {
              const count = getTasksByStatus(status).length;
              const percentage = totalTasks > 0 ? (count / totalTasks) * 100 : 0;
              
              return (
                <div key={status} className="text-center p-4 bg-muted/20 rounded-xl">
                  <div className={`w-4 h-4 rounded-full mx-auto mb-2 ${getStatusColor(status)}`} />
                  <div className="text-lg font-semibold text-foreground">{count}</div>
                  <div className="text-sm text-muted-foreground capitalize">{status.replace("-", " ")}</div>
                  <div className="text-xs text-muted-foreground">{Math.round(percentage)}%</div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Priority and Type Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-card/80 backdrop-blur-xl border-0 rounded-2xl shadow-lg">
          <CardHeader>
            <CardTitle className="text-foreground">Priority Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(priorityStats).map(([priority, count]) => {
                const percentage = totalTasks > 0 ? (count / totalTasks) * 100 : 0;
                return (
                  <div key={priority} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${getPriorityColor(priority)}`} />
                      <span className="text-sm font-medium capitalize">{priority}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">{count}</span>
                      <div className="w-20 bg-muted/30 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${getPriorityColor(priority)}`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/80 backdrop-blur-xl border-0 rounded-2xl shadow-lg">
          <CardHeader>
            <CardTitle className="text-foreground">Task Type Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(typeStats).map(([type, count]) => {
                const percentage = totalTasks > 0 ? (count / totalTasks) * 100 : 0;
                const colors = {
                  story: "bg-blue-500",
                  task: "bg-green-500", 
                  bug: "bg-red-500",
                  epic: "bg-purple-500"
                };
                return (
                  <div key={type} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${colors[type as keyof typeof colors]}`} />
                      <span className="text-sm font-medium capitalize">{type}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">{count}</span>
                      <div className="w-20 bg-muted/30 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${colors[type as keyof typeof colors]}`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Team Performance */}
      {teamStats.length > 0 && (
        <Card className="bg-card/80 backdrop-blur-xl border-0 rounded-2xl shadow-lg">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              <Users className="w-5 h-5" />
              Team Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {teamStats.map((member) => (
                <div key={member.id} className="flex items-center justify-between p-4 bg-muted/20 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary/10 to-primary/5 rounded-full flex items-center justify-center">
                      <Users className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground">{member.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {member.completedTasks}/{member.totalTasks} tasks completed
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-foreground">
                      {Math.round(member.completionRate)}%
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {member.completedPoints}/{member.totalPoints} SP
                    </div>
                    <div className="w-20 bg-muted/30 rounded-full h-2 mt-1">
                      <div 
                        className="bg-primary h-2 rounded-full"
                        style={{ width: `${member.completionRate}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ReportsTab;
