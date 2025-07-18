export type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE";

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
  dueDate: Date;
}

export interface CreateTaskDTO {
  title: string;
  description: string;
  status: TaskStatus;
  dueDate: Date;
  tags: string[];
}

export interface UpdateTaskDTO {
  title?: string;
  description?: string;
  status?: TaskStatus;
  dueDate?: Date;
  tags?: string[];
}

export interface TasksResponse {
  tasks: Task[];
  total: number;
}

export interface TaskFilters {
  status?: TaskStatus;
  search?: string;
  page?: number;
  limit?: number;
}
