import { prisma } from "@/lib/prisma";
import { getSession } from "@/auth/session";
import { getSessionCookie } from "@/auth/cookies";


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
