import {
  ProductFieldValidators,
  CartFieldValidators,
  TempOrderFieldValidators,
  DiscountSummaryFieldValidators,
} from "../validators.js";
import { createValidateBodyMiddleware } from "../../middlewares.js";

export const productBodyValidateMiddelware = createValidateBodyMiddleware(
  ProductFieldValidators,
);

export const cartBodyValidateMiddelware =
  createValidateBodyMiddleware(CartFieldValidators);

export const tempOrderBodyValidateMiddleware = createValidateBodyMiddleware(
  TempOrderFieldValidators,
);

export const discountSummaryBodyValidateMiddleware =
  createValidateBodyMiddleware(DiscountSummaryFieldValidators);
