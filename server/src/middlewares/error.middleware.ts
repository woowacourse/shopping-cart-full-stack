import { NextFunction, Request, Response } from "express";
import AppError from "../errors/AppError.js";
import { ERROR_CODE, ERROR_STATUS } from "../errors/errorCode.js";

export const errorMiddleware = (
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  if (error instanceof AppError) {
    res.status(ERROR_STATUS[error.code]).json({
      code: error.code,
      message: error.message,
    });
    return;
  }

  const internalServerError = ERROR_CODE["INTERNAL_SERVER_ERROR"];

  res.status(ERROR_STATUS["INTERNAL_SERVER_ERROR"]).json({
    code: internalServerError.code,
    message: internalServerError.message,
  });
};
