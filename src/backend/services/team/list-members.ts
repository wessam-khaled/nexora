import { prisma } from "@/backend/lib/prisma";
import { requireRole } from "@/backend/auth";
import { ROLES } from "@/backend/constants";

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
