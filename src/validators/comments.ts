import { z } from "zod";

export const createCommentSchema = z.object({
  content: z.string().trim().min(1),
});

export const updateCommentSchema = z.object({
  content: z.string().trim().min(1),
});

export const commentIdSchema = z.object({
  projectId: z.coerce.number().int().positive(),
  taskId: z.coerce.number().int().positive(),
  commentId: z.coerce.number().int().positive(),
});
