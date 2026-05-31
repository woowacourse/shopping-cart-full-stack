import { Request, Response, NextFunction } from "express";
import { CartNotFoundError, CartValidationError } from "./cart.error.js";

function handleCartError(error: Error, req: Request, res: Response, next: NextFunction) {
  if (error instanceof CartNotFoundError) {
    return res.status(error.status).json({
      result: "error",
      message: error.message,
    });
  }

  if (error instanceof CartValidationError) {
    return res.status(error.status).json({
      result: "error",
      message: error.message,
    });
  }

  next(error);
}

export default handleCartError;
