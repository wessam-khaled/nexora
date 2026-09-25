import { prisma } from "@/backend/lib/prisma";

export function findTask(projectId: number, taskId: number) {
  return prisma.task.findUnique({
    where: {
      id: taskId,
      projectId: projectId,
    },
  });
}
export function findProjectTasks(projectId: number) {
  return prisma.task.findMany({
    where: {
      projectId: projectId,
    },
  });
}
