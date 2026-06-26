import {
  validateIsNotEmpty,
  validateLengthRange,
  validateMinNumber,
  validateNumberRange,
  validateMaxArrayLength,
} from "../validators.js";
import { ValidatorMap } from "../types.js";
import {
  PRODUCT_NAME_LENGTH,
  PRODUCT_PRICE_MIN,
  CART_ITEM_QUANTITY,
  COUPON_SELECT_LIMIT,
} from "./constants.js";

export const ProductFieldValidators: ValidatorMap = {
  name: [
    validateIsNotEmpty("상품명"),
    validateLengthRange(
      "상품명",
      PRODUCT_NAME_LENGTH.min,
      PRODUCT_NAME_LENGTH.max,
    ),
  ],
  price: [
    validateIsNotEmpty("가격"),
    validateMinNumber("가격", PRODUCT_PRICE_MIN),
  ],
};

export const CartFieldValidators: ValidatorMap = {
  quantity: [
    validateNumberRange("수량", CART_ITEM_QUANTITY.min, CART_ITEM_QUANTITY.max),
  ],
};

export const TempOrderFieldValidators: ValidatorMap = {
  selected_coupons: [validateMaxArrayLength("쿠폰", COUPON_SELECT_LIMIT)],
};

export const DiscountSummaryFieldValidators: ValidatorMap = {
  selected_coupons: [validateMaxArrayLength("쿠폰", COUPON_SELECT_LIMIT)],
};
