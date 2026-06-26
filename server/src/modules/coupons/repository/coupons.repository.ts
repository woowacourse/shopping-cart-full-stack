import { CouponDB } from "../types";

export interface CouponRepository {
  getCoupons(): CouponDB[];
  getCouponById(couponId: string): CouponDB | null;
}

export class InMemoryCouponRepository implements CouponRepository {
  private couponDB = new Map<string, CouponDB>();

  constructor() {
    const seedCoupons: CouponDB[] = [
      {
        couponId: "FIXED5000",
        couponName: "5,000원 할인 쿠폰",
        isDisabled: false,
        couponExpiration: new Date("2026-11-30T23:59:59").getTime(),
        discountInfo: {
          type: "fixed",
          value: 5000,
          minimumOrderPrice: 100000,
          duration: {
            startDate: 0,
            endDate: 24,
          },
        },
      },
      {
        couponId: "BOGO",
        couponName: "2+1 쿠폰",
        isDisabled: false,
        couponExpiration: new Date("2026-06-30T23:59:59").getTime(),
        discountInfo: {
          type: "bogo",
          target: "max",
          requireAmount: 2,
          minimumOrderPrice: 0,
          duration: {
            startDate: 0,
            endDate: 24,
          },
        },
      },
      {
        couponId: "FREESHIPPING",
        couponName: "무료 배송 쿠폰",
        isDisabled: false,
        couponExpiration: new Date("2026-08-31T23:59:59").getTime(),
        discountInfo: {
          type: "freeShipping",
          minimumOrderPrice: 50000,
          duration: {
            startDate: 0,
            endDate: 24,
          },
        },
      },
      {
        couponId: "MIRACLESALE",
        couponName: "30% 시간제 할인 쿠폰",
        isDisabled: false,
        couponExpiration: new Date("2026-07-31T23:59:59").getTime(),
        discountInfo: {
          type: "percentage",
          value: 30,
          minimumOrderPrice: 0,
          duration: {
            startDate: 4,
            endDate: 7,
          },
        },
      },
    ];

    seedCoupons.forEach((coupon) =>
      this.couponDB.set(coupon.couponId, coupon),
    );
  }

  getCoupons(): CouponDB[] {
    return [...this.couponDB.values()];
  }

  getCouponById(couponId: string): CouponDB | null {
    return this.couponDB.get(couponId) ?? null;
  }
}
