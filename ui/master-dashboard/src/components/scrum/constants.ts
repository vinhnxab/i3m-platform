import { ColumnConfig } from "./types";

export const COLUMN_CONFIGS: ColumnConfig[] = [
  { title: "Backlog", status: "backlog", color: "border-l-gray-400" },
  { title: "To Do", status: "todo", color: "border-l-blue-400" },
  { title: "In Progress", status: "in-progress", color: "border-l-yellow-400" },
  { title: "Review", status: "review", color: "border-l-orange-400" },
  { title: "Testing", status: "testing", color: "border-l-purple-400" },
  { title: "Done", status: "done", color: "border-l-green-400" },
  { title: "Deployed", status: "deployed", color: "border-l-emerald-400" },
];

export const PRIORITY_COLORS = {
  critical: "bg-red-500/10 text-red-600 border-red-500/20",
  high: "bg-orange-500/10 text-orange-600 border-orange-500/20",
  medium: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
  low: "bg-green-500/10 text-green-600 border-green-500/20",
} as const;

export const TASK_TYPES = {
  story: { label: "Story", icon: "Circle" },
  bug: { label: "Bug", icon: "AlertCircle" },
  task: { label: "Task", icon: "CheckCircle" },
  epic: { label: "Epic", icon: "Flag" },
} as const;

export const SPRINT_STATUS = {
  planning: { label: "Planning", color: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20", icon: "Pause" },
  active: { label: "Active", color: "bg-green-500/10 text-green-600 border-green-500/20", icon: "Play" },
  completed: { label: "Completed", color: "bg-blue-500/10 text-blue-600 border-blue-500/20", icon: "CheckCircle" },
} as const;

export const KEYBOARD_SHORTCUTS = {
  NEW_TASK: "n",
  SEARCH: "/",
  FILTER: "f",
  QUICK_EDIT: "e",
  SAVE: "ctrl+s",
  CANCEL: "escape",
} as const;
