import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Label,
  Textarea,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Button,
  Input,
  Badge,
} from "@/shared/components/ui";
import { Task } from "./types";
import { TASK_TYPES, PRIORITY_COLORS } from "./constants";

interface TaskDialogProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Task) => void;
  teamMembers?: Array<{ id: string; name: string; avatar: string }>;
}

const TaskDialog: React.FC<TaskDialogProps> = ({
  task,
  isOpen,
  onClose,
  onSave,
  teamMembers = [],
}) => {
  const [formData, setFormData] = useState<Partial<Task>>(
    task || {
      title: "",
      description: "",
      storyPoints: 1,
      priority: "medium",
      type: "story",
      status: "backlog",
      labels: [],
      assignee: { id: "1", name: "Unassigned", avatar: "" },
    }
  );

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [newLabel, setNewLabel] = useState("");

  useEffect(() => {
    if (task) {
      setFormData(task);
    } else {
      setFormData({
        title: "",
        description: "",
        storyPoints: 1,
        priority: "medium",
        type: "story",
        status: "backlog",
        labels: [],
        assignee: { id: "1", name: "Unassigned", avatar: "" },
      });
    }
    setErrors({});
  }, [task, isOpen]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title?.trim()) {
      newErrors.title = "Tiêu đề là bắt buộc";
    } else if (formData.title.length < 3) {
      newErrors.title = "Tiêu đề phải có ít nhất 3 ký tự";
    }

    if (!formData.description?.trim()) {
      newErrors.description = "Mô tả là bắt buộc";
    } else if (formData.description.length < 10) {
      newErrors.description = "Mô tả phải có ít nhất 10 ký tự";
    }

    if (!formData.storyPoints || formData.storyPoints < 1 || formData.storyPoints > 21) {
      newErrors.storyPoints = "Story points phải từ 1 đến 21";
    }

    if (formData.dueDate && new Date(formData.dueDate) < new Date()) {
      newErrors.dueDate = "Ngày hết hạn không thể là ngày trong quá khứ";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      onSave({
        ...formData,
        id: task?.id || Date.now().toString(),
        createdAt: task?.createdAt || new Date().toISOString().split("T")[0],
      } as Task);
      onClose();
    }
  };

  const handleAddLabel = () => {
    if (newLabel.trim() && !formData.labels?.includes(newLabel.trim())) {
      setFormData({
        ...formData,
        labels: [...(formData.labels || []), newLabel.trim()],
      });
      setNewLabel("");
    }
  };

  const handleRemoveLabel = (labelToRemove: string) => {
    setFormData({
      ...formData,
      labels: formData.labels?.filter((label) => label !== labelToRemove) || [],
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && e.ctrlKey) {
      handleSave();
    } else if (e.key === "Escape") {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="max-w-2xl bg-card/95 backdrop-blur-xl border-0 rounded-2xl shadow-2xl"
        onKeyDown={handleKeyPress}
      >
        <DialogHeader>
          <DialogTitle className="text-foreground flex items-center gap-2">
            {task ? "Chỉnh sửa Task" : "Tạo Task mới"}
            {task && (
              <Badge
                variant="outline"
                className={`text-xs px-2 py-1 rounded-full border ${PRIORITY_COLORS[task.priority]}`}
              >
                {task.priority}
              </Badge>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="w-full px-4 lg:px-6 py-4 lg:py-6 space-y-4 lg:space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-foreground">
              Tiêu đề *
            </Label>
            <Input
              id="title"
              value={formData.title || ""}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className={`rounded-xl border-border/50 bg-input/50 ${
                errors.title ? "border-red-500" : ""
              }`}
              placeholder="Nhập tiêu đề task..."
            />
            {errors.title && (
              <p className="text-sm text-red-500">{errors.title}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-foreground">
              Mô tả *
            </Label>
            <Textarea
              id="description"
              value={formData.description || ""}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className={`rounded-xl border-border/50 bg-input/50 ${
                errors.description ? "border-red-500" : ""
              }`}
              placeholder="Mô tả chi tiết task..."
              rows={3}
            />
            {errors.description && (
              <p className="text-sm text-red-500">{errors.description}</p>
            )}
          </div>

          {/* Type and Priority */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-foreground">Loại</Label>
              <Select
                value={formData.type || "story"}
                onValueChange={(value: string) =>
                  setFormData({ ...formData, type: value as any })
                }
              >
                <SelectTrigger className="rounded-xl border-border/50 bg-input/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card/95 backdrop-blur-xl border-0 rounded-xl shadow-xl">
                  {Object.entries(TASK_TYPES).map(([key, config]) => (
                    <SelectItem key={key} value={key}>
                      {config.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-foreground">Ưu tiên</Label>
              <Select
                value={formData.priority || "medium"}
                onValueChange={(value: string) =>
                  setFormData({ ...formData, priority: value as any })
                }
              >
                <SelectTrigger className="rounded-xl border-border/50 bg-input/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card/95 backdrop-blur-xl border-0 rounded-xl shadow-xl">
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Story Points and Status */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-foreground">Story Points</Label>
              <Input
                type="number"
                min="1"
                max="21"
                value={formData.storyPoints || 1}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    storyPoints: parseInt(e.target.value) || 1,
                  })
                }
                className={`rounded-xl border-border/50 bg-input/50 ${
                  errors.storyPoints ? "border-red-500" : ""
                }`}
              />
              {errors.storyPoints && (
                <p className="text-sm text-red-500">{errors.storyPoints}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-foreground">Trạng thái</Label>
              <Select
                value={formData.status || "backlog"}
                onValueChange={(value: string) =>
                  setFormData({ ...formData, status: value as any })
                }
              >
                <SelectTrigger className="rounded-xl border-border/50 bg-input/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card/95 backdrop-blur-xl border-0 rounded-xl shadow-xl">
                  <SelectItem value="backlog">Backlog</SelectItem>
                  <SelectItem value="todo">To Do</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="review">Review</SelectItem>
                  <SelectItem value="testing">Testing</SelectItem>
                  <SelectItem value="done">Done</SelectItem>
                  <SelectItem value="deployed">Deployed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Assignee and Due Date */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-foreground">Người thực hiện</Label>
              <Select
                value={formData.assignee?.id || "1"}
                onValueChange={(value: string) => {
                  const member = teamMembers.find((m) => m.id === value);
                  setFormData({
                    ...formData,
                    assignee: member || { id: "1", name: "Unassigned", avatar: "" },
                  });
                }}
              >
                <SelectTrigger className="rounded-xl border-border/50 bg-input/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card/95 backdrop-blur-xl border-0 rounded-xl shadow-xl">
                  <SelectItem value="1">Unassigned</SelectItem>
                  {teamMembers.map((member) => (
                    <SelectItem key={member.id} value={member.id}>
                      {member.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-foreground">Ngày hết hạn</Label>
              <Input
                type="date"
                value={formData.dueDate || ""}
                onChange={(e) =>
                  setFormData({ ...formData, dueDate: e.target.value })
                }
                className={`rounded-xl border-border/50 bg-input/50 ${
                  errors.dueDate ? "border-red-500" : ""
                }`}
              />
              {errors.dueDate && (
                <p className="text-sm text-red-500">{errors.dueDate}</p>
              )}
            </div>
          </div>

          {/* Labels */}
          <div className="space-y-2">
            <Label className="text-foreground">Labels</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.labels?.map((label) => (
                <Badge
                  key={label}
                  variant="outline"
                  className="text-xs px-2 py-1 rounded-md border-border/30 bg-muted/20 font-medium cursor-pointer hover:bg-red-100"
                  onClick={() => handleRemoveLabel(label)}
                >
                  {label} ×
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
                placeholder="Thêm label..."
                className="rounded-xl border-border/50 bg-input/50"
                onKeyPress={(e) => e.key === "Enter" && handleAddLabel()}
              />
              <Button
                type="button"
                variant="outline"
                onClick={handleAddLabel}
                className="rounded-xl border-border/50 hover:bg-accent/50"
              >
                Thêm
              </Button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-between items-center pt-4">
            <div className="text-xs text-muted-foreground">
              <p>Ctrl+Enter để lưu • Esc để hủy</p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={onClose}
                className="rounded-xl border-border/50 hover:bg-accent/50"
              >
                Hủy
              </Button>
              <Button
                onClick={handleSave}
                className="rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                {task ? "Cập nhật" : "Tạo mới"}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TaskDialog;
