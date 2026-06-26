export interface Coupon {
  couponId: string;
  couponName: string;
  isDisabled: boolean;
  couponExpiration: number;
  option?: string;
}
