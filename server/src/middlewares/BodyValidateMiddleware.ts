import { Request, Response, NextFunction } from 'express';
import { ProductFieldValidators, CartFieldValidators } from '../validators.js';
import { runValidate } from '../utils.js';

export function productBodyValidateMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const errors = runValidate(ProductFieldValidators, req.body);

  const hasErrors = Object.values(errors).some((arr) => arr.length > 0);
  if (hasErrors) {
    res.status(400).send({ errors: errors });
    return;
  }
  next();
}

export function cartBodyValidateMiddelware(
  req: Request<{ productId: string }>,
  res: Response,
  next: NextFunction,
) {
  const errors = runValidate(CartFieldValidators, req.body);

  const hasErrors = Object.values(errors).some((arr) => arr.length > 0);
  if (hasErrors) {
    res.status(400).send({ errors: errors });
    return;
  }
  next();
}
