import { memberIdSchema, validate } from "@/validators";
import { removeMember } from "@/services/team/remove-member";
import { getMember } from "@/services/team/get-member";
import { successResponse } from "@/lib/response";
import { handleError } from "@/errors/error-handler";

export async function GET(request: Request, { params } : { params: Promise<{ id: string }>}) {
  try {
    const { id } = await params;
    const result = validate(memberIdSchema, { id });
    const member = await getMember(result.id);
    return successResponse({ data: { member } });
  } catch (error) {
    return handleError(error);
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const result = validate(memberIdSchema, { id });
    await removeMember(result.id);
    return successResponse({ data: { id: result.id } });
  } catch (error) {
    return handleError(error);
  }
}
