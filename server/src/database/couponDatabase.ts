import { CouponRepository } from "./CouponRepository.ts";
import FixedAmountCoupon from "../domain/coupon/FixedAmountCoupon.ts";
import BogoCoupon from "../domain/coupon/BogoCoupon.ts";
import FreeShippingCoupon from "../domain/coupon/FreeShippingCoupon.ts";
import PercentCoupon from "../domain/coupon/PercentCoupon.ts";

export const couponRepository = new CouponRepository();

function seedCoupons() {
  couponRepository.save(
    new FixedAmountCoupon(
      {
        id: 1,
        name: "5,000원 할인 쿠폰",
        type: "FIXED5000",
        expiryDate: "2026-11-30",
        minAmount: 100_000,
      },
      5_000,
    ),
  );

  couponRepository.save(
    new BogoCoupon({
      id: 2,
      name: "2+1 쿠폰",
      type: "BOGO",
      expiryDate: "2026-06-30",
    }),
  );

  couponRepository.save(
    new FreeShippingCoupon({
      id: 3,
      name: "무료 배송 쿠폰",
      type: "FREESHIPPING",
      expiryDate: "2026-08-31",
      minAmount: 50_000,
    }),
  );

  couponRepository.save(
    new PercentCoupon(
      {
        id: 4,
        name: "30% 시간제 할인 쿠폰",
        type: "MIRACLESALE",
        expiryDate: "2026-07-31",
        startTime: "04:00",
        endTime: "07:00",
      },
      0.3,
    ),
  );
}

seedCoupons();
