import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ModeToggle } from "../mode-toggle";

interface NavBarProps {
  onCreateTask: () => void;
}

export const NavBar = ({ onCreateTask }: NavBarProps) => {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 bg-white/10 dark:bg-slate-900/40 backdrop-blur-lg border-b border-white/20 dark:border-purple-500/20 shadow-lg dark:shadow-purple-500/5"
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          <motion.h1
            className="text-xl md:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-purple-400 dark:to-fuchsia-400 truncate"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Gestionnaire de Tâches IT
          </motion.h1>

          <div className="flex items-center gap-2 md:gap-4">
            <ModeToggle />

            <Button
              onClick={onCreateTask}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-purple-500 dark:to-fuchsia-500 text-white hover:opacity-90 transition-opacity backdrop-blur-lg shadow-lg hover:shadow-xl dark:shadow-purple-500/20"
            >
              <Plus className="w-4 h-4 md:mr-2" />
              <span className="hidden md:inline">Nouvelle Tâche</span>
            </Button>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};
