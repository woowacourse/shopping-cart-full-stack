import type { Coupon } from "@cart/shared";

export interface CouponApiInterface {
  getCoupons(): Promise<Coupon[]>;
}
