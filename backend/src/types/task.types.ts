export type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE";

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  tags: string[];
  dueDate: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTaskDTO {
  title: string;
  description: string;
  status: TaskStatus;
  tags: string[];
  dueDate: Date;
}

export interface UpdateTaskDTO {
  title?: string;
  description?: string;
  status?: TaskStatus;
  tags?: string[];
  dueDate?: Date;
}

export interface TaskFilters {
  status?: TaskStatus;
  tags?: string[];
  search?: string;
  startDate?: Date;
  endDate?: Date;
}

export interface TasksResponse {
  tasks: Task[];
  total: number;
}
