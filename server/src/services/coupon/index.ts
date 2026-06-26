export { MAX_COUPON_COUNT, BTGO_MIN_QUANTITY, validateCouponCondition, getValidCoupons } from "./validation.js";
export type { CouponContext } from "./validation.js";

export { sumCheckoutAmount, calculateCouponDiscount, findBestCouponCombination } from "./discount.js";
export type { DiscountContext, BestCombinationContext } from "./discount.js";
