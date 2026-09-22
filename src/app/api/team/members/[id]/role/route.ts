import { validate, changeMemberRoleSchema } from "@/validators";
import { changeMemberRole } from "@/services/team/change-member-role";
import { successResponse } from "@/lib/response";
import { handleError } from "@/errors/error-handler";

export async function PATCH(request: Request, { params } : { params: Promise<{ id: string }>}) {
    try{
        const { id } = await params;
        const { role } = await request.json();
        const result = validate(changeMemberRoleSchema, { memberId: id, role });
        const member = await changeMemberRole(result.memberId, result.role);
        return successResponse({ data: { member } });
    }catch(error){
        return handleError(error);
    }
}