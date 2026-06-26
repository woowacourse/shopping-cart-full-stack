import ApiError from "../error/ApiError";

export type ApiResponse<T> = {
  code: string;
  message: string;
  result: T;
};

export type ApiErrorResponse = {
  code: string;
  message: string;
};

export const BASE_URL =
  "https://shopping-cart-full-stack-production-0cf6.up.railway.app";

export const throwApiError = async (response: Response) => {
  const errorData: ApiErrorResponse = await response.json();
  throw new ApiError(errorData.code, errorData.message);
};
