import { getDashboard } from "@/backend/services/dashboard/get-dashboard";
import { successResponse } from "@/backend/lib/response";
import { handleError } from "@/backend/errors/error-handler";

export async function GET() {
  try {
    const dashboard = await getDashboard();
    return successResponse({ data: { dashboard } });
  } catch (error) {
    return handleError(error);
  }
}
