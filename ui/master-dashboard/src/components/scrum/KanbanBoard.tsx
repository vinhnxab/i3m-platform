import React from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Column from "./Column";
import { Task } from "./types";
import { COLUMN_CONFIGS } from "./constants";
import "./kanban.css";

interface KanbanBoardProps {
  tasks: Task[];
  onDrop: (taskId: string, newStatus: string) => void;
  onEdit: (task: Task) => void;
  onQuickEdit?: (task: Task, field: string, value: any) => void;
  onAddTask?: (status: string) => void;
  isCompact?: boolean;
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({
  tasks,
  onDrop,
  onEdit,
  onQuickEdit,
  onAddTask,
  isCompact = false,
}) => {
  const getTasksByStatus = (status: string) => {
    return tasks.filter((task) => task.status === status);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="w-full">
        {/* Board Header */}
        <div className="flex items-center justify-between mb-4 px-2">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold text-foreground">Kanban Board</h3>
            <div className="text-sm text-muted-foreground">
              {tasks.length} tasks
            </div>
          </div>
        </div>

        {/* Kanban Board Container */}
        <div className="w-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
            {COLUMN_CONFIGS.map((column) => (
              <Column
                key={column.status}
                column={column}
                tasks={getTasksByStatus(column.status)}
                onDrop={onDrop}
                onEdit={onEdit}
                onQuickEdit={onQuickEdit}
                onAddTask={onAddTask}
                isCompact={isCompact}
              />
            ))}
          </div>
        </div>
      </div>
    </DndProvider>
  );
};

export default KanbanBoard;