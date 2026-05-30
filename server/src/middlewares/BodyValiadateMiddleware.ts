import { Request, Response, NextFunction } from "express";
import { ProductFieldValidators, CartFieldValidators } from "../validators.js";
import { runValidate } from "../utils.js";

export function productBodyValidateMiddelware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const errors = runValidate(ProductFieldValidators, req.body);

  const hasErrors = Object.keys(errors).length !== 0;
  if (hasErrors) {
    res.status(400).send({
      code: "INVALID_BODY",
      message: "요청 데이터가 유효하지 않습니다.",
      errors: errors,
    });
    return;
  }
  next();
}

export function cartBodyValidateMiddelware(
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
) {
  const errors = runValidate(CartFieldValidators, req.body);

  const hasErrors = Object.keys(errors).length !== 0;
  if (hasErrors) {
    res.status(400).send({
      code: "INVALID_BODY",
      message: "요청 데이터가 유효하지 않습니다.",
      errors: errors,
    });
    return;
  }
  next();
}
