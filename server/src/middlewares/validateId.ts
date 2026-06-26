import { NextFunction, Request, Response } from "express";
import { ERROR_RESPONSE } from "../constants/error.js";

type ErrorResponse = (typeof ERROR_RESPONSE)[keyof typeof ERROR_RESPONSE];

interface IdValidatorOptions {
  param: string;
  errorResponse: ErrorResponse;
  isValid: (value: number) => boolean;
}

function createIdValidator({ param, errorResponse, isValid }: IdValidatorOptions) {
  return (request: Request, response: Response, next: NextFunction): void => {
    const value = Number(request.params[param]);
    if (!isValid(value)) {
      response.status(400).json(errorResponse);
      return;
    }
    next();
  };
}

const isNumber = (value: number): boolean => !Number.isNaN(value);
const isPositiveInt = (value: number): boolean => Number.isInteger(value) && value >= 1;

export const validateProductId = createIdValidator({
  param: "id",
  errorResponse: ERROR_RESPONSE.INVALID_PRODUCT_ID,
  isValid: isNumber,
});

export const validateCartItemId = createIdValidator({
  param: "id",
  errorResponse: ERROR_RESPONSE.INVALID_CART_ITEM_ID,
  isValid: isNumber,
});

export const validateCheckoutId = createIdValidator({
  param: "checkoutId",
  errorResponse: ERROR_RESPONSE.INVALID_CHECKOUT_ID,
  isValid: isPositiveInt,
});
