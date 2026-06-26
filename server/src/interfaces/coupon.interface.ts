export const COUPON_CATEGORY = {
  FIXED: "FIXED",
  RATE: "RATE",
  FREESHIPPING: "FREESHIPPING",
  BTGO: "BTGO",
} as const;

export type CouponCategory = (typeof COUPON_CATEGORY)[keyof typeof COUPON_CATEGORY];

export interface Coupon {
  id: number;
  couponCode: string;
  name: string;
  expiredDate: string;
  category: CouponCategory;
  amount?: number;
  rate?: number;
  minOrderAmount?: number;
  usableStartAt?: string;
  usableEndAt?: string;
}

export interface CouponResponse {
  couponId: number;
  name: string;
  expiredDate: string;
  minOrderAmount?: number;
  usableStartAt?: string;
  usableEndAt?: string;
  isSelected: boolean;
  disabled: boolean;
}
