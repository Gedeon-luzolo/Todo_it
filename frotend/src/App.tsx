import { useState } from "react";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { NavBar } from "@/components/ui/navbar";
import { Footer } from "@/components/ui/footer";
import { Modal } from "@/components/ui/modal";
import { TaskForm } from "@/components/task/task-form";
import { TaskCard } from "@/components/task/task-card";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useTasks, useCreateTask } from "@/hooks/use-tasks";
import type { CreateTaskDTO, TaskStatus } from "@/types/task.types";

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<
    TaskStatus | undefined
  >();

  const { data: tasksData, isLoading } = useTasks({
    status: selectedStatus,
  });

  const { mutate: createTask } = useCreateTask();

  const STATUS_OPTIONS = [
    { value: undefined, label: "Tous" },
    { value: "TODO" as TaskStatus, label: "À faire" },
    { value: "IN_PROGRESS" as TaskStatus, label: "En cours" },
    { value: "DONE" as TaskStatus, label: "Terminé" },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-indigo-50 dark:from-slate-900 dark:via-indigo-950 dark:to-purple-950">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-indigo-500 dark:border-purple-500"></div>
      </div>
    );
  }

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className="min-h-screen relative bg-gradient-to-br from-slate-50 to-indigo-50 dark:from-slate-900 dark:via-indigo-950 dark:to-purple-950">
        <div className="relative">
          <NavBar onCreateTask={() => setIsModalOpen(true)} />

          <main className="container mx-auto px-4 py-8 mt-20 mb-16">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/10 backdrop-blur-lg border border-white/20 dark:bg-slate-900/40 dark:border-purple-500/20 shadow-lg dark:shadow-purple-500/5 rounded-xl p-6 mb-8 hover:shadow-xl transition-all duration-300"
            >
              <div className="flex flex-wrap gap-4">
                {STATUS_OPTIONS.map((status) => (
                  <Button
                    key={status.value || "all"}
                    variant={
                      selectedStatus === status.value ? "default" : "outline"
                    }
                    onClick={() => setSelectedStatus(status.value)}
                    className={`
                      backdrop-blur-md transition-all duration-300
                      ${
                        selectedStatus === status.value
                          ? "bg-white/20 text-indigo-600 dark:bg-purple-500/20 dark:text-purple-300 border-indigo-300 dark:border-purple-500/30 shadow-lg dark:shadow-purple-500/20"
                          : "bg-white/5 hover:bg-white/10 dark:hover:bg-purple-500/10 border-white/10 dark:border-purple-500/20"
                      }
                    `}
                  >
                    {status.label}
                  </Button>
                ))}
              </div>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence>
                {tasksData?.tasks.map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </AnimatePresence>
            </div>
          </main>

          <Footer />

          <Modal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            title="Créer une nouvelle tâche"
          >
            <TaskForm
              onSubmit={(taskData) => {
                createTask(taskData as unknown as CreateTaskDTO);
                setIsModalOpen(false);
              }}
              onCancel={() => setIsModalOpen(false)}
            />
          </Modal>
        </div>
        <Toaster />
      </div>
    </ThemeProvider>
  );
}

export default App;
