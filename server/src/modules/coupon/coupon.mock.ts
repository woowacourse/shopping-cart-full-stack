import { CouponItem } from "./Coupon.js";

export const mockCouponData: Omit<CouponItem, "id">[] = [
  {
    baseInformation: {
      name: "5,000원 할인 쿠폰",
      type: "FIXED5000",
      expiryDate: new Date("2026-11-30T23:59:59"),
    },
    discountPolicy: {
      fixedDiscountPrice: 5000,
      fixedDiscountRate: null,
    },
    condition: {
      minAmount: 100000,
      startTime: null,
      endTime: null,
    },
  },
  {
    baseInformation: {
      name: "2+1 쿠폰",
      type: "BOGO",
      expiryDate: new Date("2026-06-30T23:59:59"),
    },
    discountPolicy: {
      fixedDiscountPrice: null,
      fixedDiscountRate: null,
    },
    condition: {
      minAmount: null,
      startTime: null,
      endTime: null,
    },
  },
  {
    baseInformation: {
      name: "무료 배송 쿠폰",
      type: "FREESHIPPING",
      expiryDate: new Date("2026-08-31T23:59:59"),
    },
    discountPolicy: {
      fixedDiscountPrice: null,
      fixedDiscountRate: null,
    },
    condition: {
      minAmount: 50000,
      startTime: null,
      endTime: null,
    },
  },
  {
    baseInformation: {
      name: "30% 시간제 할인 쿠폰",
      type: "MIRACLESALE",
      expiryDate: new Date("2026-07-31T23:59:59"),
    },
    discountPolicy: {
      fixedDiscountPrice: null,
      fixedDiscountRate: 30,
    },
    condition: {
      minAmount: null,
      startTime: "04:00",
      endTime: "07:00",
    },
  },
];
