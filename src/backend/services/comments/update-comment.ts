import { prisma } from "@/backend/lib/prisma";
import { requireAuth } from "@/backend/auth";
import { AppError } from "@/backend/errors/app-error";
import { ERROR_CODES, ROLES } from "@/backend/constants";
import {
  findTask,
  findProjectById,
  findProjectMember,
  findComment,
} from "@/backend/repositories";

export async function updateComment(
  projectId: number,
  taskId: number,
  commentId: number,
  data: {
    content: string;
  },
) {
  if (Object.keys(data).length === 0) {
    throw new AppError("No data provided", 400, ERROR_CODES.BAD_REQUEST);
  }
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
  const comment = await findComment(taskId, commentId);
  if (!comment) {
    throw new AppError("Comment not found", 404, ERROR_CODES.NOT_FOUND);
  }
  if (currentUser.id !== comment.userId) {
    throw new AppError(
      "You can't update this comment",
      403,
      ERROR_CODES.FORBIDDEN,
    );
  }
  const updatedComment = await prisma.comment.update({
    where: {
      id: commentId,
      userId: currentUser.id,
    },
    data: {
      content: data.content,
    },
  });
  return {
    id: updatedComment.id,
    content: updatedComment.content,
  };
}
