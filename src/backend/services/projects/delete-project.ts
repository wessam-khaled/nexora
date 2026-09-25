import { prisma } from "@/backend/lib/prisma";
import { requireAuth } from "@/backend/auth/require-auth";
import { AppError } from "@/backend/errors/app-error";
import { ERROR_CODES, ROLES } from "@/backend/constants";
import { findProjectById, findProjectManager } from "@/backend/repositories";

export async function deleteProject(id: number) {
  const currentUser = await requireAuth();
  const project = await findProjectById(id, currentUser.companyId);
  if (!project) {
    throw new AppError("Project not found", 404, ERROR_CODES.NOT_FOUND);
  }
  const isManager = await findProjectManager(currentUser.id, id);
  if (currentUser.role !== ROLES.OWNER && !isManager) {
    throw new AppError("Forbidden", 403, ERROR_CODES.FORBIDDEN);
  }
  await prisma.project.delete({
    where: {
      id: id,
    },
  });
  return "Project deleted successfully";
}
