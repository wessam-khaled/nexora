import { validate, changeMemberRoleSchema } from "@/backend/validators";
import { changeMemberRole } from "@/backend/services/team/change-member-role";
import { successResponse } from "@/backend/lib/response";
import { handleError } from "@/backend/errors/error-handler";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const { role } = await request.json();
    const result = validate(changeMemberRoleSchema, { memberId: id, role });
    const member = await changeMemberRole(result.memberId, result.role);
    return successResponse({ data: { member } });
  } catch (error) {
    return handleError(error);
  }
}
