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

/* New edition, the epics */

export type EpicStatus = "active" | "completed";

export interface Epic {
  id: string;
  title: string;
  description: string;
  status: EpicStatus;
  createdAt: number;
  updatedAt: number;
}

// Add Epic status constants (like TASK_STATUSES)
export const EPIC_STATUSES: { value: EpicStatus; label: string }[] = [
  { value: "active", label: "Active" },
  { value: "completed", label: "Completed" },
];

// Add utility function for epic status colors
export const getEpicStatusBadgeColor = (status: EpicStatus): string => {
  const colors = {
    active: "bg-blue-100 text-blue-800",
    completed: "bg-green-100 text-green-800",
  };
  return colors[status] || colors.active;
};
