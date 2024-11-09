import { create } from "zustand";
import * as api from "../services/api";

// Reuse your existing types
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
  epicId?: string;
  createdAt: number;
  updatedAt: number;
}

interface ApiTaskState {
  tasks: Task[];
  epics: Epic[];
  isLoading: boolean;
  error: string | null;

  // Async operations
  fetchTasks: () => Promise<void>;
  fetchEpics: () => Promise<void>;

  // Basic operations (starting with just a few)
  createTask: (title: string, description: string) => Promise<string>;
  createEpic: (title: string, description: string) => Promise<string>;
}

export const useApiTaskStore = create<ApiTaskState>()((set, get) => ({
  tasks: [],
  epics: [],
  isLoading: false,
  error: null,

  fetchTasks: async () => {
    set({ isLoading: true, error: null });
    try {
      const tasks = await api.fetchTasks();
      set({ tasks, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  fetchEpics: async () => {
    set({ isLoading: true, error: null });
    try {
      const epics = await api.fetchEpics();
      set({ epics, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  createTask: async (title: string, description: string) => {
    set({ isLoading: true, error: null });
    try {
      const task = await api.createTask({ title, description });
      set((state) => ({
        tasks: [...state.tasks, task],
        isLoading: false,
      }));
      return task.id;
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      return "";
    }
  },

  createEpic: async (title: string, description: string) => {
    set({ isLoading: true, error: null });
    try {
      const epic = await api.createEpic({ title, description });
      set((state) => ({
        epics: [...state.epics, epic],
        isLoading: false,
      }));
      return epic.id;
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      return "";
    }
  },
}));
