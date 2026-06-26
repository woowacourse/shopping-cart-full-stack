import BaseCoupon, {
  CouponContext,
  CouponParams,
  DiscountType,
} from './Coupon.js';

interface BuyNGetMCouponParams extends CouponParams {
  buyQuantity: number;
  freeQuantity: number;
}

class BuyNGetMCoupon extends BaseCoupon {
  #buyQuantity: number;
  #freeQuantity: number;

  constructor({ buyQuantity, freeQuantity, ...params }: BuyNGetMCouponParams) {
    super(params);
    this.#buyQuantity = buyQuantity;
    this.#freeQuantity = freeQuantity;
  }

  getDiscountType(): DiscountType {
    return 'FIXED';
  }

  canApply(context: CouponContext) {
    return (
      super.canApply(context) &&
      context.orderSheet
        .toObject()
        .items.some(({ quantity }) => quantity >= this.requiredQuantity())
    );
  }

  calculateDiscount(context: CouponContext) {
    if (!this.canApply(context)) {
      return 0;
    }

    const targetItems = context.orderSheet
      .toObject()
      .items.filter(({ quantity }) => quantity >= this.requiredQuantity());

    const mostExpensiveItem = targetItems.reduce((maxItem, item) =>
      item.product.price > maxItem.product.price ? item : maxItem,
    );

    return mostExpensiveItem.product.price * this.#freeQuantity;
  }

  requiredQuantity() {
    return this.#buyQuantity + this.#freeQuantity;
  }
}

export default BuyNGetMCoupon;
