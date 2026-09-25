import { prisma } from "@/backend/lib/prisma";
import { requireAuth } from "@/backend/auth/require-auth";
import { AppError } from "@/backend/errors/app-error";
import { ERROR_CODES, ROLES, ProjectStatus } from "@/backend/constants";
import { findProjectById, findProjectManager } from "@/backend/repositories";

export async function updateProject(
  id: number,
  data: {
    name?: string;
    description?: string;
    status?: ProjectStatus;
  },
) {
  if (Object.keys(data).length === 0) {
    throw new AppError("No data provided", 400, ERROR_CODES.BAD_REQUEST);
  }
  const currentUser = await requireAuth();
  const findProject = await findProjectById(id, currentUser.companyId);
  if (!findProject) {
    throw new AppError("Project not found", 404, ERROR_CODES.NOT_FOUND);
  }
  const isManager = await findProjectManager(currentUser.id, id);
  if (currentUser.role !== ROLES.OWNER && !isManager) {
    throw new AppError("Forbidden", 403, ERROR_CODES.FORBIDDEN);
  }
  const updatedProject = await prisma.project.update({
    where: {
      id: id,
    },
    data,
  });
  return {
    id: updatedProject.id,
    name: updatedProject.name,
    description: updatedProject.description,
    status: updatedProject.status,
  };
}
