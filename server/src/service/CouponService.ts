import { Coupon } from "@cart/shared";
import { CouponRepositoryInterface } from "../repositories/interfaces/CouponRepositoryInterface";

export default class CouponService {
  #couponRepo: CouponRepositoryInterface;

  constructor(couponRepo: CouponRepositoryInterface) {
    this.#couponRepo = couponRepo;
  }

  getCoupons(): Coupon[] {
    return this.#couponRepo.getCoupons();
  }
}
