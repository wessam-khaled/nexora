import { prisma } from "@/backend/lib/prisma";
import { requireRole } from "@/backend/auth";
import { ROLES, ChangeableRole, ERROR_CODES } from "@/backend/constants";
import { AppError } from "@/backend/errors/app-error";
import { findUserById } from "@/backend/repositories/user-repository";

export async function changeMemberRole(memberId: number, role: ChangeableRole) {
  const owner = await requireRole([ROLES.OWNER]);
  const member = await findUserById(memberId, owner.companyId);
  if (!member) {
    throw new AppError("Member not found", 404, ERROR_CODES.NOT_FOUND);
  }
  if (member.companyId !== owner.companyId) {
    throw new AppError("Member not found", 404, ERROR_CODES.NOT_FOUND);
  }
  if (member.role === ROLES.OWNER) {
    throw new AppError("Owner cannot be changed", 403, ERROR_CODES.FORBIDDEN);
  }
  const changeMemberRole = await prisma.user.update({
    where: {
      id: memberId,
    },
    data: {
      role: role,
    },
  });
  return {
    id: changeMemberRole.id,
    name: changeMemberRole.name,
    email: changeMemberRole.email,
    role: changeMemberRole.role,
  };
}
