import { checkIsProduct, CreateProductRequest } from "./products.schema";

// 비즈니스 유효성 검사
export const validateProductRules = (arg: CreateProductRequest) => {
  if (arg.price <= 0) {
    throw new Error("price는 0보다 큰 정수여아 합니다.");
  }
  if (arg.name.length > 100) {
    throw new Error("상품명은 100자 이하여야 합니다.");
  }

  if (arg.name === "") {
    throw new Error("상품명은 1자 이상이여야 합니다.");
  }
};
