import { validate, loginSchema } from "@/backend/validators";
import { login } from "@/backend/services/auth/login";
import { successResponse } from "@/backend/lib/response";
import { handleError } from "@/backend/errors/error-handler";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = validate(loginSchema, body);
    await login(result);
    return successResponse({ data: "Login successful"});
  } catch (error) {
    return handleError(error);
  }
}
