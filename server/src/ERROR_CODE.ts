const ERROR_CODES = {
  DUPLICATE_PRODUCT_NAME: {
    code: "DUPLICATE_PRODUCT_NAME",
    message: "이미 존재하는 상품명입니다.",
    status: 409,
  },
  PRICE_MUST_BE_POSITIVE: {
    code: "PRICE_MUST_BE_POSITIVE",
    message: "상품 가격은 양수여야 합니다.",
    status: 400,
  },
  NAME_TOO_LONG: {
    code: "NAME_TOO_LONG",
    message: "상품명은 100자 이하여야 합니다.",
    status: 400,
  },
  NAME_REQUIRED: {
    code: "NAME_REQUIRED",
    message: "상품명은 필수입니다.",
    status: 400,
  },
  NOT_EXIST_PRODUCT: {
    code: "NOT_EXIST_PRODUCT",
    message: "존재하지 않는 상품입니다.",
    status: 404,
  },
  INVALID_ID: {
    code: "INVALID_ID",
    message: "유효하지 않은 ID입니다.",
    status: 400,
  },
  INVALID_PRODUCT: {
    code: "INVALID_PRODUCT",
    message: "유효하지 않은 상품입니다.",
    status: 400,
  },
  OUT_OF_RANGE_CARTS_QUANTITY: {
    code: "OUT_OF_RANGE_CARTS_QUANTITY",
    message: "상품 수량은 1~99까지 가능합니다.",
    status: 400,
  },
  NOT_EXIST_CARTS_ITEM: {
    code: "NOT_EXIST_CARTS_ITEM",
    message: "존재하지 않은 장바구니 아이템입니다.",
    status: 404,
  },
  INVALID_CARTS_QUANTITY: {
    code: "INVALID_CARTS_QUANTITY",
    message: "유효하지 않은 장바구니 수량입니다.",
    status: 400,
  },
} as const;

export default ERROR_CODES;
