import { prisma } from "@/backend/lib/prisma";

export function findProjectById(id: number, companyId: number) {
  return prisma.project.findUnique({
    where: {
      id: id,
      companyId,
    },
  });
}

export function countProjectMembers(projectId: number) {
  return prisma.projectMember.count({
    where: {
      projectId,
    },
  });
}

export function countProjectTasks(projectId: number) {
  return prisma.task.count({
    where: {
      projectId,
    },
  });
}
