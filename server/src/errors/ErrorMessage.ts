export const ERROR_MESSAGE = {
  NOT_FOUND_PRODUCT: "해당 상품이 존재하지 않습니다.",
  NOT_FOUND_CART_ITEM: "해당 장바구니 상품이 존재하지 않습니다.",
  INVALID_CART_ID: "유효하지 않은 장바구니 ID입니다.",
  INVALID_PRODUCT_ID: "유효하지 않은 상품 ID입니다.",
  INVALID_QUANTITY: "유효하지 않은 수량입니다.",
  INVALID_QUANTITY_RANGE: "quantity는 1~99 사이어야합니다.",
  INVALID_PRICE: "price는 0보다 큰 숫자이어야합니다.",
  INVALID_NAME: "name은 필수이며 100자 이내여야합니다.",
  INVALID_THUMBNAIL_URL: "thumbnailUrl은 필수 항목입니다.",
  SERVER_ERROR: "네트워크 에러가 발생했습니다!",
} as const;
