import { findUserByEmail } from "@/repositories/user-repository";
import { LoginInput } from "@/validators";
import { AppError } from "@/errors/app-error";
import { ERROR_CODES } from "@/constants/error-codes";
import { verifyPassword, createSession, setSessionCookie } from "@/auth";

export async function login(input: LoginInput) {
  const user = await findUserByEmail(input.email);
  if (!user) {
    throw new AppError(
      "Invalid email or password",
      401,
      ERROR_CODES.UNAUTHORIZED,
    );
  }
  const isPasswordValid = await verifyPassword(
    input.password,
    user.passwordHash,
  );
  if (!isPasswordValid) {
    throw new AppError(
      "Invalid email or password",
      401,
      ERROR_CODES.UNAUTHORIZED,
    );
  }
  const session = await createSession(user.id);
  await setSessionCookie(session.id);
  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      companyId: user.companyId,
    },
  };
}
