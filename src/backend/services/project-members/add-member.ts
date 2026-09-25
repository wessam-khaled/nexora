import { prisma } from "@/backend/lib/prisma";
import { requireAuth } from "@/backend/auth";
import {
  ROLES,
  PROJECT_ROLES,
  ERROR_CODES,
  ProjectUsersRole,
} from "@/backend/constants";
import { AppError } from "@/backend/errors/app-error";
import {
  findProjectById,
  findProjectMember,
  findUserById,
  findProjectManager,
} from "@/backend/repositories";

export async function addMember(input: {
  projectId: number;
  userId: number;
  role?: ProjectUsersRole;
}) {
  const currentUser = await requireAuth();

  const member = await findUserById(input.userId, currentUser.companyId);

  if (!member || member.companyId !== currentUser.companyId) {
    throw new AppError("Member not found", 404, ERROR_CODES.NOT_FOUND);
  }
  const project = await findProjectById(input.projectId, currentUser.companyId);

  if (!project) {
    throw new AppError("Project not found", 404, ERROR_CODES.NOT_FOUND);
  }

  const memberExists = await findProjectMember(member.id, project.id);

  if (memberExists) {
    throw new AppError("Member already exists", 409, ERROR_CODES.CONFLICT);
  }

  if (currentUser.role === ROLES.OWNER) {
    return prisma.projectMember.create({
      data: {
        projectId: input.projectId,
        userId: input.userId,
        projectRole: input.role ?? PROJECT_ROLES.MEMBER,
      },
    });
  }
  const isProjectManager = await findProjectManager(
    currentUser.id,
    input.projectId,
  );
  if (isProjectManager) {
    if (input.role === PROJECT_ROLES.MANAGER) {
      throw new AppError(
        "You can't promote a member to manager",
        403,
        ERROR_CODES.FORBIDDEN,
      );
    }
    return prisma.projectMember.create({
      data: {
        projectId: input.projectId,
        userId: input.userId,
        projectRole: PROJECT_ROLES.MEMBER,
      },
    });
  }
  throw new AppError("Forbidden", 403, ERROR_CODES.FORBIDDEN);
}
