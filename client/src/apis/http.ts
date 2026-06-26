import { ApiError, type ApiErrorResponse } from "./error";

export async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorResponse: ApiErrorResponse = await response.json().catch(() => ({
      error: "UNKNOWN_ERROR",
      message: response.statusText,
    }));
    throw new ApiError(response.status, errorResponse.error, errorResponse.message);
  }
  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}
