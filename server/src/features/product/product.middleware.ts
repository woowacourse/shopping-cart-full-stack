import { Request, Response, NextFunction } from "express";
import { ProductValidationError, ProductNotFoundError } from "./product.error.js";

function handleProductError(error: Error, req: Request, res: Response, next: NextFunction) {
  if (error instanceof ProductValidationError) {
    return res.status(error.status).json({
      result: "error",
      message: error.message,
      errors: error.errors,
    });
  }

  if (error instanceof ProductNotFoundError) {
    return res.status(error.status).json({
      result: "error",
      message: error.message,
    });
  }

  next(error);
}

export default handleProductError;
