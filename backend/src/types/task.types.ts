export type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE";

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTaskDTO {
  title: string;
  description: string;
  status: TaskStatus;
}

export interface UpdateTaskDTO {
  title?: string;
  description?: string;
  status?: TaskStatus;
}

export interface TaskFilters {
  status?: TaskStatus;
  search?: string;
}

export interface TasksResponse {
  tasks: Task[];
  total: number;
}
