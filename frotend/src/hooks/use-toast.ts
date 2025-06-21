import { toast } from "sonner";

interface ToastOptions {
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export const useToast = () => {
  const showToast = {
    success: (title: string, options?: ToastOptions) => {
      toast.success(title, {
        description: options?.description,
        action: options?.action && {
          label: options.action.label,
          onClick: options.action.onClick,
        },
      });
    },

    error: (title: string, options?: ToastOptions) => {
      toast.error(title, {
        description: options?.description,
        action: options?.action && {
          label: options.action.label,
          onClick: options.action.onClick,
        },
      });
    },

    info: (title: string, options?: ToastOptions) => {
      toast.info(title, {
        description: options?.description,
        action: options?.action && {
          label: options.action.label,
          onClick: options.action.onClick,
        },
      });
    },

    warning: (title: string, options?: ToastOptions) => {
      toast.warning(title, {
        description: options?.description,
        action: options?.action && {
          label: options.action.label,
          onClick: options.action.onClick,
        },
      });
    },
  };

  return showToast;
};
