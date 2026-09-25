import { ERROR_CODES, type ErrorCode } from "@/backend/constants/error-codes";

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: ErrorCode;
  public readonly details?: Record<string, string>;

  constructor(
    message: string,
    statusCode: number,
    code: ErrorCode = ERROR_CODES.INTERNAL_ERROR,
    details?: Record<string, string>,
  ) {
    super(message);

    this.name = "AppError";
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;

    Object.setPrototypeOf(this, new.target.prototype);
  }
}
