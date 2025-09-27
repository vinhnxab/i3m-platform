import React, { useState } from "react";
import { useDrag } from "react-dnd";
import {
  AlertCircle,
  CheckCircle,
  Circle,
  Flag,
  Clock,
  User,
  Edit,
  MoreHorizontal,
  Calendar,
} from "lucide-react";
import { Badge, Button } from "@/shared/components/ui";
import { Task } from "./types";
import { PRIORITY_COLORS, TASK_TYPES } from "./constants";

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onQuickEdit?: (task: Task, field: string, value: any) => void;
  isCompact?: boolean;
  showActions?: boolean;
}

const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onEdit,
  onQuickEdit,
  isCompact = false,
  showActions = true,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(task.title);

  const [{ isDragging }, drag] = useDrag({
    type: "task",
    item: { id: task.id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "story":
        return <Circle className="w-3 h-3 text-blue-500" />;
      case "bug":
        return <AlertCircle className="w-3 h-3 text-red-500" />;
      case "task":
        return <CheckCircle className="w-3 h-3 text-green-500" />;
      case "epic":
        return <Flag className="w-3 h-3 text-purple-500" />;
      default:
        return <Circle className="w-3 h-3 text-gray-500" />;
    }
  };

  const handleTitleEdit = () => {
    if (isEditing && editValue !== task.title) {
      onQuickEdit?.(task, "title", editValue);
    }
    setIsEditing(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleTitleEdit();
    } else if (e.key === "Escape") {
      setEditValue(task.title);
      setIsEditing(false);
    }
  };

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date();

  return (
    <div
      ref={drag as any}
      className={`
        kanban-task-card flex-col bg-card/90 backdrop-blur-xl border-0 rounded-lg p-2.5 sm:p-3 mb-2.5 sm:mb-3
        shadow-sm cursor-pointer transition-all duration-200
        hover:scale-[1.01] hover:shadow-md group min-h-[100px] sm:min-h-[110px] max-w-full
        ${isDragging ? "opacity-50 rotate-1 scale-105" : ""}
        border border-border/20 hover:border-border/30
        ${isOverdue ? "border-l-4 border-l-red-500" : ""}
        ${isCompact ? "min-h-[80px] p-2" : ""}
      `}
      onClick={() => !isEditing && onEdit(task)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Header with type icon, title, and priority */}
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-1.5 flex-1 min-w-0">
          <div className="flex-shrink-0">{getTypeIcon(task.type)}</div>
          {isEditing ? (
            <input
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onBlur={handleTitleEdit}
              onKeyDown={handleKeyPress}
              className="text-xs font-semibold text-foreground bg-transparent border-none outline-none flex-1 min-w-0"
              autoFocus
            />
          ) : (
            <h4 
              className="text-xs font-semibold text-foreground line-clamp-2 flex-1"
              onDoubleClick={() => setIsEditing(true)}
            >
              {task.title}
            </h4>
          )}
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          <Badge
            variant="outline"
            className={`text-xs px-1.5 py-0.5 rounded-full border ${PRIORITY_COLORS[task.priority]}`}
          >
            {task.priority}
          </Badge>
          {showActions && isHovered && (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(task);
              }}
            >
              <Edit className="w-3 h-3" />
            </Button>
          )}
        </div>
      </div>

      {/* Description */}
      {!isCompact && (
        <p className="text-xs text-muted-foreground mb-3 line-clamp-2 leading-relaxed">
          {task.description}
        </p>
      )}

      {/* Footer with assignee and story points */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 flex-1 min-w-0">
          <div className="w-6 h-6 bg-gradient-to-br from-primary/10 to-primary/5 rounded-full flex items-center justify-center flex-shrink-0">
            <User className="w-3 h-3 text-primary" />
          </div>
          <span className="text-xs font-medium text-muted-foreground truncate">
            {task.assignee.name}
          </span>
        </div>

        <div className="flex items-center gap-1.5 flex-shrink-0">
          <Badge
            variant="secondary"
            className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary border-primary/20 font-semibold"
          >
            {task.storyPoints}
          </Badge>
        </div>
      </div>

      {/* Due date */}
      {task.dueDate && (
        <div className={`flex items-center gap-1 text-xs mt-2 pt-2 border-t border-border/30 ${
          isOverdue ? "text-red-500" : "text-muted-foreground"
        }`}>
          <Clock className="w-3 h-3 flex-shrink-0" />
          <span>Due: {new Date(task.dueDate).toLocaleDateString("vi-VN")}</span>
        </div>
      )}

      {/* Labels */}
      {task.labels.length > 0 && !isCompact && (
        <div className="flex flex-wrap gap-1.5 mt-3">
          {task.labels.slice(0, 2).map((label) => (
            <Badge
              key={label}
              variant="outline"
              className="text-xs px-2 py-0.5 rounded-md border-border/30 bg-muted/20 font-medium"
            >
              {label}
            </Badge>
          ))}
          {task.labels.length > 2 && (
            <Badge
              variant="outline"
              className="text-xs px-2 py-0.5 rounded-md border-border/30 bg-muted/20 font-medium"
            >
              +{task.labels.length - 2}
            </Badge>
          )}
        </div>
      )}

      {/* Quick actions overlay */}
      {showActions && isHovered && (
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 bg-background/80 backdrop-blur-sm"
            onClick={(e) => {
              e.stopPropagation();
              // Add more actions menu
            }}
          >
            <MoreHorizontal className="w-3 h-3" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default TaskCard;
