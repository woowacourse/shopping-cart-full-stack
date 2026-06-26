import Coupon, { type CouponContext, type DiscountCategory } from "./Coupon.ts";

/** 배송비를 전액(도서산간 추가 배송비 포함) 무료로 만드는 쿠폰. */
export default class FreeShippingCoupon extends Coupon {
  readonly category: DiscountCategory = "SHIPPING";

  isAvailable(context: CouponContext): boolean {
    return super.isAvailable(context) && context.shippingFee > 0;
  }

  discount(context: CouponContext): number {
    return context.shippingFee;
  }
}
