import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/auth";
import { AppError } from "@/errors/app-error";
import { ERROR_CODES, ROLES } from "@/constants";
import { findProjectById, findTask, findProjectManager } from "@/repositories";

export async function deleteTask(projectId: number, taskId: number) {
  const currentUser = await requireAuth();
  const project = await findProjectById(projectId, currentUser.companyId);
  if (!project) {
    throw new AppError("Project not found", 404, ERROR_CODES.NOT_FOUND);
  }
  const task = await findTask(projectId, taskId);
  if (!task) {
    throw new AppError("Task not found", 404, ERROR_CODES.NOT_FOUND);
  }
  if (currentUser.role !== ROLES.OWNER) {
    const isManager = await findProjectManager(currentUser.id, projectId);
    if (!isManager) {
      throw new AppError(
        "You can't delete this task",
        403,
        ERROR_CODES.FORBIDDEN,
      );
    }
  }
  await prisma.task.delete({
    where: {
      id: taskId,
    },
  });
  return "Task deleted successfully";
}
