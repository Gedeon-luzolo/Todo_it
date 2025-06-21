import { motion } from "framer-motion";
import { Heart } from "lucide-react";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <motion.footer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-0 left-0 right-0 bg-white/10 dark:bg-slate-900/40 backdrop-blur-lg border-t border-white/20 dark:border-purple-500/20 shadow-lg dark:shadow-purple-500/5"
    >
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-center text-sm text-foreground/60 dark:text-purple-200/60">
          <span className="flex items-center gap-1">
            Créé avec{" "}
            <Heart className="w-4 h-4 text-red-500 dark:text-red-400 animate-pulse" />{" "}
            par l'équipe IT - {currentYear}
          </span>
        </div>
      </div>
    </motion.footer>
  );
};
