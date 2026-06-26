import { ErrorRequestHandler } from 'express';
import { errorHandler } from './errorHandler.js';

export const errorMiddleware: ErrorRequestHandler = (error, _req, res, _next) => {
  const { status, code, message } = errorHandler(error);

  res.status(status).json({ code, message });
};
