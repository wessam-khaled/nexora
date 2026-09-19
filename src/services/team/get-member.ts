import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/auth/require-auth";
import { AppError } from "@/errors/app-error";
import { ERROR_CODES } from "@/constants/error-codes";

export async function getMember(id: number) {
  const user = await requireAuth();
  const member = await prisma.user.findUnique({
    where: {
      id: id,
      companyId: user.companyId,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
  });
  if (!member) {
    throw new AppError("Member not found", 404, ERROR_CODES.NOT_FOUND);
  }
  return member;
}