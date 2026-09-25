import { prisma } from "@/backend/lib/prisma";
import { getSession } from "@/backend/auth/session";
import { getSessionCookie } from "@/backend/auth/cookies";

export async function getCurrentUser() {
  const cookieSessionId = await getSessionCookie();
  if (!cookieSessionId) {
    return null;
  }
  const session = await getSession(cookieSessionId);
  if (!session) {
    return null;
  }
  return prisma.user.findUnique({
    where: {
      id: session.userId,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      companyId: true,
      createdBy: true,
    },
  });
}
