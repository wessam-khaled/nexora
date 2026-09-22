import { prisma } from "@/lib/prisma";
import { requireRole } from "@/auth";
import { ROLES } from "@/constants";

export async function listMembers() {
  const user = await requireRole([ROLES.ADMIN, ROLES.OWNER]);
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
