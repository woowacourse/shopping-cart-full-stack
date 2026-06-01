export const ERROR_CODE = {
  PRODUCT_NAME_LENGTH_EXCEEDED: {
    code: 'PRODUCT_NAME_LENGTH_EXCEEDED',
    status: 400,
    message: '상품명은 100자를 초과할 수 없습니다.',
  },
  INVALID_PRODUCT_PRICE_TYPE: {
    code: 'INVALID_PRODUCT_PRICE_TYPE',
    status: 400,
    message: '가격은 0보다 큰 숫자여야 합니다.',
  },
  INVALID_PRODUCT_QUANTITY_RANGE: {
    code: 'INVALID_PRODUCT_QUANTITY_RANGE',
    status: 400,
    message: '상품 재고는 1이상 99이하의 정수이어야 합니다.',
  },
  EMPTY_PRODUCT_NAME: {
    code: 'EMPTY_PRODUCT_NAME',
    status: 400,
    message: '상품명 필드가 누락되었습니다.',
  },
  EMPTY_PRODUCT_PRICE: {
    code: 'EMPTY_PRODUCT_PRICE',
    status: 400,
    message: '가격 필드가 누락되었습니다.',
  },
  EMPTY_PRODUCT_QUANTITY: {
    code: 'EMPTY_PRODUCT_QUANTITY',
    status: 400,
    message: '상품 재고 필드가 누락되었습니다.',
  },
  PRODUCT_NOT_EXIST: {
    code: 'PRODUCT_NOT_EXIST',
    status: 404,
    message: '삭제하려는 상품이 존재하지 않습니다.',
  },
  INVALID_PRODUCT_ORDER_COUNT_TYPE: {
    code: 'INVALID_PRODUCT_ORDER_COUNT_TYPE',
    status: 400,
    message: '변경할 수량은 0보다 큰 숫자여야 합니다.',
  },
  PRODUCT_ORDER_COUNT_EXCEEDED: {
    code: 'PRODUCT_ORDER_COUNT_EXCEEDED',
    status: 400,
    message: '보유한 상품의 개수를 넘어섰습니다.',
  },
  EMPTY_PRODUCT_ORDER_COUNT: {
    code: 'EMPTY_PRODUCT_ORDER_COUNT',
    status: 400,
    message: '주문 수량 필드가 누락되었습니다.',
  },
  PRODUCT_NOT_EXIST_FOR_ORDER: {
    code: 'PRODUCT_NOT_EXIST',
    status: 404,
    message: '수량을 변경하려는 상품이 존재하지 않습니다.',
  },
  PRODUCT_NOT_EXIST_IN_CART: {
    code: 'PRODUCT_NOT_EXIST_IN_CART',
    status: 404,
    message: '삭제하려는 상품이 장바구니에 존재하지 않습니다.',
  },
  INTERNAL_SERVER_ERROR: {
    code: 'INTERNAL_SERVER_ERROR',
    status: 500,
    message: '서버 오류가 발생했습니다.',
  },
} as const;

export type ErrorCodeKey = keyof typeof ERROR_CODE;
