import ERROR_CODES from "@/ERROR_CODE";
import { AppError } from "@/errors/AppError";
import { Request, Response, NextFunction } from "express";

const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  if (err instanceof AppError) {
    const { status, code, message } = ERROR_CODES[err.code];

    return res.status(status).json({
      status: "error",
      statusCode: status,
      code,
      message,
    });
  }

  return res.status(500).json({
    status: "error",
    code: "INTERNAL_SERVER_ERROR",
    message: "서버 내부 오류가 발생하였습니다.",
  });
};

export default errorHandler;
