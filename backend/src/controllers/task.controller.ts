import { Request, Response } from "express";
import { TaskModel } from "../models/task.model";
import type {
  CreateTaskDTO,
  UpdateTaskDTO,
  TaskFilters,
} from "../types/task.types";

export class TaskController {
  // Récupérer toutes les tâches avec filtres
  static async getTasks(req: Request, res: Response) {
    try {
      const filters: TaskFilters = {
        status: req.query.status as any,
        search: req.query.search as string,
      };

      const tasks = await TaskModel.findAll(filters);
      res.json(tasks);
    } catch (error) {
      console.error("Erreur lors de la récupération des tâches:", error);
      res
        .status(500)
        .json({ message: "Erreur serveur lors de la récupération des tâches" });
    }
  }

  // Récupérer une tâche par son ID
  static async getTaskById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const task = await TaskModel.findById(id);

      if (!task) {
        return res.status(404).json({ message: "Tâche non trouvée" });
      }

      res.json(task);
    } catch (error) {
      console.error("Erreur lors de la récupération de la tâche:", error);
      res.status(500).json({
        message: "Erreur serveur lors de la récupération de la tâche",
      });
    }
  }

  // Créer une nouvelle tâche
  static async createTask(req: Request, res: Response) {
    try {
      const taskData: CreateTaskDTO = req.body;

      // Validation basique
      if (!taskData.title || !taskData.status) {
        return res
          .status(400)
          .json({ message: "Le titre et le statut sont requis" });
      }

      const newTask = await TaskModel.create(taskData);
      res.status(201).json(newTask);
    } catch (error) {
      console.error("Erreur lors de la création de la tâche:", error);
      res
        .status(500)
        .json({ message: "Erreur serveur lors de la création de la tâche" });
    }
  }

  // Mettre à jour une tâche
  static async updateTask(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const taskData: UpdateTaskDTO = req.body;

      const updatedTask = await TaskModel.update(id, taskData);

      if (!updatedTask) {
        return res.status(404).json({ message: "Tâche non trouvée" });
      }

      res.json(updatedTask);
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la tâche:", error);
      res
        .status(500)
        .json({ message: "Erreur serveur lors de la mise à jour de la tâche" });
    }
  }

  // Supprimer une tâche
  static async deleteTask(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const deleted = await TaskModel.delete(id);

      if (!deleted) {
        return res.status(404).json({ message: "Tâche non trouvée" });
      }

      res.status(204).send();
    } catch (error) {
      console.error("Erreur lors de la suppression de la tâche:", error);
      res
        .status(500)
        .json({ message: "Erreur serveur lors de la suppression de la tâche" });
    }
  }
}
