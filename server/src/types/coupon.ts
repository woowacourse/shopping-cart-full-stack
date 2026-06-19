export type CouponCondition =
  | {
      type: 'MIN_ORDER_AMOUNT';
      minOrderAmount: number;
    }
  | {
      type: 'MIN_SAME_PRODUCT_QUANTITY';
      minSameProductQuantity: number;
    }
  | {
      type: 'TIME_RANGE';
      start: string;
      end: string;
    };

export type CouponBenefit =
  | {
      type: 'DISCOUNT_AMOUNT';
      discountAmount: number;
    }
  | {
      type: 'DISCOUNT_HIGHEST_UNIT_PRICE_ITEM';
      discountQuantity: number;
    }
  | {
      type: 'FREE_SHIPPING';
      includesRemoteAreaFee: boolean;
    }
  | {
      type: 'DISCOUNT_RATE';
      discountRate: number;
      applyAfterFixedDiscount: boolean;
    };

export interface Coupon {
  id: number;
  code: string;
  name: string;
  expirationDate: Date;
  condition: CouponCondition;
  benefit: CouponBenefit;
}
