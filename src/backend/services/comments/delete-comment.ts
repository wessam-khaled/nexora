import { prisma } from "@/backend/lib/prisma";
import { requireAuth } from "@/backend/auth";
import { AppError } from "@/backend/errors/app-error";
import { ERROR_CODES, ROLES } from "@/backend/constants";
import {
  findTask,
  findProjectById,
  findProjectManager,
  findComment,
} from "@/backend/repositories";

export async function deleteComment(
  projectId: number,
  taskId: number,
  commentId: number,
) {
  const currentUser = await requireAuth();
  const project = await findProjectById(projectId, currentUser.companyId);
  if (!project) {
    throw new AppError("Project not found", 404, ERROR_CODES.NOT_FOUND);
  }
  const task = await findTask(projectId, taskId);
  if (!task) {
    throw new AppError("Task not found", 404, ERROR_CODES.NOT_FOUND);
  }
  const comment = await findComment(taskId, commentId);
  if (!comment) {
    throw new AppError("Comment not found", 404, ERROR_CODES.NOT_FOUND);
  }
  const isProjectManager = await findProjectManager(currentUser.id, project.id);
  if (
    !isProjectManager &&
    currentUser.role !== ROLES.OWNER &&
    currentUser.id !== comment.userId
  ) {
    throw new AppError(
      "You can't delete this comment",
      403,
      ERROR_CODES.FORBIDDEN,
    );
  }
  await prisma.comment.delete({
    where: {
      id: commentId,
    },
  });
  return "Comment deleted";
}
