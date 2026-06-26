import { describe, it, expect } from "vitest";
import { validateCoupon } from "../src/validator";
import { PreorderItem, Coupon } from "../src/types";

describe("쿠폰 유효성 검증기: validateCoupon", () => {
  const dummyItems: PreorderItem[] = [
    { productId: 1, name: "셔츠", price: 30000, thumbnailUrl: "", quantity: 2 },
  ];

  it("[금액 검증] 최소 주문 금액을 만족하지 못하면 false를 반환한다", () => {
    const limitCoupon: Coupon = {
      couponId: 1,
      name: "10만원 이상 결제 시 할인",
      type: "DISCOUNT",
      expirationDate: "",
      condition: { minOrderLimit: 100000 },
      benefit: { discountAmount: 5000 },
    };

    expect(validateCoupon(dummyItems, limitCoupon, new Date())).toBe(false);
  });

  it("[금액 검증] 최소 주문 금액을 만족하면 true를 반환한다", () => {
    const limitCoupon: Coupon = {
      couponId: 2,
      name: "5만원 이상 결제 시 무료배송",
      type: "FREESHIPPING",
      expirationDate: "",
      condition: { minOrderLimit: 50000 },
      benefit: {},
    };

    expect(validateCoupon(dummyItems, limitCoupon, new Date())).toBe(true);
  });

  it("[시간 검증] 타임세일 시간이 아니면 false를 반환한다", () => {
    const timeCoupon: Coupon = {
      couponId: 3,
      name: "새벽 타임세일",
      type: "TIMESALE",
      expirationDate: "",
      condition: { validTime: { startHour: 4, endHour: 7 } },
      benefit: { discountRate: 0.3 },
    };

    const invalidTime = new Date(2026, 5, 17, 14, 0, 0);
    expect(validateCoupon(dummyItems, timeCoupon, invalidTime)).toBe(false);

    const validTime = new Date(2026, 5, 17, 5, 30, 0);
    expect(validateCoupon(dummyItems, timeCoupon, validTime)).toBe(true);
  });

  it("[수량 검증] BOGO 쿠폰의 최소 구매 수량을 만족하는 단일 상품이 없으면 false를 반환한다", () => {
    const bogoCoupon: Coupon = {
      couponId: 4,
      name: "3+2 증정",
      type: "BOGO",
      expirationDate: "",
      condition: { minBogoQuantity: 3 },
      benefit: { bogoFreeQuantity: 2 },
    };

    expect(validateCoupon(dummyItems, bogoCoupon, new Date())).toBe(false);
  });

  it("[만료일 검증] 쿠폰의 만료일이 지났다면 false를 반환한다", () => {
    const expiredCoupon: Coupon = {
      couponId: 99,
      name: "만료된 쿠폰",
      type: "DISCOUNT",
      expirationDate: "2026-06-16",
      condition: {},
      benefit: { discountAmount: 1000 },
    };
    const validCoupon: Coupon = {
      couponId: 100,
      name: "만료안된 쿠폰",
      type: "DISCOUNT",
      expirationDate: "2099-12-31",
      condition: {},
      benefit: { discountAmount: 1000 },
    };

    const mockCurrentTime = new Date(2026, 5, 17, 0, 0, 0);

    expect(validateCoupon(dummyItems, expiredCoupon, mockCurrentTime)).toBe(false);
    expect(validateCoupon(dummyItems, validCoupon, mockCurrentTime)).toBe(true);
  });
});
