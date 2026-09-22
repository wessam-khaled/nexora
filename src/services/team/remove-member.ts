import { prisma } from "@/lib/prisma";
import { requireRole } from "@/auth";
import { ROLES, ERROR_CODES } from "@/constants";
import { AppError } from "@/errors/app-error";

export async function removeMember(memberId: number) {
  const currentUser = await requireRole([ROLES.OWNER, ROLES.ADMIN]);
  const member = await prisma.user.findUnique({
    where: {
      id: memberId,
    },
  });
  if (!member) {
    throw new AppError("Member not found", 404, ERROR_CODES.NOT_FOUND);
  }
  if (member.companyId !== currentUser.companyId) {
    throw new AppError("Member not found", 404, ERROR_CODES.NOT_FOUND);
  }
  if (member.role === ROLES.OWNER) {
    throw new AppError("Owner cannot be removed", 403, ERROR_CODES.FORBIDDEN);
  }
  if (member.role === ROLES.ADMIN && currentUser.role === ROLES.ADMIN) {
    throw new AppError("Admin cannot be removed", 403, ERROR_CODES.FORBIDDEN);
  }
  await prisma.user.delete({
    where: {
      id: memberId,
    },
  });
  return "Member removed successfully";
}
