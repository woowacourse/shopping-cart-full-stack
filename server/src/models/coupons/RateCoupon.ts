import BaseCoupon, {
  CouponContext,
  DiscountType,
  CouponParams,
} from './Coupon.js';

interface RateCouponParams extends CouponParams {
  rate: number;
}

class RateCoupon extends BaseCoupon {
  #rate: number;

  constructor({ rate, ...params }: RateCouponParams) {
    super(params);
    this.#rate = rate;
  }

  getDiscountType(): DiscountType {
    return 'RATE';
  }

  calculateDiscount(context: CouponContext) {
    if (!this.canApply(context)) {
      return 0;
    }

    const { orderAmount } = context;
    return Math.floor(orderAmount * (this.#rate / 100));
  }
}

export default RateCoupon;
