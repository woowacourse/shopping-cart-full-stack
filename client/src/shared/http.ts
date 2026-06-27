import ApiError from "./apiError";

const BASE_URL = import.meta.env?.VITE_API_URL ?? "";

const DEFAULT_ERROR_MESSAGE = "알 수 없는 오류가 발생했습니다.";

interface ApiErrorBody {
  code?: string;
  message?: string;
}

async function parseErrorBody(response: Response): Promise<ApiErrorBody> {
  try {
    return (await response.json()) as ApiErrorBody;
  } catch {
    return {};
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const { code, message } = await parseErrorBody(response);

    throw new ApiError({
      status: response.status,
      code,
      message: message ?? DEFAULT_ERROR_MESSAGE,
    });
  }

  if (response.status === 204) {
    return null as T;
  }

  return response.json() as Promise<T>;
}

export const http = async <T>(path: string, init?: RequestInit): Promise<T> => {
  const response = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json", ...init?.headers },
    ...init,
  });
  return handleResponse<T>(response);
};
