import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/auth/require-auth";

export async function listMembers() {
  const user = await requireAuth();
  return prisma.user.findMany({
    where: {
      companyId: user.companyId,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
  });
}
