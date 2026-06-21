const DEFAULT_API_BASE_URL = 'https://paradi-easter.up.railway.app';
const DEFAULT_API_ERROR_MESSAGE = '요청에 실패했습니다.';

type ApiResponse<T> = {
  body: T;
};

export async function requestApi<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await requestApiResponse(path, options);
  const data = (await response.json()) as ApiResponse<T>;

  return data.body;
}

export async function requestApiWithoutBody(path: string, options: RequestInit = {}): Promise<void> {
  await requestApiResponse(path, options);
}

async function requestApiResponse(path: string, options: RequestInit) {
  const response = await fetch(`${getApiBaseUrl()}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error(await getApiErrorMessage(response));
  }

  return response;
}

async function getApiErrorMessage(response: Response) {
  try {
    const data = (await response.json()) as {body?: {message?: string}};
    const errorMessage = data.body?.message;

    if (errorMessage) {
      return errorMessage;
    }

    return DEFAULT_API_ERROR_MESSAGE;
  } catch {
    return DEFAULT_API_ERROR_MESSAGE;
  }
}

function getApiBaseUrl() {
  if (typeof __API_BASE_URL__ === 'string' && __API_BASE_URL__.length > 0) {
    return __API_BASE_URL__;
  }

  return DEFAULT_API_BASE_URL;
}
