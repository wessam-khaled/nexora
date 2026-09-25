import { prisma } from "@/backend/lib/prisma";
import { requireAuth } from "@/backend/auth/require-auth";
import { AppError } from "@/backend/errors/app-error";
import { ERROR_CODES, ROLES } from "@/backend/constants";
import { findProjectById, findProjectMember } from "@/backend/repositories";

export async function listTasks(projectId: number) {
  const currentUser = await requireAuth();
  const project = await findProjectById(projectId, currentUser.companyId);
  if (!project) {
    throw new AppError("Project not found", 404, ERROR_CODES.NOT_FOUND);
  }
  const isProjectMember = await findProjectMember(currentUser.id, projectId);
  if (currentUser.role !== ROLES.OWNER && !isProjectMember) {
    throw new AppError("Forbidden", 403, ERROR_CODES.FORBIDDEN);
  }
  return prisma.task.findMany({
    where: {
      projectId: projectId,
    },
    select: {
      id: true,
      title: true,
      description: true,
      priority: true,
      assignedTo: true,
      dueDate: true,
      status: true,
    },
  });
}
