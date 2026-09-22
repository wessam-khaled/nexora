import { prisma } from "@/lib/prisma";
import { AcceptInvitationInput } from "@/validators";
import { AppError } from "@/errors/app-error";
import { ERROR_CODES } from "@/constants/error-codes";
import { verify } from "argon2";
import { findUserByEmail } from "@/repositories/user-repository";
import { hashPassword, createSession, setSessionCookie } from "@/auth";

export async function acceptInvitation(input: AcceptInvitationInput) {
  const invitation = await prisma.invitation.findUnique({
    where: {
      id: input.id,
    },
  });
  if (!invitation) {
    throw new AppError("Invitation not found", 404, ERROR_CODES.NOT_FOUND);
  }
  const isTokenValid = await verify(invitation.tokenHash, input.token);
  if (!isTokenValid) {
    throw new AppError("Invalid invitation token", 403, ERROR_CODES.FORBIDDEN);
  }
  if (invitation.expiresAt < new Date()) {
    throw new AppError("Invitation has expired", 409, ERROR_CODES.CONFLICT);
  }
  if (invitation.status !== "PENDING") {
    throw new AppError(
      "Invitation is no longer valid",
      409,
      ERROR_CODES.CONFLICT,
    );
  }
  const emailExists = await findUserByEmail(invitation.email);
  if (emailExists) {
    throw new AppError("Email already exists", 409, ERROR_CODES.CONFLICT);
  }
  const passwordHash = await hashPassword(input.password);
  const result = await prisma.$transaction(async (tx) => {
    const newUser = await tx.user.create({
      data: {
        name: input.name,
        email: invitation.email,
        passwordHash,
        role: invitation.role,
        companyId: invitation.companyId,
        createdBy: invitation.createdBy,
      },
    });
    const newSession = await createSession(newUser.id, tx);
    await tx.invitation.update({
      where: {
        id: invitation.id,
      },
      data: {
        status: "ACCEPTED",
      },
    });
    return {
      newUser,
      newSession,
    };
  });
  await setSessionCookie(result.newSession.id);
  return {
    user: {
      id: result.newUser.id,
      name: result.newUser.name,
      email: result.newUser.email,
      role: result.newUser.role,
      companyId: result.newUser.companyId,
    },
  };
}
