import { create } from "zustand";
import { persist } from "zustand/middleware";

// Type Definitions
type TaskStatus = "pending" | "in-progress" | "completed" | "archived";

interface Theme {
  id: string;
  name: string;
  isDark: boolean;
  colors: {
    background: string;
    text: string;
    primary: string;
    secondary: string;
    accent: string;
  };
}

interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  themeId: string;
  createdAt: number;
  updatedAt: number;
}

// Store State Interface
interface TaskState {
  tasks: Task[];
  themes: Theme[];
  activeTheme: string;

  // Task Operations
  createTask: (title: string, description: string) => void;
  updateTask: (
    id: string,
    updates: Partial<Omit<Task, "id" | "createdAt" | "updatedAt">>
  ) => void;
  deleteTask: (id: string) => void;
  moveTask: (id: string, status: TaskStatus) => void;

  // Theme Operations
  createTheme: (theme: Omit<Theme, "id">) => void;
  updateTheme: (id: string, updates: Partial<Omit<Theme, "id">>) => void;
  deleteTheme: (id: string) => void;
  setActiveTheme: (id: string) => void;

  // Utility Operations
  getTasksByStatus: (status: TaskStatus) => Task[];
  getThemeById: (id: string) => Theme | undefined;
}

// Default Themes
const defaultThemes: Theme[] = [
  {
    id: "light",
    name: "Light Theme",
    isDark: false,
    colors: {
      background: "#ffffff",
      text: "#334155",
      primary: "#3b82f6",
      secondary: "#64748b",
      accent: "#22c55e",
    },
  },
  {
    id: "dark",
    name: "Dark Theme",
    isDark: true,
    colors: {
      background: "#1e293b", // Softer dark blue
      text: "#e2e8f0", // Soft white
      primary: "#60a5fa", // Bright blue
      secondary: "#94a3b8", // Soft gray
      accent: "#4ade80", // Soft green
    },
  },
];

// Store Implementation
export const useTaskStore = create<TaskState>()(
  persist(
    (set, get) => ({
      tasks: [],
      themes: defaultThemes,
      activeTheme: "light",

      // Task Operations
      createTask: (title, description) =>
        set((state) => ({
          tasks: [
            ...state.tasks,
            {
              id: crypto.randomUUID(),
              title,
              description,
              status: "pending" as TaskStatus,
              themeId: state.activeTheme,
              createdAt: Date.now(),
              updatedAt: Date.now(),
            },
          ],
        })),

      updateTask: (id, updates) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id
              ? { ...task, ...updates, updatedAt: Date.now() }
              : task
          ),
        })),

      deleteTask: (id) =>
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== id),
        })),

      moveTask: (id, status) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id ? { ...task, status, updatedAt: Date.now() } : task
          ),
        })),

      // Theme Operations
      createTheme: (theme) =>
        set((state) => ({
          themes: [...state.themes, { ...theme, id: crypto.randomUUID() }],
        })),

      updateTheme: (id, updates) =>
        set((state) => ({
          themes: state.themes.map((theme) =>
            theme.id === id ? { ...theme, ...updates } : theme
          ),
        })),

      deleteTheme: (id) =>
        set((state) => ({
          themes: state.themes.filter((theme) => theme.id !== id),
          activeTheme: state.activeTheme === id ? "light" : state.activeTheme,
        })),

      setActiveTheme: (id) => set({ activeTheme: id }),

      // Utility Operations
      getTasksByStatus: (status) =>
        get().tasks.filter((task) => task.status === status),
      getThemeById: (id) => get().themes.find((theme) => theme.id === id),
    }),
    {
      name: "task-storage",
      // Optional: Add version number for future migrations
      version: 1,
    }
  )
);
