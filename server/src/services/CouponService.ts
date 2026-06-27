import type { CouponRepository } from "../repositories/CouponRepository.js";
import { conditionTextOf } from "./order/couponPolicy.js";

export interface CouponServiceDeps {
  couponRepository: CouponRepository;
}

export const createCouponService = ({
  couponRepository,
}: CouponServiceDeps) => ({
  async getCoupons() {
    const coupons = await couponRepository.findAll();
    return coupons.map((coupon) => ({
      ...coupon.toJSON(),
      description: conditionTextOf(coupon.type),
    }));
  },
});

export type CouponService = ReturnType<typeof createCouponService>;
