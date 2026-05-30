import { Request, Response, NextFunction } from "express";
import { ProductFieldValidators, CartFieldValidators } from "../validators.js";
import { ValidatorMap } from "../utils.js";
import { runValidate } from "../utils.js";

function createValidateBodyMiddleware(validatorMap: ValidatorMap) {
  return function middleware(req: Request, res: Response, next: NextFunction) {
    const errors = runValidate(validatorMap, req.body);

    const hasErrors = Object.keys(errors).length > 0;
    if (hasErrors) {
      res.status(400).send({
        code: "INVALID_BODY",
        message: "요청 데이터가 유효하지 않습니다.",
        errors: errors,
      });
      return;
    }
    next();
  };
}

export const productBodyValidateMiddelware = createValidateBodyMiddleware(
  ProductFieldValidators,
);

export const cartBodyValidateMiddelware =
  createValidateBodyMiddleware(CartFieldValidators);
