import { ERROR_CODES } from "@/backend/constants/error-codes";
import { AppError } from "@/backend/errors/app-error";
import { errorResponse } from "@/backend/lib/response";

export function handleError(error: unknown) {
  if (error instanceof AppError) {
    return errorResponse({
      error: {
        code: error.code,
        message: error.message,
        details: error.details,
      },
      statusCode: error.statusCode,
    });
  }
  console.error(error);
  return errorResponse({
    error: {
      code: ERROR_CODES.INTERNAL_ERROR,
      message: "Something went wrong",
    },
    statusCode: 500,
  });
}
