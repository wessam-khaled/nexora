import { prisma } from "@/backend/lib/prisma";
import { requireAuth } from "@/backend/auth";
import { AppError } from "@/backend/errors/app-error";
import { ERROR_CODES, ROLES } from "@/backend/constants";
import {
  findTask,
  findProjectById,
  findProjectMember,
} from "@/backend/repositories";

export async function createComment(input: {
  taskId: number;
  content: string;
  projectId: number;
}) {
  const currentUser = await requireAuth();
  const project = await findProjectById(input.projectId, currentUser.companyId);
  if (!project) {
    throw new AppError("Project not found", 404, ERROR_CODES.NOT_FOUND);
  }
  const task = await findTask(input.projectId, input.taskId);
  if (!task) {
    throw new AppError("Task not found", 404, ERROR_CODES.NOT_FOUND);
  }
  const isProjectMember = await findProjectMember(currentUser.id, project.id);
  if (!isProjectMember && currentUser.role !== ROLES.OWNER) {
    throw new AppError(
      "You are not a member of this project",
      403,
      ERROR_CODES.FORBIDDEN,
    );
  }
  return prisma.comment.create({
    data: {
      content: input.content,
      taskId: input.taskId,
      userId: currentUser.id,
    },
  });
}
