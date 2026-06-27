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
  NOT_EXIST_CARTS_PRODUCT: {
    code: "NOT_EXIST_CARTS_PRODUCT",
    message: "장바구니에 존재하지 않는 상품입니다.",
    status: 404,
  },
  INVALID_ORDER: {
    code: "INVALID_ORDER",
    message: "유효하지 않은 주문 요청입니다.",
    status: 400,
  },
  OUT_OF_STOCK: {
    code: "OUT_OF_STOCK",
    message: "재고가 없는 상품입니다.",
    status: 404,
  },
  NOT_FOUND_ORDER: {
    code: "NOT_FOUND_ORDER",
    message: "존재하지 않는 주문입니다.",
    status: 404,
  },
  EXPIRED_COUPON: {
    code: "EXPIRED_COUPON",
    message: "만료된 쿠폰입니다.",
    status: 404,
  },
  INVALID_PATCH_ORDER: {
    code: "INVALID_PATCH_ORDER",
    message: "유효하지 않은 주문 변경 요청입니다.",
    status: 400,
  },
  INVALID_PAYMENT: {
    code: "INVALID_PAYMENT",
    message: "유효하지 않은 결제 요청입니다.",
    status: 400,
  },
  PAYMENT_AMOUNT_MISMATCH: {
    code: "PAYMENT_AMOUNT_MISMATCH",
    message: "결제 금액이 일치하지 않습니다.",
    status: 400,
  },
} as const;

export default ERROR_CODES;
