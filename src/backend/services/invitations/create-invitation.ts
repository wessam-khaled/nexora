import { prisma } from "@/backend/lib/prisma";
import { requireRole } from "@/backend/auth";
import { CreateInvitationInput } from "@/backend/validators";
import { AppError } from "@/backend/errors/app-error";
import { ERROR_CODES, ROLES } from "@/backend/constants";
import { findUserByEmail } from "@/backend/repositories/user-repository";
import { randomBytes } from "crypto";
import { hash } from "argon2";

export async function createInvitation(input: CreateInvitationInput) {
  const currentUser = await requireRole([ROLES.OWNER, ROLES.ADMIN]);
  if (currentUser.role === ROLES.ADMIN && input.role === ROLES.ADMIN) {
    throw new AppError("Forbidden", 403, ERROR_CODES.FORBIDDEN);
  }
  const userExists = await findUserByEmail(input.email);

  if (userExists) {
    throw new AppError("Email already exists", 409, ERROR_CODES.CONFLICT);
  }
  const pendingInvitation = await prisma.invitation.findFirst({
    where: {
      email: input.email,
      companyId: currentUser.companyId,
      status: "PENDING",
    },
  });
  if (pendingInvitation) {
    throw new AppError(
      "A pending invitation already exists for this email",
      409,
      ERROR_CODES.CONFLICT,
    );
  }
  const token = randomBytes(32).toString("hex");
  const tokenHash = await hash(token);
  const invitation = await prisma.invitation.create({
    data: {
      email: input.email,
      role: input.role,
      companyId: currentUser.companyId,
      createdBy: currentUser.id,
      status: "PENDING",
      tokenHash,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
    },
  });
  return {
    invitation: {
      id: invitation.id,
      token,
    },
  };
}
