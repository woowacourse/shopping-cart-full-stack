import { describe, expect, test } from "@jest/globals";
import FixedAmountCoupon from "../../src/domain/coupon/FixedAmountCoupon";
import BogoCoupon from "../../src/domain/coupon/BogoCoupon";
import FreeShippingCoupon from "../../src/domain/coupon/FreeShippingCoupon";
import PercentCoupon from "../../src/domain/coupon/PercentCoupon";
import type { CouponContext } from "../../src/domain/coupon/Coupon";
import {
  calculateOrder,
  getMaxDiscountCoupons,
  getOrderAmount,
  getShippingFee,
} from "../../src/domain/coupon/calculateDiscount";
import type { CalculationItem } from "../../src/types/type";

const NOW = new Date("2026-06-18T05:00:00");

const fixed5000 = () =>
  new FixedAmountCoupon(
    {
      id: 1,
      name: "5,000원",
      type: "FIXED5000",
      expiryDate: "2026-11-30",
      minAmount: 100_000,
    },
    5_000,
  );
const bogo = () =>
  new BogoCoupon({
    id: 2,
    name: "2+1",
    type: "BOGO",
    expiryDate: "2026-06-30",
  });
const freeShipping = () =>
  new FreeShippingCoupon({
    id: 3,
    name: "무료배송",
    type: "FREESHIPPING",
    expiryDate: "2026-08-31",
    minAmount: 50_000,
  });
const miracle = () =>
  new PercentCoupon(
    {
      id: 4,
      name: "30%",
      type: "MIRACLESALE",
      expiryDate: "2026-07-31",
      startTime: "04:00",
      endTime: "07:00",
    },
    0.3,
  );

const context = (overrides: Partial<CouponContext> = {}): CouponContext => ({
  items: [],
  orderAmount: 0,
  currentAmount: 0,
  shippingFee: 0,
  now: NOW,
  ...overrides,
});

describe("쿠폰 도메인 - 할인 금액", () => {
  test("정액 쿠폰은 정해진 금액을 깎되, 남은 금액을 넘지 않는다.", () => {
    expect(fixed5000().discount(context({ currentAmount: 120_000 }))).toBe(
      5_000,
    );
    expect(fixed5000().discount(context({ currentAmount: 3_000 }))).toBe(3_000);
  });

  test("2+1 쿠폰은 3개 이상 담은 상품 중 단가가 가장 높은 상품 1개 값을 깎는다.", () => {
    const items: CalculationItem[] = [
      { price: 50_000, quantity: 2 },
      { price: 35_000, quantity: 3 },
      { price: 25_000, quantity: 4 },
    ];
    expect(bogo().discount(context({ items }))).toBe(35_000);
  });

  test("2+1 쿠폰은 3개 이상 담은 상품이 없으면 0원을 깎는다.", () => {
    const items: CalculationItem[] = [{ price: 35_000, quantity: 2 }];
    expect(bogo().discount(context({ items }))).toBe(0);
  });

  test("무료 배송 쿠폰은 배송비 전액을 깎는다.", () => {
    expect(freeShipping().discount(context({ shippingFee: 6_000 }))).toBe(
      6_000,
    );
  });

  test("정율 쿠폰은 현재 금액의 비율만큼 깎는다.(원 단위 내림)", () => {
    expect(miracle().discount(context({ currentAmount: 70_001 }))).toBe(21_000);
  });
});

describe("쿠폰 도메인 - 사용 가능 여부", () => {
  test("최소 주문 금액을 넘지 못하면 사용할 수 없다.", () => {
    expect(fixed5000().isAvailable(context({ orderAmount: 99_999 }))).toBe(
      false,
    );
    expect(fixed5000().isAvailable(context({ orderAmount: 100_000 }))).toBe(
      true,
    );
  });

  test("미라클세일은 사용 가능 시간대 밖이면 사용할 수 없다.", () => {
    const outOfTime = new Date("2026-06-18T08:00:00");
    expect(miracle().isAvailable(context({ now: outOfTime }))).toBe(false);
    expect(miracle().isAvailable(context({ now: NOW }))).toBe(true);
  });

  test("만료일이 지나면 사용할 수 없다.", () => {
    const expired = new Date("2026-07-01T05:00:00");
    expect(bogo().isExpired(expired)).toBe(true);
    expect(bogo().isExpired(NOW)).toBe(false);
  });

  test("무료 배송 쿠폰은 깎을 배송비가 있을 때만 사용할 수 있다.", () => {
    const base = { orderAmount: 60_000 }; // 최소 주문 금액(50,000) 충족
    expect(
      freeShipping().isAvailable(context({ ...base, shippingFee: 3_000 })),
    ).toBe(true);
    expect(
      freeShipping().isAvailable(context({ ...base, shippingFee: 0 })),
    ).toBe(false);
  });
});

describe("주문 금액 계산", () => {
  const items: CalculationItem[] = [
    { price: 35_000, quantity: 2 },
    { price: 25_000, quantity: 2 },
  ];

  test("주문 금액은 단가 x 수량의 합이다.", () => {
    expect(getOrderAmount(items)).toBe(120_000);
  });

  test("10만원 이상이면 기본 배송비가 무료다.", () => {
    expect(getShippingFee(120_000, false)).toBe(0);
    expect(getShippingFee(99_999, false)).toBe(3_000);
  });

  test("도서산간 지역이면 추가 배송비가 더해진다.", () => {
    expect(getShippingFee(99_999, true)).toBe(6_000);
    expect(getShippingFee(120_000, true)).toBe(3_000);
  });

  test("쿠폰이 없으면 주문 금액과 배송비만 반영된다.", () => {
    const result = calculateOrder(items, [], false, NOW);
    expect(result).toEqual({
      orderAmount: 120_000,
      discountAmount: 0,
      shippingFee: 0,
      totalPayment: 120_000,
    });
  });

  test("정액 쿠폰을 먼저, 정율 쿠폰을 나중에 적용한다.", () => {
    const result = calculateOrder(items, [fixed5000(), miracle()], false, NOW);
    expect(result.discountAmount).toBe(5_000 + 34_500);
    expect(result.totalPayment).toBe(80_500);
  });

  test("무료 배송 쿠폰은 도서산간 추가 배송비까지 무료로 만든다.", () => {
    const cheapItems: CalculationItem[] = [{ price: 60_000, quantity: 1 }];
    const result = calculateOrder(cheapItems, [freeShipping()], true, NOW);
    expect(result.shippingFee).toBe(0);
    expect(result.totalPayment).toBe(60_000);
  });

  test("사용 불가능한 쿠폰은 계산에서 무시된다.", () => {
    const cheapItems: CalculationItem[] = [{ price: 50_000, quantity: 1 }];
    const result = calculateOrder(cheapItems, [fixed5000()], false, NOW);
    expect(result.discountAmount).toBe(0);
  });
});

describe("최대 할인 쿠폰 자동 적용", () => {
  test("할인 효과가 가장 큰 조합을 고른다.", () => {
    const items: CalculationItem[] = [
      { price: 35_000, quantity: 3 },
      { price: 25_000, quantity: 2 },
    ];
    const best = getMaxDiscountCoupons(
      items,
      [fixed5000(), bogo(), miracle()],
      false,
      NOW,
    );
    const types = best.map((coupon) => coupon.type).sort();
    expect(types).toEqual(["BOGO", "MIRACLESALE"]);
  });
});
