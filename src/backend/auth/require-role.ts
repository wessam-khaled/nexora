import { requireAuth } from "@/backend/auth/require-auth";
import { AppError } from "@/backend/errors/app-error";
import { Role, isRole, ERROR_CODES } from "@/backend/constants";

export async function requireRole(role: Array<Role>) {
  const user = await requireAuth();
  if (!isRole(user.role) || !role.includes(user.role)) {
    throw new AppError("Forbidden", 403, ERROR_CODES.FORBIDDEN);
  }
  return user;
}
