export const ERROR_MESSAGE = {
  NOT_FOUND_PRODUCT: "해당 상품이 존재하지 않습니다.",
  NOT_FOUND_CART_ITEM: "해당 장바구니 상품이 존재하지 않습니다.",
  INVALID_ID: "유효하지 않은 ID입니다.",
  INVALID_QUANTITY: "유효하지 않은 수량입니다.",
  INVALID_QUANTITY_RANGE: "quantity는 1~99 사이어야합니다.",
  INVALID_NAME: "name은 100자 이내여야합니다.",
  INVALID_PRICE: "price는 0보다 큰 숫자이어야합니다.",
  INVALID_THUMBNAIL_URL: "thumbnailUrl은 필수 항목입니다.",
  SERVER_ERROR: "네트워크 에러가 발생했습니다!",
  NO_MATCH_PRODUCT: "존재하지 않는 상품이 포함되어 있습니다.",
  NOT_FOUND_COUPON: "존재하지 않는 쿠폰입니다.",
  INVALID_COUPON_CONDITION:
    "사용 조건이 충족되지 않았거나 만료된 쿠폰이 포함되어 있습니다.",
  PRICE_MISMATCH_CONFLICT:
    "결제 요청 금액이 일치하지 않습니다. 그 사이 상품 가격이나 쿠폰 혜택이 변동되었을 수 있습니다. 새로고침 후 다시 시도해주세요.",
  DETAIL_AMOUNT_CONFLICT:
    "할인 내역 또는 배송비 계산 결과가 서버와 일치하지 않습니다.",
  NO_ORDER: "해당 주문 내역을 찾을 수 없습니다.",
  NO_EXPECTED_PRICE: "교차 검증을 위한 예상 결제 금액 정보가 누락되었습니다.",
  NO_PREORDER_RECEIPT: "유효하지 않거나 만료된 주문서(Preorder)입니다.",
  NO_STOCK: "상품의 재고가 부족합니다."
} as const;
