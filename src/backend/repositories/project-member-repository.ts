import { prisma } from "@/backend/lib/prisma";
import { PROJECT_ROLES } from "@/backend/constants";

export function findProjectMember(userId: number, projectId: number) {
  return prisma.projectMember.findUnique({
    where: {
      userId_projectId: {
        userId: userId,
        projectId: projectId,
      },
    },
  });
}

export function findProjectManager(userId: number, projectId: number) {
  return prisma.projectMember.findFirst({
    where: {
      projectId: projectId,
      userId: userId,
      projectRole: PROJECT_ROLES.MANAGER,
    },
  });
}

export function managersCount(projectId: number) {
  return prisma.projectMember.count({
    where: {
      projectId: projectId,
      projectRole: PROJECT_ROLES.MANAGER,
    },
  });
}
