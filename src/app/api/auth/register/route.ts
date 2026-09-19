import { validate, registerSchema } from "@/validators";
import { register } from "@/services/auth/register";
import { successResponse } from "@/lib/response";
import { handleError } from "@/errors/error-handler";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = validate(registerSchema, body);
    const { newUser, newCompany } = await register(result);
    return successResponse({ data: { newUser, newCompany }, statusCode: 201 });
  } catch (error) {
    return handleError(error);
  }
}
