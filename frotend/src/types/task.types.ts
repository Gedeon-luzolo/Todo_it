export type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE";

export interface TaskPriority {
  level: "faible" | "moyenne" | "haute" | "critique";
  color: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTaskDTO {
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: Date;
  tags: string[];
}

export interface UpdateTaskDTO {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority["level"];
  dueDate?: Date;
  tags?: string[];
}

export interface TasksResponse {
  tasks: Task[];
  total: number;
}

export interface TaskFilters {
  status?: TaskStatus;
  priority?: TaskPriority["level"];
  search?: string;
  page?: number;
  limit?: number;
}
