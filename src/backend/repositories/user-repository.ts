import { prisma } from "@/backend/lib/prisma";

export async function findUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: {
      email,
    },
  });
}

export async function findUserById(id: number, companyId: number) {
  return prisma.user.findUnique({
    where: {
      id,
      companyId,
    },
  });
}
