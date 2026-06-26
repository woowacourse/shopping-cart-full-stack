import BaseCoupon, {
  CouponContext,
  DiscountType,
  CouponParams,
} from './Coupon.js';

interface FixedAmountCouponParams extends CouponParams {
  amount: number;
}

class FixedAmountCoupon extends BaseCoupon {
  #amount: number;

  constructor({ amount, ...params }: FixedAmountCouponParams) {
    super(params);
    this.#amount = amount;
  }

  getDiscountType(): DiscountType {
    return 'FIXED';
  }

  calculateDiscount(context: CouponContext) {
    if (!this.canApply(context)) {
      return 0;
    }

    return this.#amount;
  }
}

export default FixedAmountCoupon;
