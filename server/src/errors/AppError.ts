import ERROR_CODES from "@/ERROR_CODE";

type ErrorCode = (typeof ERROR_CODES)[keyof typeof ERROR_CODES];

export interface AppError extends Error {
  code: string;
  status: number;
  isAppError: true;
}

const createAppError = ({ code, message, status }: ErrorCode): AppError =>
  Object.assign(new Error(message), {
    code,
    status,
    isAppError: true as const,
  });

export const isAppError = (err: unknown): err is AppError =>
  err instanceof Error && (err as Partial<AppError>).isAppError === true;

export default createAppError;
