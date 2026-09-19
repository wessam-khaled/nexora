import { prisma } from "@/lib/prisma";
import { Prisma } from "@/generated/prisma/client";
import { randomBytes } from "crypto";

export async function createSession(
  userId: number,
  tx?: Prisma.TransactionClient,
) {
  const db = tx ?? prisma;
  return db.session.create({
    data: {
      id: randomBytes(32).toString("hex"),
      userId: userId,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
    },
  });
}

export async function getSession(sessionId: string) {
  const session = await prisma.session.findUnique({
    where: {
      id: sessionId,
    },
  });
  if (!session || session.expiresAt < new Date()) {
    return null;
  }
  return session;
}

export async function deleteSession(sessionId: string) {
  return prisma.session.deleteMany({
    where: {
      id: sessionId,
    },
  });
}
