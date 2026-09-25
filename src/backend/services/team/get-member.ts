import { requireRole } from "@/backend/auth";
import { AppError } from "@/backend/errors/app-error";
import { ERROR_CODES, ROLES } from "@/backend/constants";
import { findUserById } from "@/backend/repositories";

export async function getMember(id: number) {
  const user = await requireRole([ROLES.ADMIN, ROLES.OWNER]);
  const member = await findUserById(id, user.companyId);
  if (!member) {
    throw new AppError("Member not found", 404, ERROR_CODES.NOT_FOUND);
  }
  return {
    id: member.id,
    name: member.name,
    email: member.email,
    role: member.role,
  };
}
