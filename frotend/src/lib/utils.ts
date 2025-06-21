import type { Task } from "@/types/task.types";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type TimeGroup = "week" | "month" | "year";

interface GroupedTasks {
  label: string;
  tasks: Task[];
}

export function groupTasksByTime(
  tasks: Task[],
  groupBy: TimeGroup
): GroupedTasks[] {
  const grouped = new Map<string, Task[]>();

  tasks.forEach((task) => {
    const date = new Date(task.createdAt);
    let key: string;

    switch (groupBy) {
      case "week": {
        // Get the first day of the week (Monday)
        const firstDay = new Date(date);
        const day = date.getDay();
        const diff = date.getDate() - day + (day === 0 ? -6 : 1);
        firstDay.setDate(diff);
        key = `Semaine du ${firstDay.toLocaleDateString("fr-FR")}`;
        break;
      }
      case "month": {
        key = date.toLocaleDateString("fr-FR", {
          month: "long",
          year: "numeric",
        });
        break;
      }
      case "year": {
        key = date.getFullYear().toString();
        break;
      }
    }

    if (!grouped.has(key)) {
      grouped.set(key, []);
    }
    grouped.get(key)!.push(task);
  });

  // Convert map to array and sort by date (most recent first)
  return Array.from(grouped.entries())
    .map(([label, tasks]) => ({ label, tasks }))
    .sort((a, b) => {
      const dateA = new Date(a.tasks[0].createdAt);
      const dateB = new Date(b.tasks[0].createdAt);
      return dateB.getTime() - dateA.getTime();
    });
}
