import ERROR_CODES from "../../ERROR_CODE";
import { checkIsProduct, CreateProductRequest } from "./products.schema";

// 비즈니스 유효성 검사
export const validateProductRules = (arg: CreateProductRequest) => {
  if (arg.price <= 0) {
    throw new Error(ERROR_CODES.PRICE_MUST_BE_POSITIVE.code);
  }
  if (arg.name.length > 100) {
    throw new Error(ERROR_CODES.NAME_TOO_LONG.code);
  }

  if (arg.name === "") {
    throw new Error(ERROR_CODES.NAME_REQUIRED.code);
  }
};
