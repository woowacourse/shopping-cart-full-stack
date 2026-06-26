export interface Coupon {
  id: number;
  name: string;
  expiredDate?: Date;
  minOrderAmount?: number;
  usableStartAt?: string;
  usableEndAt?: string;
  isSelected: boolean;
  disabled: boolean;
}

const DEFAULT_COUPON_POLICY = {
  maxCouponCount: 2,
} as const;

export const getCouponPolicy = () => DEFAULT_COUPON_POLICY;
