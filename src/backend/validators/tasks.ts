import { z } from "zod";
import { TASK_PRIORITY, TASK_STATUS } from "@/backend/constants";

export const createTaskSchema = z.object({
  projectId: z.coerce.number().int().positive(),
  title: z.string().trim().min(1),
  description: z.string().trim().min(1).optional(),
  priority: z.enum(Object.values(TASK_PRIORITY)),
  assignedTo: z.coerce.number().int().positive().optional(),
  dueDate: z.coerce.date().optional(),
});

export const getTaskSchema = z.object({
  projectId: z.coerce.number().int().positive(),
  taskId: z.coerce.number().int().positive(),
});

export const updateTaskSchema = z.object({
  title: z.string().trim().min(1).optional(),
  description: z.string().trim().min(1).optional(),
  priority: z.enum(Object.values(TASK_PRIORITY)).optional(),
  assignedTo: z.coerce.number().int().positive().optional(),
  dueDate: z.coerce.date().optional(),
  status: z.enum(Object.values(TASK_STATUS)).optional(),
});
