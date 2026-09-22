import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/auth";
import { ROLES, ERROR_CODES, PROJECT_ROLES } from "@/constants";
import { AppError } from "@/errors/app-error";
import {
  findProjectById,
  findProjectMember,
  managersCount,
  findProjectManager,
} from "@/repositories";

export async function removeProjectMember(userId: number, projectId: number) {
  const currentUser = await requireAuth();
  const project = await findProjectById(projectId, currentUser.companyId);
  if (!project) {
    throw new AppError("Project not found", 404, ERROR_CODES.NOT_FOUND);
  }
  const member = await findProjectMember(userId, projectId);
  if (!member) {
    throw new AppError("Member not found", 404, ERROR_CODES.NOT_FOUND);
  }
  if (currentUser.role === ROLES.OWNER) {
    if (member.projectRole === PROJECT_ROLES.MANAGER) {
      const managers = await managersCount(projectId);
      if (managers <= 1) {
        throw new AppError(
          "Cannot remove last manager",
          409,
          ERROR_CODES.CONFLICT,
        );
      }
    }
    return prisma.projectMember.delete({
      where: {
        userId_projectId: {
          userId: userId,
          projectId: projectId,
        },
      },
    });
  }
  const isProjectManager = await findProjectManager(currentUser.id, projectId);
  if (isProjectManager) {
    if (member.projectRole === PROJECT_ROLES.MANAGER) {
      throw new AppError("Forbidden", 403, ERROR_CODES.FORBIDDEN);
    }
    await prisma.projectMember.delete({
      where: {
        userId_projectId: {
          userId: userId,
          projectId: projectId,
        },
      },
    });
    return "Member removed successfully";
  }
  throw new AppError("Forbidden", 403, ERROR_CODES.FORBIDDEN);
}
