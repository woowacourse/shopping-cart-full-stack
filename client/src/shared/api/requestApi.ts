const DEFAULT_API_BASE_URL = 'https://paradi-easter.up.railway.app';
const DEFAULT_API_ERROR_MESSAGE = '요청에 실패했습니다.';

type ApiResponse<T> = {
  body: T;
};

interface RequestApiOptions extends RequestInit {
  errorMessage?: string;
}

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number
  ) {
    super(message);
  }
}

export async function requestApi<T>(path: string, options: RequestApiOptions = {}): Promise<T> {
  const response = await requestApiResponse(path, options);
  const data = (await response.json()) as ApiResponse<T>;

  return data.body;
}

export async function requestApiWithoutBody(path: string, options: RequestApiOptions = {}): Promise<void> {
  await requestApiResponse(path, options);
}

async function requestApiResponse(
  path: string,
  {errorMessage = DEFAULT_API_ERROR_MESSAGE, ...options}: RequestApiOptions
) {
  const response = await fetch(`${getApiBaseUrl()}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new ApiError(await getApiErrorMessage(response, errorMessage), response.status);
  }

  return response;
}

async function getApiErrorMessage(response: Response, defaultErrorMessage: string) {
  try {
    const data = (await response.json()) as {body?: {message?: string}};
    const errorMessage = data.body?.message;

    if (errorMessage) {
      return errorMessage;
    }

    return defaultErrorMessage;
  } catch {
    return defaultErrorMessage;
  }
}

function getApiBaseUrl() {
  if (typeof __API_BASE_URL__ === 'string' && __API_BASE_URL__.length > 0) {
    return __API_BASE_URL__;
  }

  return DEFAULT_API_BASE_URL;
}
