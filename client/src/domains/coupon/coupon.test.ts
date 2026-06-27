import { describe, expect, it } from "vitest";
import { calculateTotalCouponDiscount } from "./coupon";

describe("쿠폰 할인 정책", () => {
  it("정액 쿠폰 금액을 할인한다.", () => {
    expect(
      calculateTotalCouponDiscount(
        [{ discountType: "FIXED", discountValue: 3000 }],
        10000,
      ),
    ).toBe(3000);
  });

  it("배송비 쿠폰 금액을 할인한다.", () => {
    expect(
      calculateTotalCouponDiscount(
        [{ discountType: "SHIPPING", discountValue: 2500 }],
        10000,
      ),
    ).toBe(2500);
  });

  it("정률 쿠폰은 현재 주문 금액을 기준으로 소수점을 버려 할인한다.", () => {
    expect(
      calculateTotalCouponDiscount(
        [{ discountType: "RATE", discountValue: 15 }],
        9999,
      ),
    ).toBe(1499);
  });

  it("정률 쿠폰은 정액 쿠폰 적용 후 남은 금액을 기준으로 계산한다.", () => {
    expect(
      calculateTotalCouponDiscount(
        [
          { discountType: "RATE", discountValue: 10 },
          { discountType: "FIXED", discountValue: 3000 },
        ],
        10000,
      ),
    ).toBe(3700);
  });

  it("배송비 쿠폰은 정률 쿠폰의 기준 금액을 줄이지 않는다.", () => {
    expect(
      calculateTotalCouponDiscount(
        [
          { discountType: "SHIPPING", discountValue: 2500 },
          { discountType: "RATE", discountValue: 10 },
        ],
        10000,
      ),
    ).toBe(3500);
  });
});
