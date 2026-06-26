import { HttpResponse, type HttpResponseResolver } from "msw";

// server/src/ERROR_CODE.ts 와 동일.
export const ERROR_CODES = {
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
  INVALID_COUPON_IDS: {
    code: "INVALID_COUPON_IDS",
    message: "올바르지 않은 쿠폰 ID입니다.",
    status: 400,
  },
  INVALID_IS_ISLAND: {
    code: "INVALID_IS_ISLAND",
    message: "올바르지 않은 도서 산간 정보입니다.",
    status: 400,
  },
  NOT_EXIST_COUPON: {
    code: "NOT_EXIST_COUPON",
    message: "존재하지 않는 쿠폰입니다.",
    status: 404,
  },
  EXCEED_MAX_COUPON_COUNT: {
    code: "EXCEED_MAX_COUPON_COUNT",
    message: "쿠폰은 최대 2개까지 적용할 수 있습니다.",
    status: 400,
  },
  UNUSABLE_COUPON: {
    code: "UNUSABLE_COUPON",
    message: "사용할 수 없는 쿠폰입니다.",
    status: 400,
  },
  INVALID_ORDER_PRODUCTS: {
    code: "INVALID_ORDER_PRODUCTS",
    message: "유효하지 않은 주문 상품 정보입니다.",
    status: 400,
  },
  NOT_EXIST_ORDER: {
    code: "NOT_EXIST_ORDER",
    message: "존재하지 않는 주문입니다.",
    status: 404,
  },
  OUT_OF_RANGE_ORDER_QUANTITY: {
    code: "OUT_OF_RANGE_ORDER_QUANTITY",
    message: "주문 수량은 1~99까지 가능합니다.",
    status: 400,
  },
  INTERNAL_SERVER_ERROR: {
    code: "INTERNAL_SERVER_ERROR",
    message: "서버 내부 오류입니다.",
    status: 500,
  },
} as const;

export type ErrorCode = (typeof ERROR_CODES)[keyof typeof ERROR_CODES];

// server 의 createAppError 역할. 검증/서비스 로직에서 throw 한다.
export class MockAppError extends Error {
  readonly errorCode: ErrorCode;

  constructor(errorCode: ErrorCode) {
    super(errorCode.message);
    this.name = "MockAppError";
    this.errorCode = errorCode;
  }
}

// server 의 errorHandler 와 동일한 응답 형태: { status: "error", message }
export const errorResponse = ({ message, status }: ErrorCode) =>
  HttpResponse.json({ status: "error", message }, { status });

// 모든 핸들러를 감싸 throw 된 에러를 server errorHandler 와 동일하게 매핑한다.
// MockAppError 면 해당 status/message, 그 외(예상치 못한 throw)는 500.
export const withErrorHandling =
  (resolver: HttpResponseResolver): HttpResponseResolver =>
  async (info) => {
    try {
      return await resolver(info);
    } catch (error) {
      if (error instanceof MockAppError) {
        return errorResponse(error.errorCode);
      }
      return errorResponse(ERROR_CODES.INTERNAL_SERVER_ERROR);
    }
  };
