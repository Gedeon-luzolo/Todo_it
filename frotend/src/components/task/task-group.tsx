import type { Task } from "@/types/task.types";
import { TaskCard } from "./task-card";
import { motion } from "framer-motion";

interface TaskGroupProps {
  label: string;
  tasks: Task[];
}

export function TaskGroup({ label, tasks }: TaskGroupProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="mb-8"
    >
      <h2 className="text-2xl font-semibold mb-4 text-slate-800 dark:text-slate-200">
        {label}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>
    </motion.div>
  );
}
