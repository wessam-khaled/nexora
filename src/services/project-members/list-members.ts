import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/auth/require-auth";
import { ROLES, ERROR_CODES } from "@/constants";
import { AppError } from "@/errors/app-error";
import { findProjectById, findProjectMember } from "@/repositories";

export async function listMembers(projectId: number) {
  const user = await requireAuth();
  const project = await findProjectById(projectId, user.companyId);
  if (!project) {
    throw new AppError("Project not found", 404, ERROR_CODES.NOT_FOUND);
  }
  const member = await findProjectMember(user.id, project.id);
  if (!member && user.role !== ROLES.OWNER) {
    throw new AppError("Forbidden", 403, ERROR_CODES.FORBIDDEN);
  }
  const members = await prisma.user.findMany({
    where: {
      projectMembers: {
        some: {
          projectId: project.id,
        },
      },
    },
    select: {
      id: true,
      name: true,
      email: true,
      projectMembers: {
        where: {
          projectId: project.id,
        },
        select: {
          projectRole: true,
        },
      },
    },
  });
  return {
    members: members.map((member) => {
      return {
        id: member.id,
        name: member.name,
        email: member.email,
        projectRole: member.projectMembers[0].projectRole,
      };
    }),
  };
}
