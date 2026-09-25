import { validate, registerSchema } from "@/backend/validators";
import { register } from "@/backend/services/auth/register";
import { successResponse } from "@/backend/lib/response";
import { handleError } from "@/backend/errors/error-handler";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = validate(registerSchema, body);
    await register(result);
    return successResponse({ data: "Registation successful", statusCode: 201 });
  } catch (error) {
    return handleError(error);
  }
}
