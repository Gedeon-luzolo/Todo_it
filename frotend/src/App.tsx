import { useState } from "react";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { NavBar } from "@/components/ui/navbar";
import { Footer } from "@/components/ui/footer";
import { Modal } from "@/components/ui/modal";
import { TaskForm } from "@/components/task/task-form";
import { TaskGroup } from "@/components/task/task-group";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useTasks, useCreateTask } from "@/hooks/use-tasks";
import { groupTasksByTime } from "@/lib/utils";
import type { CreateTaskDTO, TaskStatus } from "@/types/task.types";

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<
    TaskStatus | undefined
  >();
  const [groupBy, setGroupBy] = useState<"week" | "month" | "year">("week");

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

  const GROUP_OPTIONS = [
    { value: "week" as const, label: "Par semaine" },
    { value: "month" as const, label: "Par mois" },
    { value: "year" as const, label: "Par année" },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-indigo-50 dark:from-slate-900 dark:via-indigo-950 dark:to-purple-950">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-indigo-500 dark:border-purple-500"></div>
      </div>
    );
  }

  const groupedTasks = tasksData?.tasks
    ? groupTasksByTime(tasksData.tasks, groupBy)
    : [];

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className="min-h-screen relative">
        <div className="relative">
          <NavBar onCreateTask={() => setIsModalOpen(true)} />

          <main className="container mx-auto px-4 py-8 mt-20 mb-16">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/10 backdrop-blur-lg border border-white/20 dark:bg-slate-900/40 dark:border-purple-500/20 shadow-lg dark:shadow-purple-500/5 rounded-xl p-6 mb-8 hover:shadow-xl transition-all duration-300"
            >
              <div className="flex flex-col gap-4">
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

                <div className="flex flex-wrap gap-4">
                  {GROUP_OPTIONS.map((option) => (
                    <Button
                      key={option.value}
                      variant={groupBy === option.value ? "default" : "outline"}
                      onClick={() => setGroupBy(option.value)}
                      className={`
                        backdrop-blur-md transition-all duration-300
                        ${
                          groupBy === option.value
                            ? "bg-white/20 text-indigo-600 dark:bg-purple-500/20 dark:text-purple-300 border-indigo-300 dark:border-purple-500/30 shadow-lg dark:shadow-purple-500/20"
                            : "bg-white/5 hover:bg-white/10 dark:hover:bg-purple-500/10 border-white/10 dark:border-purple-500/20"
                        }
                      `}
                    >
                      {option.label}
                    </Button>
                  ))}
                </div>
              </div>
            </motion.div>

            <AnimatePresence mode="wait">
              {groupedTasks.map((group) => (
                <TaskGroup
                  key={group.label}
                  label={group.label}
                  tasks={group.tasks}
                />
              ))}
            </AnimatePresence>
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
