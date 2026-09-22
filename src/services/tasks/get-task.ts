import { requireAuth } from "@/auth";
import { AppError } from "@/errors/app-error";
import { ERROR_CODES, ROLES } from "@/constants";
import { findProjectById, findProjectMember, findTask } from "@/repositories";

export async function getTask(projectId: number, taskId: number) {
  const currentUser = await requireAuth();
  const project = await findProjectById(projectId, currentUser.companyId);
  if (!project) {
    throw new AppError("Project not found", 404, ERROR_CODES.NOT_FOUND);
  }
  const isMember = await findProjectMember(currentUser.id, projectId);
  if (!isMember && currentUser.role !== ROLES.OWNER) {
    throw new AppError(
      "You are not a member of this project",
      403,
      ERROR_CODES.FORBIDDEN,
    );
  }
  const task = await findTask(projectId, taskId);
  if (!task) {
    throw new AppError("Task not found", 404, ERROR_CODES.NOT_FOUND);
  }
  return {
    id: task.id,
    title: task.title,
    description: task.description,
    priority: task.priority,
    assignedTo: task.assignedTo,
    dueDate: task.dueDate,
    status: task.status,
  };
}
