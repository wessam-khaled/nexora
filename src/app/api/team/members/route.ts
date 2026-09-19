import { listMembers } from "@/services/team/list-members";
import { successResponse } from "@/lib/response";
import { handleError } from "@/errors/error-handler";

export async function GET() {
  try {
    const members = await listMembers();
    return successResponse({ data: { members } });
  } catch (error) {
    return handleError(error);
  }
}

