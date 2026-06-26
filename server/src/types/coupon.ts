export type CouponCondition =
  | {
      target: 'ORDER';
      rule: 'MIN_ORDER_AMOUNT';
      params: {
        minOrderAmount: number;
      };
    }
  | {
      target: 'PRODUCT';
      rule: 'MIN_SAME_PRODUCT_QUANTITY';
      params: {
        minSameProductQuantity: number;
      };
    }
  | {
      target: 'TIME';
      rule: 'TIME_RANGE';
      params: {
        start: string;
        end: string;
      };
    };

export type ProductDiscountType = 'FIXED' | 'RATE';

export type ProductDiscountBenefit =
  | {
      target: 'PRODUCT';
      discountType: 'FIXED';
      rule: 'DISCOUNT_AMOUNT';
      params: {
        discountAmount: number;
      };
    }
  | {
      target: 'PRODUCT';
      discountType: 'FIXED';
      rule: 'DISCOUNT_HIGHEST_UNIT_PRICE_ITEM';
      params: {
        discountQuantity: number;
      };
    }
  | {
      target: 'PRODUCT';
      discountType: 'RATE';
      rule: 'DISCOUNT_RATE';
      params: {
        discountRate: number;
        applyAfterFixedDiscount: boolean;
      };
    };

export type ShippingDiscountBenefit = {
  target: 'SHIPPING';
  rule: 'FREE_SHIPPING';
  params: {};
};

export type CouponBenefit = ProductDiscountBenefit | ShippingDiscountBenefit;

export type CouponConditionResponse = CouponCondition & {
  description: string | null;
};

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
  condition: CouponConditionResponse;
  benefit: CouponBenefit;
  disabled: boolean;
  disabledReason: string | null;
}
