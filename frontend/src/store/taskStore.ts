import { create } from "zustand";
import { persist } from "zustand/middleware";

// Type Definitions
type TaskStatus = "pending" | "in-progress" | "completed" | "archived";
type EpicStatus = "active" | "completed";

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

interface Epic {
  id: string;
  title: string;
  description: string;
  status: EpicStatus;
  createdAt: number;
  updatedAt: number;
}

interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  themeId: string;
  epicId?: string; // Optional reference to an epic
  createdAt: number;
  updatedAt: number;
}

// Store State Interface
interface TaskState {
  tasks: Task[];
  epics: Epic[];
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

  // Epic Operations
  createEpic: (title: string, description: string) => void;
  updateEpic: (
    id: string,
    updates: Partial<Omit<Epic, "id" | "createdAt" | "updatedAt">>
  ) => void;
  deleteEpic: (id: string) => void;
  completeEpic: (id: string) => void;

  // Task-Epic Relations
  assignTaskToEpic: (taskId: string, epicId: string) => void;
  removeTaskFromEpic: (taskId: string) => void;

  // Theme Operations
  createTheme: (theme: Omit<Theme, "id">) => void;
  updateTheme: (id: string, updates: Partial<Omit<Theme, "id">>) => void;
  deleteTheme: (id: string) => void;
  setActiveTheme: (id: string) => void;

  // Utility Operations
  getTasksByStatus: (status: TaskStatus) => Task[];
  getTasksByEpicId: (epicId: string) => Task[];
  getEpicById: (id: string) => Epic | undefined;
  getThemeById: (id: string) => Theme | undefined;
}

// Default Themes (unchanged)
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
      background: "#1e293b",
      text: "#e2e8f0",
      primary: "#60a5fa",
      secondary: "#94a3b8",
      accent: "#4ade80",
    },
  },
];

// Store Implementation
export const useTaskStore = create<TaskState>()(
  persist(
    (set, get) => ({
      tasks: [],
      epics: [],
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

      // Epic Operations
      createEpic: (title, description) =>
        set((state) => ({
          epics: [
            ...state.epics,
            {
              id: crypto.randomUUID(),
              title,
              description,
              status: "active" as EpicStatus,
              createdAt: Date.now(),
              updatedAt: Date.now(),
            },
          ],
        })),

      updateEpic: (id, updates) =>
        set((state) => ({
          epics: state.epics.map((epic) =>
            epic.id === id
              ? { ...epic, ...updates, updatedAt: Date.now() }
              : epic
          ),
        })),

      deleteEpic: (id) =>
        set((state) => ({
          epics: state.epics.filter((epic) => epic.id !== id),
          // Also remove epic reference from tasks
          tasks: state.tasks.map((task) =>
            task.epicId === id ? { ...task, epicId: undefined } : task
          ),
        })),

      completeEpic: (id) =>
        set((state) => ({
          epics: state.epics.map((epic) =>
            epic.id === id
              ? { ...epic, status: "completed", updatedAt: Date.now() }
              : epic
          ),
        })),

      // Task-Epic Relations
      assignTaskToEpic: (taskId, epicId) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === taskId
              ? { ...task, epicId, updatedAt: Date.now() }
              : task
          ),
        })),

      removeTaskFromEpic: (taskId) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === taskId
              ? { ...task, epicId: undefined, updatedAt: Date.now() }
              : task
          ),
        })),

      // Theme Operations (unchanged)
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

      getTasksByEpicId: (epicId) =>
        get().tasks.filter((task) => task.epicId === epicId),

      getEpicById: (id) => get().epics.find((epic) => epic.id === id),

      getThemeById: (id) => get().themes.find((theme) => theme.id === id),
    }),
    {
      name: "task-storage",
      version: 1,
    }
  )
);
