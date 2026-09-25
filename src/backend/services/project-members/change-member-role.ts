import { prisma } from "@/backend/lib/prisma";
import { requireRole } from "@/backend/auth";
import {
  ROLES,
  ERROR_CODES,
  ProjectUsersRole,
  PROJECT_ROLES,
} from "@/backend/constants";
import { AppError } from "@/backend/errors/app-error";
import {
  findProjectById,
  findProjectMember,
  managersCount,
} from "@/backend/repositories";

export async function changeProjectMemberRole(
  projectId: number,
  userId: number,
  role: ProjectUsersRole,
) {
  const currentUser = await requireRole([ROLES.OWNER]);
  const project = await findProjectById(projectId, currentUser.companyId);
  if (!project) {
    throw new AppError("Project not found", 404, ERROR_CODES.NOT_FOUND);
  }
  const member = await findProjectMember(userId, projectId);
  if (!member) {
    throw new AppError("Member not found", 404, ERROR_CODES.NOT_FOUND);
  }
  if (member.projectRole === PROJECT_ROLES.MANAGER) {
    const managers = await managersCount(projectId);
    if (managers <= 1 && role === PROJECT_ROLES.MEMBER) {
      throw new AppError(
        "Cannot remove last manager",
        409,
        ERROR_CODES.CONFLICT,
      );
    }
  }
  const changeProjectMemberRole = await prisma.projectMember.update({
    where: {
      userId_projectId: {
        userId: userId,
        projectId: projectId,
      },
    },
    data: {
      projectRole: role,
    },
  });
  return {
    userId: changeProjectMemberRole.userId,
    projectId: changeProjectMemberRole.projectId,
    projectRole: changeProjectMemberRole.projectRole,
  };
}
