import { z } from "zod";
import { PROJECT_ROLES, PROJECT_STATUS } from "@/constants";

export const createProjectSchema = z.object({
  name: z.string().trim().min(1),
  description: z.string().trim().optional(),
});

export const projectIdSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const addMemberSchema = z.object({
  projectId: z.coerce.number().int().positive(),
  userId: z.coerce.number().int().positive(),
  role: z.enum(Object.values(PROJECT_ROLES)).optional(),
});

export const changeProjectMemberRoleSchema = z.object({
  projectId: z.coerce.number().int().positive(),
  userId: z.coerce.number().int().positive(),
  role: z.enum(Object.values(PROJECT_ROLES)),
});

export const removeMemberSchema = z.object({
  projectId: z.coerce.number().int().positive(),
  userId: z.coerce.number().int().positive(),
});

export const updateProjectSchema = z.object({
  name: z.string().trim().min(1).optional(),
  description: z.string().trim().min(1).optional(),
  status: z.enum(Object.values(PROJECT_STATUS)).optional(),
});