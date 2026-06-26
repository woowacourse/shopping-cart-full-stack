import Coupon, { type CouponContext, type DiscountCategory } from "./Coupon.ts";

/** 정해진 금액만큼 상품 금액에서 깎는 쿠폰 (예: 5,000원 할인). */
export default class FixedAmountCoupon extends Coupon {
  readonly category: DiscountCategory = "PRODUCT_FIXED";
  readonly #amount: number;

  constructor(props: ConstructorParameters<typeof Coupon>[0], amount: number) {
    super(props);
    this.#amount = amount;
  }

  discount(context: CouponContext): number {
    return Math.min(this.#amount, context.currentAmount);
  }
}
