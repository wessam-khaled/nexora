import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/auth";
import { AppError } from "@/errors/app-error";
import { ERROR_CODES, ROLES } from "@/constants";
import { findTask, findProjectById, findProjectMember } from "@/repositories";

export async function listComments(taskId: number, projectId: number) {
  const currentUser = await requireAuth();
  const project = await findProjectById(projectId, currentUser.companyId);
  if (!project) {
    throw new AppError("Project not found", 404, ERROR_CODES.NOT_FOUND);
  }
  const task = await findTask(projectId, taskId);
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
  return prisma.comment.findMany({
    where: {
      taskId: taskId,
    },
    select: {
      id: true,
      content: true,
      createdAt: true,
      user: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });
}
