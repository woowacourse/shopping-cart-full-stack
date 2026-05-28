import ERROR_CODES from "@/ERROR_CODE";
import { Request, Response, NextFunction } from "express";

const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  const errorMessage = err instanceof Error ? err.message : "";
  const statusCode =
    ERROR_CODES[errorMessage as keyof typeof ERROR_CODES]?.status || 400;
  const message =
    ERROR_CODES[errorMessage as keyof typeof ERROR_CODES]?.message ||
    "상품 등록에 실패하였습니다.";

  return res.status(statusCode).json({
    status: "error",
    message: message,
  });
};

export default errorHandler;
