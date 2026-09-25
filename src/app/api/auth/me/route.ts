import { requireAuth } from "@/backend/auth/require-auth";
import { successResponse } from "@/backend/lib/response";
import { handleError } from "@/backend/errors/error-handler";

export async function GET() {
  try {
    const user = await requireAuth();
    return successResponse({
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        companyId: user.companyId,
      },
    });
  } catch (error) {
    return handleError(error);
  }
}
