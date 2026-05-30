export interface FieldError {
  field: string;
  code: string;
  message: string;
}

export class ValidationError extends Error {
  errors: FieldError[];
  constructor(errors: FieldError[]) {
    super("요청 값이 올바르지 않습니다.");
    this.errors = errors;
  }
}

export class ProductNotFoundError extends Error {
  status = 404;
  constructor(message: string) {
    super(message);
  }
}

export class InvalidProductIdError extends Error {
  constructor() {
    super("해당하는 상품의 id 형식이 유효하지 않습니다.");
  }
}

export const productErrors = {
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
    field: "imageUrl",
    code: "PRODUCT_IMAGE_URL_INVALID",
    message: "유효한 이미지 URL 형식이 아닙니다.",
  },
};
