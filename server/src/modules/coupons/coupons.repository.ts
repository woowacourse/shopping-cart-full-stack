import { Coupon } from "./coupons.model.ts";
import type { CouponCondition } from "./coupons.model.ts";
import { couponStore } from "../../raw/raw.coupons.ts";

export const findAll = () => {
  const coupons = couponStore.coupons;

  return coupons.map(
    (coupon) =>
      new Coupon({
        id: coupon.id,
        code: coupon.code,
        name: coupon.name,
        expirationDate: coupon.expirationDate,
        discount: coupon.discount,
        condition: coupon.condition as CouponCondition,
      }),
  );
};
