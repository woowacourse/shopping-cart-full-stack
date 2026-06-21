export type CouponId = number;

export interface CouponCondition {
  description: string | null;
}

export interface Coupon {
  couponId: CouponId;
  code: string;
  name: string;
  expirationDate: string;
  condition: CouponCondition;
  disabled: boolean;
  disabledReason: string | null;
}

export interface CouponList {
  coupons: Coupon[];
  recommendedCouponIds: CouponId[];
}
