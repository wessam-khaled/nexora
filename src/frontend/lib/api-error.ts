import type { ErrorCode } from "../types/error";

export class ApiError extends Error {
  status: number;
  code: ErrorCode;
  details?: Record<string, string>;
  constructor(
    message: string,
    status: number,
    code: ErrorCode,
    details?: Record<string, string>,
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.details = details;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
