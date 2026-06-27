interface BasedCoupon {
  id: number;
  name: string;
  description: string[];
  expiredAt: Date;
  isUsed: boolean;
}

export interface FixedCoupon extends BasedCoupon {
  couponType: "FIXED";
  minimumOrderPrice: number;
  fixedAmount: number;
}

export interface RateCoupon extends BasedCoupon {
  couponType: "RATE";
  startedAt: string;
  endedAt: string;
  rateAmount: number;
}

export interface BogoCoupon extends BasedCoupon {
  couponType: "BOGO";
}

export interface FreeShippingCoupon extends BasedCoupon {
  couponType: "FREESHIPPING";
  minimumOrderPrice: number;
}

export type CouponEntity = FixedCoupon | RateCoupon | BogoCoupon | FreeShippingCoupon;

export interface CouponResponse {
  id: number;
  name: string;
  description: string[];
  discountType: "FIXED" | "RATE" | "SHIPPING";
  isUsable: boolean;
  discountValue: number;
}
