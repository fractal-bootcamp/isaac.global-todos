import { z } from "zod";

// Status Schemas
export const taskStatusSchema = z.enum([
  "pending",
  "in-progress",
  "completed",
  "archived",
] as const);
export const epicStatusSchema = z.enum(["active", "completed"] as const);

// Core Schemas
export const taskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  status: taskStatusSchema.optional().default("pending"),
  epicId: z.string().optional(),
});

export const epicSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  status: epicStatusSchema.optional().default("active"),
});

// AI Response Schema
export const aiResponseSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("tasks"),
    data: z.object({
      tasks: z.array(taskSchema),
    }),
  }),
  z.object({
    type: z.literal("epic"),
    data: z.object({
      epic: epicSchema,
      tasks: z.array(taskSchema).optional(),
    }),
  }),
]);

// Type Exports
export type AIResponse = z.infer<typeof aiResponseSchema>;
export type Task = z.infer<typeof taskSchema>;
export type Epic = z.infer<typeof epicSchema>;
export type Message = {
  role: "user" | "assistant";
  content: string;
};

export interface TaskStore {
  createTask: (title: string, description: string) => void;
  createEpic: (title: string, description: string) => void;
  assignTaskToEpic: (taskId: string, epicId: string) => void;
}
