import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useEffect } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const Modal = ({ isOpen, onClose, title, children }: ModalProps) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        {/* Overlay avec effet de flou */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm"
        />

        {/* Contenu du modal */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-xl dark:shadow-purple-500/10 border border-white/20 dark:border-purple-500/20"
        >
          {/* En-tête */}
          <div className="flex items-center justify-between border-b border-white/20 dark:border-purple-500/20 p-6">
            <h2 className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-purple-400 dark:to-fuchsia-400">
              {title}
            </h2>
            <button
              onClick={onClose}
              className="rounded-lg p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-white/20 dark:hover:bg-purple-500/10 transition-colors"
            >
              <X className="h-5 w-5" />
              <span className="sr-only">Fermer</span>
            </button>
          </div>

          {/* Corps */}
          <div className="p-6">{children}</div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
