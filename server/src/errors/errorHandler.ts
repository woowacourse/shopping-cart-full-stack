import AppError from './AppError.js';
import { ERROR_CODE } from './errorCode.js';

export const errorHandler = (error: unknown) => {
  if (error instanceof AppError) {
    return {
      status: error.status,
      code: error.code,
      message: error.message,
    };
  }

  console.error(error);
  return ERROR_CODE['INTERNAL_SERVER_ERROR'];
};
