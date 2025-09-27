import React, { useState } from "react";
import { Edit, Plus, Search, Filter, SortAsc, SortDesc } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, Button, Badge, Input } from "@/shared/components/ui";
import TaskCard from "./TaskCard";
import { Task } from "./types";

interface BacklogTabProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onQuickEdit?: (task: Task, field: string, value: any) => void;
  onAddTask?: () => void;
}

const BacklogTab: React.FC<BacklogTabProps> = ({
  tasks,
  onEdit,
  onQuickEdit,
  onAddTask,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"title" | "priority" | "storyPoints" | "createdAt">("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [filterPriority, setFilterPriority] = useState<string>("all");
  const [filterType, setFilterType] = useState<string>("all");

  const backlogTasks = tasks.filter((task) => task.status === "backlog");

  const filteredTasks = backlogTasks
    .filter((task) => {
      const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           task.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesPriority = filterPriority === "all" || task.priority === filterPriority;
      const matchesType = filterType === "all" || task.type === filterType;
      
      return matchesSearch && matchesPriority && matchesType;
    })
    .sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortBy) {
        case "title":
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case "priority":
          const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
          aValue = priorityOrder[a.priority];
          bValue = priorityOrder[b.priority];
          break;
        case "storyPoints":
          aValue = a.storyPoints;
          bValue = b.storyPoints;
          break;
        case "createdAt":
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
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

  const getPriorityCount = (priority: string) => {
    return backlogTasks.filter(task => task.priority === priority).length;
  };

  const getTypeCount = (type: string) => {
    return backlogTasks.filter(task => task.type === type).length;
  };

  const totalStoryPoints = backlogTasks.reduce((sum, task) => sum + task.storyPoints, 0);

  return (
    <div className="w-full px-4 lg:px-6 py-4 lg:py-6 space-y-4 lg:space-y-6">
      {/* Header with Stats */}
      <Card className="bg-card/80 backdrop-blur-xl border-0 rounded-2xl shadow-lg">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-foreground">Product Backlog</CardTitle>
              <p className="text-muted-foreground">
                Danh sách tất cả user stories và tasks chưa được assign vào sprint
              </p>
            </div>
            <Button
              onClick={onAddTask}
              className="rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Task
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-muted/20 rounded-xl">
              <div className="text-2xl font-semibold text-foreground">
                {backlogTasks.length}
              </div>
              <div className="text-sm text-muted-foreground">Total Tasks</div>
            </div>
            <div className="text-center p-4 bg-muted/20 rounded-xl">
              <div className="text-2xl font-semibold text-foreground">
                {totalStoryPoints}
              </div>
              <div className="text-sm text-muted-foreground">Story Points</div>
            </div>
            <div className="text-center p-4 bg-muted/20 rounded-xl">
              <div className="text-2xl font-semibold text-foreground">
                {getPriorityCount("critical") + getPriorityCount("high")}
              </div>
              <div className="text-sm text-muted-foreground">High Priority</div>
            </div>
            <div className="text-center p-4 bg-muted/20 rounded-xl">
              <div className="text-2xl font-semibold text-foreground">
                {getTypeCount("bug")}
              </div>
              <div className="text-sm text-muted-foreground">Bugs</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters and Search */}
      <Card className="bg-card/80 backdrop-blur-xl border-0 rounded-2xl shadow-lg">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Tìm kiếm tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 rounded-xl border-border/50 bg-input/50"
              />
            </div>

            {/* Priority Filter */}
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="px-3 py-2 rounded-xl border border-border/50 bg-input/50 text-sm"
            >
              <option value="all">All Priorities</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>

            {/* Type Filter */}
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 rounded-xl border border-border/50 bg-input/50 text-sm"
            >
              <option value="all">All Types</option>
              <option value="story">Story</option>
              <option value="task">Task</option>
              <option value="bug">Bug</option>
              <option value="epic">Epic</option>
            </select>

            {/* Sort */}
            <div className="flex gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2 rounded-xl border border-border/50 bg-input/50 text-sm"
              >
                <option value="createdAt">Created Date</option>
                <option value="title">Title</option>
                <option value="priority">Priority</option>
                <option value="storyPoints">Story Points</option>
              </select>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                className="rounded-xl border-border/50 hover:bg-accent/50"
              >
                {sortOrder === "asc" ? (
                  <SortAsc className="w-4 h-4" />
                ) : (
                  <SortDesc className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tasks List */}
      <Card className="bg-card/80 backdrop-blur-xl border-0 rounded-2xl shadow-lg">
        <CardContent className="pt-6">
          {filteredTasks.length > 0 ? (
            <div className="space-y-3">
              {filteredTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between p-4 bg-muted/20 rounded-xl border border-border/30 hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-8 h-8 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg flex items-center justify-center flex-shrink-0">
                      {task.type === "story" && (
                        <div className="w-4 h-4 bg-blue-500 rounded-full" />
                      )}
                      {task.type === "bug" && (
                        <div className="w-4 h-4 bg-red-500 rounded-full" />
                      )}
                      {task.type === "task" && (
                        <div className="w-4 h-4 bg-green-500 rounded-full" />
                      )}
                      {task.type === "epic" && (
                        <div className="w-4 h-4 bg-purple-500 rounded-full" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-foreground truncate">
                        {task.title}
                      </h4>
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {task.description}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge
                          variant="outline"
                          className={`text-xs px-2 py-0.5 rounded-full ${
                            task.priority === "critical" ? "bg-red-500/10 text-red-600 border-red-500/20" :
                            task.priority === "high" ? "bg-orange-500/10 text-orange-600 border-orange-500/20" :
                            task.priority === "medium" ? "bg-yellow-500/10 text-yellow-600 border-yellow-500/20" :
                            "bg-green-500/10 text-green-600 border-green-500/20"
                          }`}
                        >
                          {task.priority}
                        </Badge>
                        <Badge
                          variant="secondary"
                          className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary"
                        >
                          {task.storyPoints} SP
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <div className="text-right">
                      <div className="text-sm font-medium text-foreground">
                        {task.assignee.name}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(task.createdAt).toLocaleDateString("vi-VN")}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(task)}
                      className="rounded-xl hover:bg-accent/50"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-muted-foreground mb-4">
                <Search className="w-12 h-12 mx-auto opacity-50" />
              </div>
              <h3 className="text-lg font-medium text-foreground mb-2">
                No tasks found
              </h3>
              <p className="text-muted-foreground">
                {searchQuery || filterPriority !== "all" || filterType !== "all"
                  ? "Try adjusting your search or filters"
                  : "No tasks in backlog yet"}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BacklogTab;
