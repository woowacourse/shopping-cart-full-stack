const BASE_URL = import.meta.env.VITE_BASE_URL;

export type APIResponse<T> = {
  message: string;
  result: T;
};
type RequestOptions = Omit<RequestInit, 'method' | 'body'>;

const request = async <TResponse>(
  path: string,
  init?: RequestInit,
): Promise<TResponse> => {
  const res = await fetch(`${BASE_URL}${path}`, init);
  if (!res.ok) {
    const payload = await res.json();
    throw new Error(payload.message);
  }

  const text = await res.text();
  return (text ? JSON.parse(text) : undefined) as TResponse;
};

export const http = {
  get: <TResponse>(path: string, options?: RequestOptions) =>
    request<TResponse>(path, { ...options, method: 'GET' }),

  patch: <TResponse, TBody = unknown>(
    path: string,
    body: TBody,
    options?: RequestOptions,
  ) =>
    request<TResponse>(path, {
      headers: { 'Content-Type': 'application/json' },
      method: 'PATCH',
      body: JSON.stringify(body),
      ...options,
    }),

  post: <TResponse, TBody = unknown>(
    path: string,
    body: TBody,
    options?: RequestOptions,
  ) =>
    request<TResponse>(path, {
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
      body: JSON.stringify(body),
      ...options,
    }),

  delete: <TResponse>(path: string, options?: RequestOptions) =>
    request<TResponse>(path, {
      method: 'DELETE',
      ...options,
    }),
};
