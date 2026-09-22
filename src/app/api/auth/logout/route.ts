import { clearSessionCookie, getSessionCookie } from "@/auth/cookies";
import { deleteSession } from "@/auth/session";
import { successResponse } from "@/lib/response";
import { handleError } from "@/errors/error-handler";

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
