export type CouponId = number;

export interface Coupon {
  couponId: CouponId;
  code: string;
  name: string;
  expirationDate: string;
  disabled: boolean;
  disabledReason: string | null;
}
