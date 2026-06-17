import { Coupon } from "./Coupon";

const COUPONS: Coupon[] = [
  {
    couponId: 1,
    couponCode: "FIXED5000",
    expiredDate: "2026-11-30",
    minOrderAmount: 100000,
    discountAmount: 5000,
  },

  {
    couponId: 2,
    couponCode: "BTGO",
    expiredDate: "2026-06-30",
  },

  {
    couponId: 3,
    couponCode: "FREESHIPPING",
    expiredDate: "2026-08-31",
    minOrderAmount: 50000,
  },
  {
    couponId: 4,
    couponCode: "MIRACLESALE",
    expiredDate: "2026-07-31",
    usableStartAt: "4",
    usableEndAt: "7",
    discountRate: 30,
  },
];

export class CouponRepository {
  findAll(): Coupon[] {
    return COUPONS;
  }

  findById(couponId: number): Coupon | null {
    return COUPONS.find((c) => c.couponId === couponId) ?? null;
  }
}

export const couponRepository = new CouponRepository();
