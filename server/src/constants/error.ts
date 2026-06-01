export const PRODUCT_ERROR_RESPONSE = {
  REQUIRED_PRODUCT_NAME: {
    status: 400,
    code: "REQUIRED_PRODUCT_NAME",
    message: "상품 이름은 필수입니다.",
  },
  REQUIRED_PRODUCT_PRICE: {
    status: 400,
    code: "REQUIRED_PRODUCT_PRICE",
    message: "상품 가격은 필수입니다.",
  },
  REQUIRED_PRODUCT_STOCK: {
    status: 400,
    code: "REQUIRED_PRODUCT_STOCK",
    message: "상품 재고는 필수입니다.",
  },
  REQUIRED_PRODUCT_IMAGE: {
    status: 400,
    code: "REQUIRED_PRODUCT_IMAGE",
    message: "상품 이미지는 필수입니다.",
  },

  INVALID_PRODUCT_NAME: {
    status: 400,
    code: "INVALID_PRODUCT_NAME",
    message: "상품 이름은 1자 이상 100자 이하이어야 합니다.",
  },
  INVALID_PRODUCT_PRICE: {
    status: 400,
    code: "INVALID_PRODUCT_PRICE",
    message: "가격은 0보다 큰 숫자여야 합니다.",
  },
  INVALID_PRODUCT_STOCK: {
    status: 400,
    code: "INVALID_PRODUCT_STOCK",
    message: "재고는 1 이상 99 이하의 정수여야 합니다.",
  },
  INVALID_PRODUCT_IMAGE: {
    status: 400,
    code: "INVALID_PRODUCT_IMAGE",
    message: "상품 이미지는 필수입니다.",
  },

  PRODUCT_NOT_FOUND: {
    status: 404,
    code: "PRODUCT_NOT_FOUND",
    message: "요청한 상품을 찾을 수 없습니다.",
  },
} as const;

export const CART_ERROR_RESPONSE = {
  CART_ITEM_NOT_FOUND: {
    status: 404,
    code: "CART_ITEM_NOT_FOUND",
    message: "장바구니 상품을 찾을 수 없습니다.",
  },

  REQUIRED_CART_ITEM_QUANTITY: {
    status: 400,
    code: "REQUIRED_CART_ITEM_QUANTITY",
    message: "장바구니 상품 수량은 필수입니다.",
  },

  INVALID_CART_ITEM_QUANTITY: {
    status: 400,
    code: "INVALID_CART_ITEM_QUANTITY",
    message: "장바구니 상품 수량은 1개 이상이어야 합니다.",
  },

  OUT_OF_STOCK: {
    status: 409,
    code: "OUT_OF_STOCK",
    message: "요청한 수량이 현재 재고보다 많습니다.",
  },
} as const;

export const COMMON_ERROR_RESPONSE = {
  INVALID_REQUEST_BODY: {
    status: 400,
    code: "INVALID_REQUEST_BODY",
    message: "요청 데이터가 올바르지 않습니다.",
  },
  INVALID_ID: {
    status: 400,
    code: "INVALID_ID",
    message: "유효하지 않은 ID입니다.",
  },
  INTERNAL_SERVER_ERROR: {
    status: 500,
    code: "INTERNAL_SERVER_ERROR",
    message: "서버 내부 오류가 발생했습니다.",
  },
} as const;

export const ERROR_RESPONSE = {
  ...PRODUCT_ERROR_RESPONSE,
  ...CART_ERROR_RESPONSE,
  ...COMMON_ERROR_RESPONSE,
} as const;
