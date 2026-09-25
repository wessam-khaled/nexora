import { prisma } from "@/backend/lib/prisma";
import { requireAuth } from "@/backend/auth/require-auth";
import { ROLES, ERROR_CODES } from "@/backend/constants";
import { AppError } from "@/backend/errors/app-error";

export async function listProjects() {
  const user = await requireAuth();
  if (user.role === ROLES.ADMIN || user.role === ROLES.OWNER) {
    return prisma.project.findMany({
      where: {
        companyId: user.companyId,
      },
      select: {
        id: true,
        name: true,
        status: true,
      },
    });
  }
  if (user.role === ROLES.MEMBER) {
    return prisma.project.findMany({
      where: {
        projectMembers: {
          some: {
            userId: user.id,
          },
        },
      },
      select: {
        id: true,
        name: true,
        status: true,
      },
    });
  }
  throw new AppError("Forbidden", 403, ERROR_CODES.FORBIDDEN);
}
