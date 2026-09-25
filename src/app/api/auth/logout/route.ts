import { clearSessionCookie, getSessionCookie } from "@/backend/auth/cookies";
import { deleteSession } from "@/backend/auth/session";
import { successResponse } from "@/backend/lib/response";
import { handleError } from "@/backend/errors/error-handler";

export async function POST() {
  try {
    const sessionId = await getSessionCookie();
    if (sessionId) {
      await deleteSession(sessionId);
    }
    await clearSessionCookie();
    return successResponse({ data: "Logged out successfully" });
  } catch (error) {
    return handleError(error);
  }
}
