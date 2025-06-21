import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { TaskService } from "@/services/task.service";
import { useToast } from "@/hooks/use-toast";
import type { Task, TaskFilters, TaskStatus } from "@/types/task.types";

interface TaskId {
  id: string;
  task: Task;
  status?: TaskStatus;
}

// Clés de query pour React Query
export const taskKeys = {
  all: ["tasks"] as const,
  lists: () => [...taskKeys.all, "list"] as const,
  list: (filters: TaskFilters) => [...taskKeys.lists(), filters] as const,
  details: () => [...taskKeys.all, "detail"] as const,
  detail: (id: string) => [...taskKeys.details(), id] as const,
};

// Hook pour récupérer les tâches
export function useTasks(filters?: TaskFilters) {
  return useQuery({
    queryKey: taskKeys.list(filters || {}),
    queryFn: () => TaskService.getTasks(filters),
  });
}

// Hook pour récupérer une tâche par ID
export function useTask(id: string) {
  return useQuery({
    queryKey: taskKeys.detail(id),
    queryFn: () => TaskService.getTaskById(id),
  });
}

// Hook pour créer une tâche
export function useCreateTask() {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: TaskService.createTask,
    onSuccess: (newTask) => {
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
      toast.success("Tâche créée", {
        description: `La tâche "${newTask.title}" a été créée avec succès.`,
      });
    },
    onError: () => {
      toast.error("Erreur de création", {
        description: "Impossible de créer la tâche. Veuillez réessayer.",
      });
    },
  });
}

// Hook pour mettre à jour une tâche
export function useUpdateTask() {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: ({ id, task }: TaskId) => TaskService.updateTask(id, task),
    onSuccess: (updatedTask) => {
      queryClient.invalidateQueries({
        queryKey: taskKeys.detail(updatedTask.id),
      });
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
      toast.success("Tâche mise à jour", {
        description: `La tâche "${updatedTask.title}" a été mise à jour avec succès.`,
      });
    },
    onError: () => {
      toast.error("Erreur de mise à jour", {
        description:
          "Impossible de mettre à jour la tâche. Veuillez réessayer.",
      });
    },
  });
}

// Hook pour supprimer une tâche
export function useDeleteTask() {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: TaskService.deleteTask,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
      toast.success("Tâche supprimée", {
        description: "La tâche a été supprimée avec succès.",
      });
    },
    onError: () => {
      toast.error("Erreur de suppression", {
        description: "Impossible de supprimer la tâche. Veuillez réessayer.",
      });
    },
  });
}
