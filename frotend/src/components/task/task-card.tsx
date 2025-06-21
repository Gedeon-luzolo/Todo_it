import { motion } from "framer-motion";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TaskActions } from "./task-actions";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useDeleteTask } from "@/hooks/use-tasks";
import type { Task } from "@/types/task.types";

export interface TaskStatus {
  value: "a-faire" | "en-cours" | "en-revue" | "termine";
  label: string;
}

interface TaskCardProps {
  task: Task;
}

const STATUS_STYLES = {
  TODO: {
    bg: "bg-yellow-500/10",
    border: "border-yellow-500/20",
    text: "text-yellow-500",
    label: "À faire",
  },
  IN_PROGRESS: {
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
    text: "text-blue-500",
    label: "En cours",
  },
  DONE: {
    bg: "bg-green-500/10",
    border: "border-green-500/20",
    text: "text-green-500",
    label: "Terminé",
  },
};

export function TaskCard({ task }: TaskCardProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { mutate: deleteTask } = useDeleteTask();
  const statusStyle = STATUS_STYLES[task.status];

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.2 }}
      >
        <Card className="overflow-hidden bg-white/10 dark:bg-slate-900/40 border-white/20 dark:border-purple-500/20 backdrop-blur-lg hover:shadow-xl transition-all duration-300">
          <div>
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-semibold text-foreground/90 dark:text-purple-50">
                {task.title}
              </h3>
              <TaskActions
                task={task}
                onDelete={() => setIsDeleteDialogOpen(true)}
                onEdit={() => {}}
              />
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
              {task.description}
            </p>
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge
                className={`${statusStyle.bg} ${statusStyle.border} ${statusStyle.text}`}
              >
                {statusStyle.label}
              </Badge>
              {task.tags && task.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {task.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="outline"
                      className="bg-white/5 border-white/10 text-foreground/70 dark:border-purple-500/20 dark:text-purple-200"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {task.dueDate && (
              <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                Échéance : {new Date(task.dueDate).toLocaleDateString("fr-FR")}
              </div>
            )}
          </div>
        </Card>
      </motion.div>

      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={() => deleteTask(task.id)}
        title="Supprimer la tâche"
        description={`Êtes-vous sûr de vouloir supprimer la tâche "${task.title}" ? Cette action est irréversible.`}
        confirmLabel="Supprimer"
        cancelLabel="Annuler"
        variant="danger"
      />
    </>
  );
}
