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
};

export default ERROR_CODES;
