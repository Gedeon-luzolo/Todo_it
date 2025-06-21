import { RequestHandler, Router } from "express";
import { TaskController } from "../controllers/task.controller";

const router = Router();

// Routes pour les tâches
router.get("/", TaskController.getTasks);
router.get("/:id", TaskController.getTaskById as RequestHandler);
router.post("/", TaskController.createTask as RequestHandler);
router.patch("/:id", TaskController.updateTask as RequestHandler);
router.delete("/:id", TaskController.deleteTask as RequestHandler);

export default router;
