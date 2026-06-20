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

export type ProductDiscountBenefit =
  | {
      target: 'PRODUCT';
      type: 'DISCOUNT_AMOUNT';
      discountAmount: number;
    }
  | {
      target: 'PRODUCT';
      type: 'DISCOUNT_HIGHEST_UNIT_PRICE_ITEM';
      discountQuantity: number;
    }
  | {
      target: 'PRODUCT';
      type: 'DISCOUNT_RATE';
      discountRate: number;
      applyAfterFixedDiscount: boolean;
    };

export type ShippingDiscountBenefit = {
  target: 'SHIPPING';
  type: 'FREE_SHIPPING';
  includesRemoteAreaFee: boolean;
};

export type CouponBenefit = ProductDiscountBenefit | ShippingDiscountBenefit;

export interface Coupon {
  id: number;
  code: string;
  name: string;
  expirationDate: Date;
  condition: CouponCondition;
  benefit: CouponBenefit;
}

export interface CouponResponse {
  couponId: number;
  code: string;
  name: string;
  expirationDate: string;
  condition: CouponCondition;
  benefit: CouponBenefit;
  disabled: boolean;
  disabledReason: string | null;
}
