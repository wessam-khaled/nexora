import { validate, loginSchema } from "@/validators";
import { login } from "@/services/auth/login";
import { successResponse } from "@/lib/response";
import { handleError } from "@/errors/error-handler";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = validate(loginSchema, body);
    const { user } = await login(result);
    return successResponse({ data: { user } });
  } catch (error) {
    return handleError(error);
  }
}