import React, { useState } from "react";
import { Users, User, Calendar, Target, TrendingUp, Clock, Mail, Phone } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, Button, Badge, Avatar } from "@/shared/components/ui";
import { Task, TeamMember } from "./types";

interface TeamTabProps {
  tasks: Task[];
  teamMembers: TeamMember[];
  onEditMember?: (member: TeamMember) => void;
  onAddMember?: () => void;
}

const TeamTab: React.FC<TeamTabProps> = ({
  tasks,
  teamMembers,
  onEditMember,
  onAddMember,
}) => {
  const [selectedMember, setSelectedMember] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"name" | "tasks" | "points" | "performance">("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // Calculate member statistics
  const memberStats = teamMembers.map(member => {
    const memberTasks = tasks.filter(task => task.assignee.id === member.id);
    const completedTasks = memberTasks.filter(task => 
      task.status === "done" || task.status === "deployed"
    ).length;
    const inProgressTasks = memberTasks.filter(task => 
      task.status === "in-progress" || task.status === "review"
    ).length;
    const totalStoryPoints = memberTasks.reduce((sum, task) => sum + task.storyPoints, 0);
    const completedStoryPoints = memberTasks
      .filter(task => task.status === "done" || task.status === "deployed")
      .reduce((sum, task) => sum + task.storyPoints, 0);
    
    const completionRate = memberTasks.length > 0 ? (completedTasks / memberTasks.length) * 100 : 0;
    const pointsCompletionRate = totalStoryPoints > 0 ? (completedStoryPoints / totalStoryPoints) * 100 : 0;
    
    // Calculate average task completion time (mock data for now)
    const avgCompletionTime = Math.floor(Math.random() * 5) + 1; // 1-5 days
    
    return {
      ...member,
      totalTasks: memberTasks.length,
      completedTasks,
      inProgressTasks,
      totalStoryPoints,
      completedStoryPoints,
      completionRate,
      pointsCompletionRate,
      avgCompletionTime,
      tasks: memberTasks,
    };
  });

  // Sort members
  const sortedMembers = [...memberStats].sort((a, b) => {
    let aValue: any, bValue: any;
    
    switch (sortBy) {
      case "name":
        aValue = a.name.toLowerCase();
        bValue = b.name.toLowerCase();
        break;
      case "tasks":
        aValue = a.totalTasks;
        bValue = b.totalTasks;
        break;
      case "points":
        aValue = a.totalStoryPoints;
        bValue = b.totalStoryPoints;
        break;
      case "performance":
        aValue = a.completionRate;
        bValue = b.completionRate;
        break;
      default:
        return 0;
    }
    
    if (sortOrder === "asc") {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const selectedMemberData = selectedMember 
    ? memberStats.find(m => m.id === selectedMember)
    : null;

  const getPerformanceColor = (rate: number) => {
    if (rate >= 80) return "text-green-500";
    if (rate >= 60) return "text-yellow-500";
    if (rate >= 40) return "text-orange-500";
    return "text-red-500";
  };

  const getPerformanceBadge = (rate: number) => {
    if (rate >= 80) return { label: "Excellent", color: "bg-green-500/10 text-green-600 border-green-500/20" };
    if (rate >= 60) return { label: "Good", color: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20" };
    if (rate >= 40) return { label: "Average", color: "bg-orange-500/10 text-orange-600 border-orange-500/20" };
    return { label: "Needs Improvement", color: "bg-red-500/10 text-red-600 border-red-500/20" };
  };

  return (
    <div className="w-full px-4 lg:px-6 py-4 lg:py-6 space-y-4 lg:space-y-6">
      {/* Team Overview */}
      <Card className="bg-card/80 backdrop-blur-xl border-0 rounded-2xl shadow-lg">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-foreground flex items-center gap-2">
                <Users className="w-5 h-5" />
                Team Members
              </CardTitle>
              <p className="text-muted-foreground">
                Thành viên team và workload của từng người
              </p>
            </div>
            <Button
              onClick={onAddMember}
              className="rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <User className="w-4 h-4 mr-2" />
              Add Member
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-muted/20 rounded-xl">
              <div className="text-3xl font-bold text-foreground">{teamMembers.length}</div>
              <div className="text-sm text-muted-foreground">Total Members</div>
            </div>
            <div className="text-center p-6 bg-muted/20 rounded-xl">
              <div className="text-3xl font-bold text-foreground">
                {memberStats.reduce((sum, m) => sum + m.totalTasks, 0)}
              </div>
              <div className="text-sm text-muted-foreground">Total Tasks</div>
            </div>
            <div className="text-center p-6 bg-muted/20 rounded-xl">
              <div className="text-3xl font-bold text-foreground">
                {Math.round(memberStats.reduce((sum, m) => sum + m.completionRate, 0) / memberStats.length)}%
              </div>
              <div className="text-sm text-muted-foreground">Avg Performance</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Team Members List */}
      <Card className="bg-card/80 backdrop-blur-xl border-0 rounded-2xl shadow-lg">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <CardTitle className="text-foreground">Team Performance</CardTitle>
            <div className="flex gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2 rounded-xl border border-border/50 bg-input/50 text-sm"
              >
                <option value="name">Name</option>
                <option value="tasks">Tasks</option>
                <option value="points">Story Points</option>
                <option value="performance">Performance</option>
              </select>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                className="rounded-xl border-border/50 hover:bg-accent/50"
              >
                {sortOrder === "asc" ? "↑" : "↓"}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sortedMembers.map((member) => {
              const performance = getPerformanceBadge(member.completionRate);
              return (
                <div
                  key={member.id}
                  className={`flex items-center justify-between p-4 rounded-xl border transition-all cursor-pointer ${
                    selectedMember === member.id 
                      ? "bg-primary/10 border-primary/30" 
                      : "bg-muted/20 border-border/30 hover:bg-muted/30"
                  }`}
                  onClick={() => setSelectedMember(selectedMember === member.id ? null : member.id)}
                >
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <Avatar className="w-12 h-12 bg-gradient-to-br from-primary/10 to-primary/5">
                      <User className="w-6 h-6 text-primary" />
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-foreground truncate">{member.name}</h4>
                        <Badge
                          variant="outline"
                          className={`text-xs px-2 py-0.5 rounded-full border ${performance.color}`}
                        >
                          {performance.label}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{member.role}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Target className="w-3 h-3" />
                          {member.completedTasks}/{member.totalTasks} tasks
                        </span>
                        <span className="flex items-center gap-1">
                          <TrendingUp className="w-3 h-3" />
                          {member.completedStoryPoints}/{member.totalStoryPoints} SP
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {member.avgCompletionTime} days avg
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className={`text-lg font-semibold ${getPerformanceColor(member.completionRate)}`}>
                      {Math.round(member.completionRate)}%
                    </div>
                    <div className="text-xs text-muted-foreground">Completion</div>
                    <div className="w-20 bg-muted/30 rounded-full h-2 mt-1">
                      <div 
                        className={`h-2 rounded-full ${
                          member.completionRate >= 80 ? "bg-green-500" :
                          member.completionRate >= 60 ? "bg-yellow-500" :
                          member.completionRate >= 40 ? "bg-orange-500" : "bg-red-500"
                        }`}
                        style={{ width: `${member.completionRate}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Member Details */}
      {selectedMemberData && (
        <Card className="bg-card/80 backdrop-blur-xl border-0 rounded-2xl shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-foreground flex items-center gap-2">
                <User className="w-5 h-5" />
                {selectedMemberData.name} - Task Details
              </CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEditMember?.(selectedMemberData)}
                className="rounded-xl border-border/50 hover:bg-accent/50"
              >
                Edit Profile
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Task Statistics */}
              <div className="space-y-4">
                <h4 className="font-medium text-foreground">Task Statistics</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-muted/20 rounded-xl">
                    <div className="text-2xl font-semibold text-foreground">
                      {selectedMemberData.totalTasks}
                    </div>
                    <div className="text-sm text-muted-foreground">Total Tasks</div>
                  </div>
                  <div className="text-center p-4 bg-muted/20 rounded-xl">
                    <div className="text-2xl font-semibold text-foreground">
                      {selectedMemberData.completedTasks}
                    </div>
                    <div className="text-sm text-muted-foreground">Completed</div>
                  </div>
                  <div className="text-center p-4 bg-muted/20 rounded-xl">
                    <div className="text-2xl font-semibold text-foreground">
                      {selectedMemberData.inProgressTasks}
                    </div>
                    <div className="text-sm text-muted-foreground">In Progress</div>
                  </div>
                  <div className="text-center p-4 bg-muted/20 rounded-xl">
                    <div className="text-2xl font-semibold text-foreground">
                      {selectedMemberData.avgCompletionTime}
                    </div>
                    <div className="text-sm text-muted-foreground">Avg Days</div>
                  </div>
                </div>
              </div>

              {/* Recent Tasks */}
              <div className="space-y-4">
                <h4 className="font-medium text-foreground">Recent Tasks</h4>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {selectedMemberData.tasks.slice(0, 5).map((task) => (
                    <div
                      key={task.id}
                      className="flex items-center justify-between p-3 bg-muted/20 rounded-lg"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                          {task.title}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {task.type} • {task.storyPoints} SP
                        </p>
                      </div>
                      <Badge
                        variant="outline"
                        className={`text-xs px-2 py-0.5 rounded-full ${
                          task.status === "done" || task.status === "deployed" 
                            ? "bg-green-500/10 text-green-600 border-green-500/20"
                            : task.status === "in-progress" || task.status === "review"
                            ? "bg-yellow-500/10 text-yellow-600 border-yellow-500/20"
                            : "bg-gray-500/10 text-gray-600 border-gray-500/20"
                        }`}
                      >
                        {task.status.replace("-", " ")}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TeamTab;
