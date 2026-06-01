import type { ErrorRequestHandler } from 'express';
import { AppError } from '../errors/AppError.js';

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      code: error.code,
      message: error.message,
    });
    return;
  }

  res.status(500).json({
    code: 'INTERNAL_SERVER_ERROR',
    message: '서버 오류가 발생했습니다.',
  });
};
