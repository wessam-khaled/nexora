import { listMembers } from "@/backend/services/team/list-members";
import { successResponse } from "@/backend/lib/response";
import { handleError } from "@/backend/errors/error-handler";

export async function GET() {
  try {
    const members = await listMembers();
    return successResponse({ data: { members } });
  } catch (error) {
    return handleError(error);
  }
}
