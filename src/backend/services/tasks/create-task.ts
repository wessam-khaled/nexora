import { prisma } from "@/backend/lib/prisma";
import { requireAuth } from "@/backend/auth/require-auth";
import { AppError } from "@/backend/errors/app-error";
import {
  ERROR_CODES,
  ROLES,
  TaskPriority,
  TASK_STATUS,
} from "@/backend/constants";
import {
  findProjectById,
  findProjectManager,
  findUserById,
  findProjectMember,
} from "@/backend/repositories";

export async function createTask(input: {
  projectId: number;
  title: string;
  description?: string;
  priority: TaskPriority;
  assignedTo?: number;
  dueDate?: Date;
}) {
  const currentUser = await requireAuth();
  const project = await findProjectById(input.projectId, currentUser.companyId);
  if (!project) {
    throw new AppError("Project not found", 404, ERROR_CODES.NOT_FOUND);
  }
  const isProjectManager = await findProjectManager(
    currentUser.id,
    input.projectId,
  );
  if (currentUser.role !== ROLES.OWNER && !isProjectManager) {
    throw new AppError("Forbidden", 403, ERROR_CODES.FORBIDDEN);
  }
  if (input.assignedTo) {
    const assignedTo = await findUserById(
      input.assignedTo,
      currentUser.companyId,
    );
    if (!assignedTo || assignedTo.companyId !== currentUser.companyId) {
      throw new AppError(
        "Assigned to user not found",
        404,
        ERROR_CODES.NOT_FOUND,
      );
    }
    const isProjectMember = await findProjectMember(
      input.assignedTo,
      project.id,
    );
    if (!isProjectMember) {
      throw new AppError(
        "User is not a member of the project",
        403,
        ERROR_CODES.FORBIDDEN,
      );
    }
  }
  if (input.dueDate) {
    if (input.dueDate < new Date()) {
      throw new AppError(
        "Due date cannot be in the past",
        400,
        ERROR_CODES.BAD_REQUEST,
      );
    }
  }
  const task = await prisma.task.create({
    data: {
      title: input.title,
      description: input.description,
      priority: input.priority,
      assignedTo: input.assignedTo,
      dueDate: input.dueDate,
      status: TASK_STATUS.TODO,
      projectId: input.projectId,
      createdBy: currentUser.id,
    },
  });
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
