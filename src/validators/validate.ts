import { ZodError, type ZodType } from "zod";
import { AppError } from "@/errors/app-error";
import { ERROR_CODES } from "@/constants/error-codes";

export function validate<T>(schema: ZodType<T>, data: unknown): T {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof ZodError) {
      const details: Record<string, string> = {};

      for (const issue of error.issues) {
        const field = issue.path[0];

        if (typeof field === "string") {
          details[field] = issue.message;
        }
      }

      throw new AppError(
        "Invalid data",
        400,
        ERROR_CODES.VALIDATION_ERROR,
        details,
      );
    }
    throw error;
  }
}
