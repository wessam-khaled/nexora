import { findUserByEmail } from "@/backend/repositories/user-repository";
import { LoginInput } from "@/backend/validators";
import { AppError } from "@/backend/errors/app-error";
import { ERROR_CODES } from "@/backend/constants/error-codes";
import {
  verifyPassword,
  createSession,
  setSessionCookie,
} from "@/backend/auth";

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
}
