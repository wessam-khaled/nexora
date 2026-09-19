import { prisma } from "@/lib/prisma";

export function findComment(taskId: number, commentId: number) {
  return prisma.comment.findUnique({
    where: {
      id: commentId,
      taskId: taskId,
    },
  });
}