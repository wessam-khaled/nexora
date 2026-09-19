import { prisma } from "@/lib/prisma";
import { requireRole } from "@/auth";
import { ROLES, ChangeableRole, ERROR_CODES } from "@/constants";
import { AppError } from "@/errors/app-error";
import { findUserById } from "@/repositories/user-repository";

export async function changeMemberRole(memberId: number, role: ChangeableRole) {
  const owner = await requireRole([ROLES.OWNER]);
  const member = await findUserById(memberId);
  if (!member) {
    throw new AppError("Member not found", 404, ERROR_CODES.NOT_FOUND);
  }
  if (member.companyId !== owner.companyId) {
    throw new AppError("Member not found", 404, ERROR_CODES.NOT_FOUND);
  }
  if (member.role === ROLES.OWNER) {
    throw new AppError("Owner cannot be changed", 403, ERROR_CODES.FORBIDDEN);
  }
  await prisma.user.update({
    where: {
      id: memberId,
    },
    data: {
      role: role,
    },
  });
}
