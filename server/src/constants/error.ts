export const ERROR_RESPONSE = {
  REQUIRED_PRODUCT_NAME: {
    code: "REQUIRED_PRODUCT_NAME",
    message: "상품 이름은 필수입니다.",
  },
  REQUIRED_PRODUCT_PRICE: {
    code: "REQUIRED_PRODUCT_PRICE",
    message: "상품 가격은 필수입니다.",
  },
  REQUIRED_PRODUCT_STOCK: {
    code: "REQUIRED_PRODUCT_STOCK",
    message: "상품 재고는 필수입니다.",
  },
  REQUIRED_PRODUCT_IMAGE: {
    code: "REQUIRED_PRODUCT_IMAGE",
    message: "상품 이미지는 필수입니다.",
  },

  INVALID_PRODUCT_NAME: {
    code: "INVALID_PRODUCT_NAME",
    message: "상품 이름은 1자 이상 100자 이하이어야 합니다.",
  },
  INVALID_PRODUCT_PRICE: {
    code: "INVALID_PRODUCT_PRICE",
    message: "가격은 0보다 큰 숫자여야 합니다.",
  },
  INVALID_PRODUCT_STOCK: {
    code: "INVALID_PRODUCT_STOCK",
    message: "재고는 1 이상 99 이하의 정수여야 합니다.",
  },
  INVALID_PRODUCT_IMAGE: {
    code: "INVALID_PRODUCT_IMAGE",
    message: "상품 이미지는 필수입니다.",
  },

  INVALID_REQUEST_BODY: {
    code: "INVALID_REQUEST_BODY",
    message: "요청 데이터가 올바르지 않습니다.",
  },

  INVALID_PRODUCT_ID: {
    code: "INVALID_PRODUCT_ID",
    message: "상품 ID는 숫자여야 합니다.",
  },

  INVALID_CART_ITEM_ID: {
    code: "INVALID_CART_ITEM_ID",
    message: "장바구니 상품 ID는 숫자여야 합니다.",
  },

  PRODUCT_NOT_FOUND: {
    code: "PRODUCT_NOT_FOUND",
    message: "요청한 상품을 찾을 수 없습니다.",
  },

  CART_ITEM_NOT_FOUND: {
    code: "CART_ITEM_NOT_FOUND",
    message: "장바구니 상품을 찾을 수 없습니다.",
  },

  REQUIRED_CART_ITEM_QUANTITY: {
    code: "REQUIRED_CART_ITEM_QUANTITY",
    message: "장바구니 상품 수량은 필수입니다.",
  },

  INVALID_CART_ITEM_QUANTITY: {
    code: "INVALID_CART_ITEM_QUANTITY",
    message: "장바구니 상품 수량은 1개 이상이어야 합니다.",
  },

  OUT_OF_STOCK: {
    code: "OUT_OF_STOCK",
    message: "요청한 수량이 현재 재고보다 많습니다.",
  },

  INVALID_CHECKOUT_ID: {
    code: "INVALID_CHECKOUT_ID",
    message: "주문 ID는 1 이상의 정수여야 합니다.",
  },

  CHECKOUT_NOT_FOUND: {
    code: "CHECKOUT_NOT_FOUND",
    message: "주문을 찾을 수 없습니다.",
  },

  INVALID_QUANTITY: {
    code: "INVALID_QUANTITY",
    message: "수량은 1 이상 99 이하의 정수여야 합니다.",
  },

  INVALID_COUPON_CONDITION: {
    code: "INVALID_COUPON_CONDITION",
    message: "쿠폰 사용 조건을 만족하지 않습니다.",
  },

  COUPON_NOT_FOUND: {
    code: "COUPON_NOT_FOUND",
    message: "요청한 쿠폰을 찾을 수 없습니다.",
  },

  CART_NOT_EMPTY: {
    code: "CART_NOT_EMPTY",
    message: "장바구니가 비어 있을 때만 초기화할 수 있습니다.",
  },

  NOT_FOUND: {
    code: "NOT_FOUND",
    message: "요청한 리소스를 찾을 수 없습니다.",
  },

  INTERNAL_SERVER_ERROR: {
    code: "INTERNAL_SERVER_ERROR",
    message: "서버 내부 오류가 발생했습니다.",
  },
} as const;
