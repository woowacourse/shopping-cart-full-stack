const PRODUCT_ERROR_CODE = {
  PRODUCT_NAME_LENGTH_EXCEEDED: {
    code: "PRODUCT_NAME_LENGTH_EXCEEDED",
    message: "상품명은 100자를 초과할 수 없습니다.",
  },
  INVALID_PRODUCT_PRICE_TYPE: {
    code: "INVALID_PRODUCT_PRICE_TYPE",
    message: "가격은 0보다 큰 숫자여야 합니다.",
  },
  INVALID_PRODUCT_QUANTITY_RANGE: {
    code: "INVALID_PRODUCT_QUANTITY_RANGE",
    message: "상품 재고는 1이상 99이하의 정수이어야 합니다.",
  },
  EMPTY_PRODUCT_NAME: {
    code: "EMPTY_PRODUCT_NAME",
    message: "상품명 필드가 누락되었습니다.",
  },
  EMPTY_PRODUCT_PRICE: {
    code: "EMPTY_PRODUCT_PRICE",
    message: "가격 필드가 누락되었습니다.",
  },
  EMPTY_PRODUCT_QUANTITY: {
    code: "EMPTY_PRODUCT_QUANTITY",
    message: "상품 재고 필드가 누락되었습니다.",
  },
  PRODUCT_NOT_EXIST: {
    code: "PRODUCT_NOT_EXIST",
    message: "상품이 존재하지 않습니다.",
  },
} as const;

const CART_ERROR_CODE = {
  INVALID_PRODUCT_ORDER_COUNT_TYPE: {
    code: "INVALID_PRODUCT_ORDER_COUNT_TYPE",
    message: "변경할 수량은 0보다 큰 숫자여야 합니다.",
  },
  PRODUCT_ORDER_COUNT_EXCEEDED: {
    code: "PRODUCT_ORDER_COUNT_EXCEEDED",
    message: "보유한 상품의 개수를 넘어섰습니다.",
  },
  EMPTY_PRODUCT_ORDER_COUNT: {
    code: "EMPTY_PRODUCT_ORDER_COUNT",
    message: "주문 수량 필드가 누락되었습니다.",
  },
  PRODUCT_NOT_EXIST_IN_CART: {
    code: "PRODUCT_NOT_EXIST_IN_CART",
    message: "해당 상품이 장바구니에 존재하지 않습니다.",
  },
  CART_NOT_EXIST: {
    code: "CART_NOT_EXIST",
    message: "장바구니가 존재하지 않습니다.",
  },
} as const;

const COMMON_ERROR_CODE = {
  INTERNAL_SERVER_ERROR: {
    code: "INTERNAL_SERVER_ERROR",
    message: "서버 오류가 발생했습니다.",
  },
} as const;

export const ERROR_CODE = {
  ...PRODUCT_ERROR_CODE,
  ...CART_ERROR_CODE,
  ...COMMON_ERROR_CODE,
} as const;

export type ErrorCodeKey = keyof typeof ERROR_CODE;

export const ERROR_STATUS: Record<ErrorCodeKey, number> = {
  PRODUCT_NAME_LENGTH_EXCEEDED: 400,
  INVALID_PRODUCT_PRICE_TYPE: 400,
  INVALID_PRODUCT_QUANTITY_RANGE: 400,
  EMPTY_PRODUCT_NAME: 400,
  EMPTY_PRODUCT_PRICE: 400,
  EMPTY_PRODUCT_QUANTITY: 400,
  PRODUCT_NOT_EXIST: 404,

  INVALID_PRODUCT_ORDER_COUNT_TYPE: 400,
  PRODUCT_ORDER_COUNT_EXCEEDED: 400,
  EMPTY_PRODUCT_ORDER_COUNT: 400,
  PRODUCT_NOT_EXIST_IN_CART: 404,
  CART_NOT_EXIST: 404,

  INTERNAL_SERVER_ERROR: 500,
};
