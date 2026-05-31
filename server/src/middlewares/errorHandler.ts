import ERROR_CODES from "@/ERROR_CODE";
import { isAppError } from "@/errors/AppError";
import { Request, Response, NextFunction } from "express";

const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  if (isAppError(err)) {
    return res.status(err.status).json({
      status: "error",
      message: err.message,
    });
  }

  return res.status(ERROR_CODES.INTERNAL_SERVER_ERROR.status).json({
    status: "error",
    message: ERROR_CODES.INTERNAL_SERVER_ERROR.message,
  });
};

export default errorHandler;
