import type { ErrorCode } from "@/backend/constants/error-codes";

type SuccessResponse<T> = {
  data: T;
  statusCode?: number;
};

type ErrorResponse = {
  error: {
    code: ErrorCode;
    message: string;
    details?: Record<string, string>;
  };
  statusCode?: number;
};

export function successResponse<T>({
  data,
  statusCode = 200,
}: SuccessResponse<T>) {
  return Response.json(
    {
      data,
    },
    {
      status: statusCode,
    },
  );
}

export function errorResponse({ error, statusCode = 500 }: ErrorResponse) {
  return Response.json(
    {
      error,
    },
    {
      status: statusCode,
    },
  );
}
