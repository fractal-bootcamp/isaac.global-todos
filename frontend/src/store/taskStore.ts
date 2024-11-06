import { create } from "zustand";

// Type Definitions
type TaskStatus = "pending" | "in-progress" | "completed" | "archived";
type EpicStatus = "active" | "completed";

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
  epicId?: string; // Optional reference to an epic
  createdAt: number;
  updatedAt: number;
}

// Store State Interface
interface TaskState {
  tasks: Task[];
  epics: Epic[];

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

  // Utility Operations
  getTasksByStatus: (status: TaskStatus) => Task[];
  getTasksByEpicId: (epicId: string) => Task[];
  getEpicById: (id: string) => Epic | undefined;
}

// Store Implementation
export const useTaskStore = create<TaskState>()((set, get) => ({
  tasks: [],
  epics: [],

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
          createdAt: Date.now(),
          updatedAt: Date.now(),
        },
      ],
    })),

  updateTask: (id, updates) =>
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === id ? { ...task, ...updates, updatedAt: Date.now() } : task
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
        epic.id === id ? { ...epic, ...updates, updatedAt: Date.now() } : epic
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
        task.id === taskId ? { ...task, epicId, updatedAt: Date.now() } : task
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

  // Utility Operations
  getTasksByStatus: (status) =>
    get().tasks.filter((task) => task.status === status),

  getTasksByEpicId: (epicId) =>
    get().tasks.filter((task) => task.epicId === epicId),

  getEpicById: (id) => get().epics.find((epic) => epic.id === id),
}));
