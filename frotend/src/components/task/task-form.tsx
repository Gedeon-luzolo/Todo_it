import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import type {
  Task,
  CreateTaskDTO,
  UpdateTaskDTO,
  TaskStatus,
} from "@/types/task.types";

interface TaskFormProps {
  onSubmit: (task: CreateTaskDTO | UpdateTaskDTO) => void;
  onCancel: () => void;
  initialData?: Task;
}

const STATUS_OPTIONS = [
  { value: "TODO" as TaskStatus, label: "À faire" },
  { value: "IN_PROGRESS" as TaskStatus, label: "En cours" },
  { value: "DONE" as TaskStatus, label: "Terminé" },
];

export const TaskForm = ({
  onSubmit,
  onCancel,
  initialData,
}: TaskFormProps) => {
  const toast = useToast();

  const handleSubmit = async (formData: FormData) => {
    const taskData = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      status: formData.get("status") as TaskStatus,
    };

    console.log(taskData);

    try {
      await onSubmit(taskData);
      toast.success(
        initialData ? "Tâche modifiée avec succès" : "Tâche créée avec succès",
        {
          description: taskData.title,
        }
      );
      onCancel();
    } catch {
      toast.error(
        initialData
          ? "Erreur lors de la modification"
          : "Erreur lors de la création",
        {
          description: "Une erreur est survenue, veuillez réessayer.",
        }
      );
    }
  };

  return (
    <form action={handleSubmit} className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <div>
          <Input
            name="title"
            placeholder="Titre de la tâche"
            defaultValue={initialData?.title}
            className="w-full bg-white/50 dark:bg-slate-900/50 border-white/20 dark:border-purple-500/20 focus:border-indigo-500/50 dark:focus:border-purple-500/50 focus:ring-2 focus:ring-indigo-500/20 dark:focus:ring-purple-500/20 backdrop-blur-sm text-foreground/90 dark:text-purple-50 placeholder:text-slate-500 dark:placeholder:text-slate-400"
            required
          />
        </div>

        <div>
          <Textarea
            name="description"
            placeholder="Description détaillée"
            defaultValue={initialData?.description}
            className="w-full bg-white/50 dark:bg-slate-900/50 border-white/20 dark:border-purple-500/20 focus:border-indigo-500/50 dark:focus:border-purple-500/50 focus:ring-2 focus:ring-indigo-500/20 dark:focus:ring-purple-500/20 backdrop-blur-sm min-h-[100px] text-foreground/90 dark:text-purple-50 placeholder:text-slate-500 dark:placeholder:text-slate-400"
            required
          />
        </div>

        <div>
          <select
            name="status"
            defaultValue={initialData?.status || "TODO"}
            className="w-full bg-white/50 dark:bg-slate-900/50 border-white/20 dark:border-purple-500/20 focus:border-indigo-500/50 dark:focus:border-purple-500/50 focus:ring-2 focus:ring-indigo-500/20 dark:focus:ring-purple-500/20 py-2 px-3 rounded-md text-foreground/90 dark:text-purple-50"
            required
          >
            {STATUS_OPTIONS.map((status) => (
              <option
                key={status.value}
                value={status.value}
                className="bg-white dark:bg-slate-900"
              >
                {status.label}
              </option>
            ))}
          </select>
        </div>
      </motion.div>

      <div className="flex justify-end gap-3 pt-4 border-t border-white/20 dark:border-purple-500/20">
        <Button
          type="button"
          onClick={onCancel}
          variant="outline"
          className="bg-white/50 dark:bg-slate-900/50 hover:bg-white/70 dark:hover:bg-purple-500/10 border-white/20 dark:border-purple-500/20 hover:border-indigo-500/50 dark:hover:border-purple-500/50 text-foreground/90 dark:text-purple-50"
        >
          Annuler
        </Button>
        <Button
          type="submit"
          className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-purple-500 dark:to-fuchsia-500 text-white hover:opacity-90 shadow-lg hover:shadow-indigo-500/20 dark:hover:shadow-purple-500/20"
        >
          {initialData ? "Modifier" : "Créer"} la tâche
        </Button>
      </div>
    </form>
  );
};
