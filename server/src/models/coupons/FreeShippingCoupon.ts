import BaseCoupon, { CouponContext, DiscountType } from './Coupon.js';

class FreeShippingCoupon extends BaseCoupon {
  getDiscountType(): DiscountType {
    return 'FIXED';
  }

  canApply(context: CouponContext) {
    return super.canApply(context) && context.shippingFee > 0;
  }

  calculateDiscount(context: CouponContext) {
    if (!this.canApply(context)) {
      return 0;
    }

    return context.shippingFee;
  }
}

export default FreeShippingCoupon;
