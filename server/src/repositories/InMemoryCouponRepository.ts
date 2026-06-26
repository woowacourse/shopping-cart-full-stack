import { Coupon } from "@cart/shared";
import { CouponRepositoryInterface } from "./interfaces/CouponRepositoryInterface";

export default class InMemoryCouponRepository implements CouponRepositoryInterface {
  #coupons: Map<number, Coupon>;

  constructor() {
    this.#coupons = new Map();
  }

  getCoupons(): Coupon[] {
    return [...this.#coupons.values()];
  }

  findById(couponId: number): Coupon | null {
    return this.#coupons.get(couponId) ?? null;
  }

  addCoupon(coupon: Coupon): Coupon {
    this.#coupons.set(coupon.couponId, coupon);
    return coupon;
  }
}
