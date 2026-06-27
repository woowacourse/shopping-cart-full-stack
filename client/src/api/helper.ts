import { ApiError, NetworkError } from './errors/ApiError';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

type ErrorResponseBody = {
  code?: string;
  message?: string;
};

const createApiError = async (response: Response) => {
  const fallbackMessage = '요청 처리 중 오류가 발생했습니다.';

  try {
    const errorBody = (await response.json()) as ErrorResponseBody;

    return new ApiError({
      status: response.status,
      code: errorBody.code,
      message: errorBody.message ?? fallbackMessage,
    });
  } catch {
    return new ApiError({
      status: response.status,
      message: fallbackMessage,
    });
  }
};

export const createApiUrl = (path: string) => {
  if (!API_BASE_URL) {
    throw new NetworkError();
  }

  return `${API_BASE_URL}${path}`;
};

// 요청 헬퍼
export const request = async (url: string, options?: RequestInit) => {
  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      throw await createApiError(response);
    }

    return response;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    throw new NetworkError();
  }
};
