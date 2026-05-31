import { ERROR_CODE, ErrorCodeKey } from './errorCode.js';

class AppError extends Error {
  public readonly code: ErrorCodeKey;

  constructor(errorKey: ErrorCodeKey) {
    const { code, message } = ERROR_CODE[errorKey];
    super(message);
    this.code = code;
    this.name = 'AppError';
  }
}

export default AppError;
