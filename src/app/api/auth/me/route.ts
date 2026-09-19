import { requireAuth } from "@/auth/require-auth";
import { successResponse } from "@/lib/response";
import { handleError } from "@/errors/error-handler";

export async function GET() {
  try {
    const user = await requireAuth();
    return successResponse({ data: { user } });
  } catch (error) {
    return handleError(error);
  }
}