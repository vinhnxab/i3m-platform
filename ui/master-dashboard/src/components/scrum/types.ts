export interface Task {
  id: string;
  title: string;
  description: string;
  assignee: {
    id: string;
    name: string;
    avatar: string;
  };
  storyPoints: number;
  priority: "low" | "medium" | "high" | "critical";
  labels: string[];
  type: "story" | "bug" | "task" | "epic";
  status:
    | "backlog"
    | "todo"
    | "in-progress"
    | "review"
    | "testing"
    | "done"
    | "deployed";
  createdAt: string;
  dueDate?: string;
}

export interface Sprint {
  id: string;
  name: string;
  goal: string;
  startDate: string;
  endDate: string;
  status: "planning" | "active" | "completed";
  capacity: number;
  completedPoints: number;
}

export interface TeamMember {
  id: string;
  name: string;
  avatar: string;
  role: string;
  tasksCount: number;
  storyPoints: number;
}

export interface ColumnConfig {
  title: string;
  status: string;
  color: string;
  limit?: number;
}

export interface FilterOptions {
  assignee?: string;
  priority?: string;
  type?: string;
  labels?: string[];
  dueDate?: string;
}

export interface SearchOptions {
  query: string;
  filters: FilterOptions;
}
