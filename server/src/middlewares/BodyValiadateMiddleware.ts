import { Request, Response, NextFunction } from "express";
import { ProductFieldValidators, CartFieldValidators } from "../validators.js";
import { BadRequestError } from "../errors.js";
import { ValidatorMap } from "../utils.js";
import { runValidate } from "../utils.js";

function createValidateBodyMiddleware(validatorMap: ValidatorMap) {
  return function middleware(req: Request, res: Response, next: NextFunction) {
    const errors = runValidate(validatorMap, req.body);

    const hasErrors = Object.keys(errors).length > 0;
    if (hasErrors) {
      throw new BadRequestError({ errors: errors });
    }
    next();
  };
}

export const productBodyValidateMiddelware = createValidateBodyMiddleware(
  ProductFieldValidators,
);

export const cartBodyValidateMiddelware =
  createValidateBodyMiddleware(CartFieldValidators);
