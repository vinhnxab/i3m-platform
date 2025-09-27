import React, { useState } from "react";
import { useDrop } from "react-dnd";
import { Plus, MoreHorizontal, Settings } from "lucide-react";
import { Button, Badge } from "@/shared/components/ui";
import TaskCard from "./TaskCard";
import { Task, ColumnConfig } from "./types";

interface ColumnProps {
  column: ColumnConfig;
  tasks: Task[];
  onDrop: (taskId: string, newStatus: string) => void;
  onEdit: (task: Task) => void;
  onQuickEdit?: (task: Task, field: string, value: any) => void;
  onAddTask?: (status: string) => void;
  isCompact?: boolean;
  showTaskCount?: boolean;
  maxHeight?: string;
}

const Column: React.FC<ColumnProps> = ({
  column,
  tasks,
  onDrop,
  onEdit,
  onQuickEdit,
  onAddTask,
  isCompact = false,
  showTaskCount = true,
  maxHeight = "calc(100vh - 300px)",
}) => {
  const [isOver, setIsOver] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  const [{ isOver: isDropOver }, drop] = useDrop({
    accept: "task",
    drop: (item: { id: string }) => {
      onDrop(item.id, column.status);
      setIsOver(false);
    },
    hover: () => {
      setIsOver(true);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  const handleAddTask = () => {
    if (onAddTask) {
      onAddTask(column.status);
    } else {
      setShowAddForm(true);
    }
  };

  const getColumnHeaderColor = (status: string) => {
    switch (status) {
      case "backlog":
        return "bg-gray-100 text-gray-700";
      case "todo":
        return "bg-blue-100 text-blue-700";
      case "in-progress":
        return "bg-yellow-100 text-yellow-700";
      case "review":
        return "bg-orange-100 text-orange-700";
      case "testing":
        return "bg-purple-100 text-purple-700";
      case "done":
        return "bg-green-100 text-green-700";
      case "deployed":
        return "bg-emerald-100 text-emerald-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStoryPointsTotal = () => {
    return tasks.reduce((sum, task) => sum + task.storyPoints, 0);
  };

  return (
    <div
      ref={drop as any}
      className={`
        kanban-column flex flex-col
        bg-card/60 backdrop-blur-xl 
        rounded-lg p-2 sm:p-3
        border border-gray-200 shadow-lg
        transition-all duration-200
        ${isDropOver ? "kanban-column drag-over" : ""}
        ${isOver ? "bg-primary/5" : ""}
        ${isCompact ? "compact" : ""}
      `}
    >
      {/* Column Header */}
      <div className="flex items-center justify-between mb-4 gap-y-2">
        <div className="flex items-center gap-2.5 flex-1 min-w-0">
          <div className={`px-2 py-1 rounded-md text-xs font-semibold ${getColumnHeaderColor(column.status)}`}>
            {column.title}
          </div>
          {showTaskCount && (
            <Badge
              variant="secondary"
              className="text-xs px-2 py-0.5 rounded-full bg-muted/30 text-muted-foreground font-medium"
            >
              {tasks.length}
            </Badge>
          )}
          {tasks.length > 0 && (
            <Badge
              variant="outline"
              className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary border-primary/20 font-medium"
            >
              {getStoryPointsTotal()} SP
            </Badge>
          )}
        </div>
        
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 hover:bg-accent/50 rounded-xl"
            onClick={handleAddTask}
            title="Add task"
          >
            <Plus className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 hover:bg-accent/50 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"
            title="Column settings"
          >
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Tasks Container */}
      <div
        className="flex flex-col gap-3 flex-1 overflow-y-auto hide-scrollbar"
        style={{ 
          scrollbarWidth: "none", 
          msOverflowStyle: "none",
          maxHeight: maxHeight
        }}
      >
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onEdit={onEdit}
            onQuickEdit={onQuickEdit}
            isCompact={isCompact}
            showActions={true}
          />
        ))}

        {/* Empty State */}
        {tasks.length === 0 && (
          <div 
            className={`
              flex items-center justify-center text-muted-foreground text-sm 
              border-2 border-dashed border-border/30 rounded-lg bg-muted/10
              transition-all duration-200 hover:bg-muted/20 cursor-pointer
              ${isDropOver ? "border-primary/50 bg-primary/5" : ""}
              ${isCompact ? "h-20" : "h-24 sm:h-28 lg:h-32"}
            `}
            onClick={handleAddTask}
          >
            <div className="text-center">
              <div className="text-muted-foreground/50 mb-1.5">
                <Plus className="w-5 h-5 sm:w-6 sm:h-6 mx-auto" />
              </div>
              <div className="text-xs">Thêm task</div>
            </div>
          </div>
        )}

        {/* Drop Zone Indicator */}
        {isDropOver && tasks.length > 0 && (
          <div className="h-2 bg-primary/20 rounded-full animate-pulse" />
        )}
      </div>

      {/* Column Footer with Stats */}
      {tasks.length > 0 && (
        <div className="mt-3 pt-3 border-t border-border/30">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Tasks: {tasks.length}</span>
            <span>Points: {getStoryPointsTotal()}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Column;
