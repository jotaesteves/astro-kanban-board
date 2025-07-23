export interface Column {
  id: number;
  title: string;
  status: TaskStatus;
  tasks: Task[];
}

export interface Task {
  id: number;
  title: string;
  status: TaskStatus;
  type?: TaskType;
  labels?: string[];
  tags?: string[];
  description?: string;
  assignee?: string;
  dueDate?: string;
  priority?: TaskPriority;
  createdAt?: string;
  updatedAt?: string;
  comments?: Comment[];
}

export interface TaskFilter {
  status?: TaskStatus;
  type?: TaskType;
  assignee?: string;
  labels?: string[];
  tags?: string[];
  dueDateRange?: { start: string; end: string };
  priority?: TaskPriority;
  searchQuery?: string;
}
export enum TaskPriority {
  Low = "low",
  Medium = "medium",
  High = "high",
}

export enum TaskType {
  Task = "task",
  Bug = "bug",
  Feature = "feature",
  Improvement = "improvement",
  Epic = "epic",
}

export enum TaskStatus {
  Backlog = "backlog",
  InProgress = "in-progress",
  Review = "review",
  Done = "done",
}

export interface Label {
  id: number;
  name: string;
  color: string;
}
export interface Tag {
  id: number;
  name: string;
  color: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}
export interface Attachment {
  id: number;
  taskId: number;
  fileName: string;
  fileType: string;
  fileSize: number;
  url: string;
  uploadedAt: string;
  uploadedBy: string;
  thumbnailUrl?: string;
  isPublic?: boolean;
  metadata?: Record<string, any>;
  tags?: string[];
  comments?: Comment[];
}
export interface Comment {
  id: number;
  taskId: number;
  content: string;
  author: string;
  createdAt: string;
  updatedAt: string;
}
export interface User {
  id: number;
  name: string;
  email: string;
  avatarUrl?: string;
}
export interface KanbanBoard {
  columns: Column[];
  tasks: Task[];
  users: User[];
}
export interface KanbanBoardConfig {
  boardName: string;
  description?: string;
  createdBy: string;
  createdAt: string;
  updatedAt?: string;
  isPublic?: boolean;
}
export interface KanbanBoardState {
  boards: KanbanBoard[];
  currentBoardId?: number;
  currentUser?: User;
  isLoading: boolean;
  error?: string;
}
export type KanbanBoardAction =
  | { type: "ADD_TASK"; payload: Task }
  | { type: "UPDATE_TASK"; payload: Task }
  | { type: "DELETE_TASK"; payload: { taskId: number } }
  | { type: "ADD_COLUMN"; payload: Column }
  | { type: "UPDATE_COLUMN"; payload: Column }
  | { type: "DELETE_COLUMN"; payload: { columnId: number } }
  | { type: "SET_CURRENT_BOARD"; payload: { boardId: number } }
  | { type: "SET_CURRENT_USER"; payload: User }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string };
