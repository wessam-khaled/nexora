import { validate, acceptInvitationSchema } from "@/validators";
import { acceptInvitation } from "@/services/invitations/accept-invitation";
import { successResponse } from "@/lib/response";
import { handleError } from "@/errors/error-handler";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = validate(acceptInvitationSchema, body);
    const { user } = await acceptInvitation(result);
    return successResponse({ data: { user }, statusCode: 201 });
  } catch (error) {
    return handleError(error);
  }
}