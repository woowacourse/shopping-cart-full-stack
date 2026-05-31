import { BadRequestError, NotFoundError } from "../../errors/http-error.js";

export interface FieldError {
  field: string;
  code: string;
  message: string;
}

export class ProductValidationError extends BadRequestError {
  constructor(public errors: FieldError[]) {
    super("요청 값이 올바르지 않습니다.");
  }
}

export class ProductNotFoundError extends NotFoundError {
  constructor() {
    super("해당하는 상품이 없습니다.");
  }
}

export const PRODUCT_VALIDATION_ERRORS = {
  name: {
    field: "name",
    code: "INVALID_PRODUCT_NAME",
    message: "상품 이름이 유효하지 않습니다.",
  },
  price: {
    field: "price",
    code: "INVALID_PRODUCT_PRICE",
    message: "상품 가격이 유효하지 않습니다.",
  },
  imgUrl: {
    field: "imgUrl",
    code: "INVALID_PRODUCT_IMAGE_URL",
    message: "유효한 이미지 URL 형식이 아닙니다.",
  },
};
