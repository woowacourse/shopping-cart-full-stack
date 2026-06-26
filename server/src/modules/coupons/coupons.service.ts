import type { CouponsResponse } from "./coupons.dto.ts";
import * as couponsRepository from "./coupons.repository.ts";

export const getCoupons = (): CouponsResponse => {
  const coupons = couponsRepository.findAll();

  return {
    coupons: coupons.map((coupon) => {
      const responseCoupon = {
        id: coupon.id,
        code: coupon.code,
        name: coupon.name,
        expirationDate: coupon.expirationDate,
      };

      if ("minOrderAmount" in coupon.condition) {
        return {
          ...responseCoupon,
          minimumOrderAmount: coupon.condition.minOrderAmount,
        };
      }

      if ("validTime" in coupon.condition) {
        return {
          ...responseCoupon,
          validityPeriod: {
            startsAt: coupon.condition.validTime.start,
            endsAt: coupon.condition.validTime.end,
          },
        };
      }

      return responseCoupon;
    }),
  };
};
