import { getDashboard } from "@/services/dashboard/get-dashboard";
import { successResponse } from "@/lib/response";
import { handleError } from "@/errors/error-handler";

export async function GET() {
  try {
    const dashboard = await getDashboard();
    return successResponse({ data: {dashboard} });
  } catch (error) {
    return handleError(error);
  }
}