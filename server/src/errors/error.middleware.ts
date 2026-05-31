import { Request, Response, NextFunction } from "express";
import { HttpError } from "./http.error.js";

export function globalErrorHandler(error: Error, req: Request, res: Response, next: NextFunction) {
  if (error instanceof HttpError) {
    return res.status(error.status).json({
      result: "error",
      message: error.message,
    });
  }

  return res.status(500).json({
    result: "error",
    message: "Internal Server Error",
  });
}
