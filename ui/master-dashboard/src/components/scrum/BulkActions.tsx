import React, { useState } from "react";
import { Trash2, Edit, Copy, Archive, Move, Tag } from "lucide-react";
import { Button, Badge } from "@/shared/components/ui";
import { Task } from "./types";

interface BulkActionsProps {
  selectedTasks: Task[];
  onBulkDelete: (taskIds: string[]) => void;
  onBulkEdit: (taskIds: string[]) => void;
  onBulkMove: (taskIds: string[], newStatus: string) => void;
  onBulkArchive: (taskIds: string[]) => void;
  onBulkCopy: (taskIds: string[]) => void;
  onClearSelection: () => void;
}

const BulkActions: React.FC<BulkActionsProps> = ({
  selectedTasks,
  onBulkDelete,
  onBulkEdit,
  onBulkMove,
  onBulkArchive,
  onBulkCopy,
  onClearSelection,
}) => {
  const [showMoveMenu, setShowMoveMenu] = useState(false);

  if (selectedTasks.length === 0) return null;

  const taskIds = selectedTasks.map(task => task.id);
  const totalStoryPoints = selectedTasks.reduce((sum, task) => sum + task.storyPoints, 0);

  const statusOptions = [
    { value: "backlog", label: "Backlog" },
    { value: "todo", label: "To Do" },
    { value: "in-progress", label: "In Progress" },
    { value: "review", label: "Review" },
    { value: "testing", label: "Testing" },
    { value: "done", label: "Done" },
    { value: "deployed", label: "Deployed" },
  ];

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
      <div className="bg-card/95 backdrop-blur-xl border border-border/50 rounded-2xl shadow-2xl p-4">
        <div className="flex items-center gap-4">
          {/* Selection Info */}
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-primary/10 text-primary">
              {selectedTasks.length} selected
            </Badge>
            <span className="text-sm text-muted-foreground">
              {totalStoryPoints} SP
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onBulkEdit(taskIds)}
              className="rounded-xl border-border/50 hover:bg-accent/50"
            >
              <Edit className="w-4 h-4 mr-1" />
              Edit
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => onBulkCopy(taskIds)}
              className="rounded-xl border-border/50 hover:bg-accent/50"
            >
              <Copy className="w-4 h-4 mr-1" />
              Copy
            </Button>

            {/* Move Dropdown */}
            <div className="relative">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowMoveMenu(!showMoveMenu)}
                className="rounded-xl border-border/50 hover:bg-accent/50"
              >
                <Move className="w-4 h-4 mr-1" />
                Move
              </Button>
              
              {showMoveMenu && (
                <div className="absolute bottom-full mb-2 left-0 bg-card/95 backdrop-blur-xl border border-border/50 rounded-xl shadow-lg p-2 min-w-[150px]">
                  {statusOptions.map((status) => (
                    <button
                      key={status.value}
                      onClick={() => {
                        onBulkMove(taskIds, status.value);
                        setShowMoveMenu(false);
                      }}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-accent/50 rounded-lg transition-colors"
                    >
                      {status.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => onBulkArchive(taskIds)}
              className="rounded-xl border-border/50 hover:bg-accent/50"
            >
              <Archive className="w-4 h-4 mr-1" />
              Archive
            </Button>

            <Button
              variant="destructive"
              size="sm"
              onClick={() => onBulkDelete(taskIds)}
              className="rounded-xl"
            >
              <Trash2 className="w-4 h-4 mr-1" />
              Delete
            </Button>
          </div>

          {/* Clear Selection */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearSelection}
            className="rounded-xl hover:bg-accent/50"
          >
            ×
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BulkActions;
