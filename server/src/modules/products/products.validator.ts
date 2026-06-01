import { AppError } from "@/errors/AppError";
import { checkIsProduct, CreateProductRequest } from "./products.schema";

// 비즈니스 유효성 검사
export const validateProductRules = (arg: CreateProductRequest) => {
  if (arg.price <= 0) {
    throw new AppError("PRICE_MUST_BE_POSITIVE");
  }
  if (arg.name.length > 100) {
    throw new AppError("NAME_TOO_LONG");
  }

  if (arg.name === "") {
    throw new AppError("NAME_REQUIRED");
  }
};
