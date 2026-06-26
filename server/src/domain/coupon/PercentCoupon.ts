import Coupon, { type CouponContext, type DiscountCategory } from "./Coupon.ts";

/** 정율 할인 쿠폰. 정액 쿠폰이 모두 적용된 이후의 금액에서 일정 비율을 깎는다. */
export default class PercentCoupon extends Coupon {
  readonly category: DiscountCategory = "PRODUCT_PERCENT";
  readonly #rate: number;

  constructor(props: ConstructorParameters<typeof Coupon>[0], rate: number) {
    super(props);
    this.#rate = rate;
  }

  discount(context: CouponContext): number {
    return Math.floor(context.currentAmount * this.#rate);
  }
}
