import { Coupon } from "@cart/shared";

export interface CouponRepositoryInterface {
  getCoupons(): Coupon[];
  findById(couponId: number): Coupon | null;
  addCoupon(coupon: Coupon): Coupon;
}
