import Coupon, { type CouponContext, type DiscountCategory } from "./Coupon.ts";

/**
 * 2+1 쿠폰. 동일 상품을 3개 이상 구매한 상품들 중 단가가 가장 높은 상품 1개를 무료로 처리한다.
 * (2개를 사면 1개를 더 주는 구조이므로 3개 이상부터 혜택을 받는다. 할인액 = 무료 상품의 단가 1개분)
 */
const MIN_ELIGIBLE_QUANTITY = 3;

export default class BogoCoupon extends Coupon {
  readonly category: DiscountCategory = "PRODUCT_FIXED";

  isAvailable(context: CouponContext): boolean {
    return super.isAvailable(context) && this.hasEligibleItem(context);
  }

  discount(context: CouponContext): number {
    const eligiblePrices = context.items
      .filter((item) => item.quantity >= MIN_ELIGIBLE_QUANTITY)
      .map((item) => item.price);

    if (eligiblePrices.length === 0) return 0;

    return Math.max(...eligiblePrices);
  }

  private hasEligibleItem(context: CouponContext): boolean {
    return context.items.some((item) => item.quantity >= MIN_ELIGIBLE_QUANTITY);
  }
}
