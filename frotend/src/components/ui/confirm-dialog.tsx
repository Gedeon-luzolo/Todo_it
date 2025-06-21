import { motion } from "framer-motion";
import { Button } from "./button";
import { Modal } from "./modal";

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "warning" | "info";
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = "Confirmer",
  cancelLabel = "Annuler",
  variant = "danger",
}: ConfirmDialogProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case "danger":
        return {
          button: "bg-red-600 hover:bg-red-700 focus:ring-red-500",
          icon: "text-red-600",
        };
      case "warning":
        return {
          button: "bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500",
          icon: "text-yellow-600",
        };
      case "info":
        return {
          button: "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500",
          icon: "text-blue-600",
        };
      default:
        return {
          button: "bg-red-600 hover:bg-red-700 focus:ring-red-500",
          icon: "text-red-600",
        };
    }
  };

  const variantStyles = getVariantStyles();

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="space-y-6"
      >
        <div className="mt-3 text-center sm:mt-5">
          <div className="mt-2">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {description}
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-white/20 dark:border-purple-500/20">
          <Button
            type="button"
            onClick={onClose}
            variant="outline"
            className="bg-white/50 dark:bg-slate-900/50 hover:bg-white/70 dark:hover:bg-purple-500/10 border-white/20 dark:border-purple-500/20 hover:border-indigo-500/50 dark:hover:border-purple-500/50 text-foreground/90 dark:text-purple-50"
          >
            {cancelLabel}
          </Button>
          <Button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`${variantStyles.button} text-white shadow-lg`}
          >
            {confirmLabel}
          </Button>
        </div>
      </motion.div>
    </Modal>
  );
}
