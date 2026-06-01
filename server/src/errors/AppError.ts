import { ERROR_CODE, ErrorCodeKey } from './errorCode.js';

class AppError extends Error {
  public readonly status: number;
  public readonly code: ErrorCodeKey;

  constructor(errorKey: ErrorCodeKey) {
    const { code, status, message } = ERROR_CODE[errorKey];
    super(message);
    this.status = status;
    this.code = code;
    this.name = 'AppError';
  }
}

export default AppError;
