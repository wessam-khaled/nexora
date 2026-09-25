import { validate, createInvitationSchema } from "@/backend/validators";
import { createInvitation } from "@/backend/services/invitations/create-invitation";
import { successResponse } from "@/backend/lib/response";
import { handleError } from "@/backend/errors/error-handler";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = validate(createInvitationSchema, body);
    const { invitation } = await createInvitation(result);
    return successResponse({ data: { invitation }, statusCode: 201 });
  } catch (error) {
    return handleError(error);
  }
}
