import { api } from "@/lib/axios";
import type {
  Task,
  TasksResponse,
  CreateTaskDTO,
  UpdateTaskDTO,
  TaskFilters,
} from "@/types/task.types";
import { toast } from "sonner";

export const TaskService = {
  // Récupérer toutes les tâches avec filtres
  async getTasks(filters?: TaskFilters): Promise<TasksResponse> {
    try {
      const { data } = await api.get<TasksResponse>("/tasks", {
        params: filters,
      });
      return data;
    } catch {
      toast.error("Erreur de chargement", {
        description: "Impossible de charger les tâches. Veuillez réessayer.",
      });
      return { tasks: [], total: 0 };
    }
  },

  // Récupérer une tâche par son ID
  async getTaskById(id: string): Promise<Task | null> {
    try {
      const { data } = await api.get<Task>(`/tasks/${id}`);
      return data;
    } catch {
      toast.error("Erreur de chargement", {
        description: "Impossible de charger les détails de la tâche.",
      });
      return null;
    }
  },

  // Créer une nouvelle tâche
  async createTask(task: CreateTaskDTO): Promise<Task> {
    const { data } = await api.post<Task>("/tasks", task);
    return data;
  },

  // Mettre à jour une tâche
  async updateTask(id: string, task: UpdateTaskDTO): Promise<Task> {
    const { data } = await api.patch<Task>(`/tasks/${id}`, task);
    return data;
  },

  // Supprimer une tâche
  async deleteTask(id: string): Promise<void> {
    await api.delete(`/tasks/${id}`);
  },
};
