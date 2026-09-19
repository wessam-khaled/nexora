import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/auth";
import { AppError } from "@/errors/app-error";
import { ERROR_CODES, ROLES, TaskStatus, TaskPriority } from "@/constants";
import {
  findProjectById,
  findTask,
  findProjectManager,
  findProjectMember,
} from "@/repositories";

export async function updateTask(
  projectId: number,
  taskId: number,
  data: {
    title?: string;
    description?: string;
    priority?: TaskPriority;
    assignedTo?: number;
    dueDate?: Date;
    status?: TaskStatus;
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

  const isManager = await findProjectManager(currentUser.id, projectId);
  if (
    currentUser.role !== ROLES.OWNER &&
    !isManager &&
    task.assignedTo !== currentUser.id
  ) {
    throw new AppError(
      "You can't update this task",
      403,
      ERROR_CODES.FORBIDDEN,
    );
  }
  if (currentUser.role === ROLES.OWNER || isManager) {
    if (data.assignedTo !== undefined) {
      const projectMember = await findProjectMember(data.assignedTo, projectId);

      if (!projectMember) {
        throw new AppError("User not found", 404, ERROR_CODES.NOT_FOUND);
      }
    }
    if (data.dueDate !== undefined) {
      if (data.dueDate < new Date()) {
        throw new AppError(
          "Due date should be greater than today",
          400,
          ERROR_CODES.BAD_REQUEST,
        );
      }
    }
    const updatedTask = await prisma.task.update({
      where: {
        id: taskId,
      },
      data,
    });
    return updatedTask;
  }
  if (task.assignedTo === currentUser.id) {
    const fields = Object.keys(data);
    if (fields.some((field) => field !== "status")) {
      throw new AppError(
        "You can't update this task",
        403,
        ERROR_CODES.FORBIDDEN,
      );
    }
    const updatedTask = await prisma.task.update({
      where: {
        id: taskId,
      },
      data,
    });
    return updatedTask;
  }
}
