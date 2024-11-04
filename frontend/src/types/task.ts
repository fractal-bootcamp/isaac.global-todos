// src/types/task.ts
export type TaskStatus = "pending" | "in-progress" | "completed" | "archived";

export const TASK_STATUSES: { value: TaskStatus; label: string }[] = [
  { value: "pending", label: "Pending" },
  { value: "in-progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
  { value: "archived", label: "Archived" },
];

export const getStatusBadgeColor = (status: TaskStatus): string => {
  const colors = {
    pending: "bg-yellow-100 text-yellow-800",
    "in-progress": "bg-blue-100 text-blue-800",
    completed: "bg-green-100 text-green-800",
    archived: "bg-gray-100 text-gray-800",
  };
  return colors[status] || colors.pending;
};
