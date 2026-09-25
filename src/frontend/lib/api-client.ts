import { ApiError } from "./api-error";

type HttpMethod = "GET" | "POST" | "PATCH" | "DELETE";
type ApiResponse<T> = {
  data: T;
};

export async function request<T>(
  method: HttpMethod,
  url: string,
  body?: Record<string, unknown>,
): Promise<T> {
  const res = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
    credentials: "include",
  });
  if (!res.ok) {
    const data = await res.json();
    throw new ApiError(
      data.error.message,
      res.status,
      data.error.code,
      data.error.details,
    );
  }
  const data: ApiResponse<T> = await res.json();
  console.log("response", data);
  return data.data;
}

const apiClient = {
  get: <T>(url: string) => request<T>("GET", url),
  post: <T>(url: string, body?: Record<string, unknown>) =>
    request<T>("POST", url, body),
  patch: <T>(url: string, body: Record<string, unknown>) =>
    request<T>("PATCH", url, body),
  delete: <T>(url: string, body?: Record<string, unknown>) =>
    request<T>("DELETE", url, body),
};

export default apiClient;
