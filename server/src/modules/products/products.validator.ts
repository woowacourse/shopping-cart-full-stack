import ERROR_CODES from "../../ERROR_CODE";
import createAppError from "@/errors/AppError";
import { checkIsProduct, CreateProductRequest } from "./products.schema";

// 비즈니스 유효성 검사
export const validateProductRules = (arg: CreateProductRequest) => {
  if (arg.price <= 0) {
    throw createAppError(ERROR_CODES.PRICE_MUST_BE_POSITIVE);
  }
  if (arg.name.length > 100) {
    throw createAppError(ERROR_CODES.NAME_TOO_LONG);
  }

  if (arg.name === "") {
    throw createAppError(ERROR_CODES.NAME_REQUIRED);
  }
};
