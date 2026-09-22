import { prisma } from "@/lib/prisma";
import { hashPassword, createSession, setSessionCookie } from "@/auth";
import { RegisterInput } from "@/validators";
import { findUserByEmail } from "@/repositories/user-repository";
import { AppError } from "@/errors/app-error";
import { ERROR_CODES, ROLES } from "@/constants";

export async function register(input: RegisterInput) {
  const user = await findUserByEmail(input.email);
  if (user) {
    throw new AppError("Email already exists", 409, ERROR_CODES.CONFLICT);
  }
  const passwordHash = await hashPassword(input.password);

  const result = await prisma.$transaction(async (tx) => {
    const newCompany = await tx.company.create({
      data: {
        name: input.companyName,
      },
    });
    const newUser = await tx.user.create({
      data: {
        name: input.name,
        email: input.email,
        passwordHash,
        role: ROLES.OWNER,
        companyId: newCompany.id,
        createdBy: null,
      },
    });
    const newSession = await createSession(newUser.id, tx);
    return {
      newUser,
      newSession,
      newCompany,
    };
  });
  await setSessionCookie(result.newSession.id);
  return { 
    user: {
      id: result.newUser.id,
      name: result.newUser.name,
      email: result.newUser.email,
      role: result.newUser.role,
    },
    company: {
      id: result.newCompany.id,
      name: result.newCompany.name,
    }
  }
}
