import { jest } from "@jest/globals";
import FixedCoupon from "../../src/features/coupon/coupons/fixed-coupon.js";
import BogoCoupon from "../../src/features/coupon/coupons/bogo-coupon.js";
import MiracleSaleCoupon from "../../src/features/coupon/coupons/miracle-sale-coupon.js";
import { type CouponEntity } from "../../src/features/coupon/coupon.entity.js";
import { type CouponProps } from "../../src/features/coupon/coupon.type.js";

// 시간/만료 의존 로직을 결정적으로 만들기 위해 현재 시각을 고정 (로컬 05:00)
beforeAll(() => jest.useFakeTimers().setSystemTime(new Date("2099-06-01T05:00:00")));
afterAll(() => jest.useRealTimers());

const FUTURE = new Date("2099-12-31");
const PAST = new Date("2000-01-01");

type CartItem = { productId: string; quantity: number; price: number };

const props = (orderPrice: number, cart: CartItem[] = []): CouponProps => ({
  checkoutCartList: cart,
  summary: { orderPrice, discountPrice: 0, deliveryPrice: 0, totalPrice: orderPrice },
  gifts: [],
});

const entity = (overrides: Partial<CouponEntity>): CouponEntity => ({
  id: "COUPON",
  name: "쿠폰",
  expiriation_date: FUTURE,
  rule_type: null,
  limit_price: null,
  start_time: null,
  end_time: null,
  discount_type: "FIXED",
  discount_fixed: null,
  discount_rate: null,
  ...overrides,
});

describe("FixedCoupon", () => {
  const fixed = (overrides: Partial<CouponEntity> = {}) =>
    FixedCoupon.from(
      entity({ discount_type: "FIXED", limit_price: 100000, discount_fixed: 5000, ...overrides }),
    );

  it("주문금액이 최소금액 이상이면 사용 가능하다", () => {
    expect(fixed().canUse(props(100000)).type).toBe("USABLE");
  });

  it("주문금액이 최소금액 미만이면 사용 불가하다", () => {
    expect(fixed().canUse(props(99999)).type).toBe("UNUSABLE");
  });

  it("만료된 쿠폰은 사용 불가하다", () => {
    expect(fixed({ expiriation_date: PAST }).canUse(props(100000)).type).toBe("UNUSABLE");
  });

  it("할인액만큼 discountPrice가 늘고 totalPrice가 줄어든다", () => {
    const { summary } = fixed().execute(props(100000));
    expect(summary.discountPrice).toBe(5000);
    expect(summary.totalPrice).toBe(95000);
  });
});

describe("BogoCoupon", () => {
  const bogo = (overrides: Partial<CouponEntity> = {}) =>
    BogoCoupon.from(entity({ discount_type: "BOGO", ...overrides }));

  it("동일 상품을 2개 이상 담으면 사용 가능하다", () => {
    const cart = [{ productId: "1", quantity: 2, price: 1000 }];
    expect(bogo().canUse(props(2000, cart)).type).toBe("USABLE");
  });

  it("모든 상품 수량이 1이면 사용 불가하다", () => {
    const cart = [{ productId: "1", quantity: 1, price: 1000 }];
    expect(bogo().canUse(props(1000, cart)).type).toBe("UNUSABLE");
  });

  it("기준 수량 이상 상품 중 단가가 가장 높은 상품 1개를 사은품으로 지급한다", () => {
    const cart = [
      { productId: "1", quantity: 2, price: 1000 },
      { productId: "2", quantity: 2, price: 3000 },
    ];
    const result = bogo().execute(props(8000, cart));

    // 2+1은 금액 할인이 아니라 사은품 지급이므로 결제 금액은 그대로다
    expect(result.summary.discountPrice).toBe(0);
    expect(result.gifts).toContainEqual({ productId: "2", quantity: 1 });
  });
});

describe("MiracleSaleCoupon", () => {
  const miracle = (overrides: Partial<CouponEntity> = {}) =>
    MiracleSaleCoupon.from(
      entity({
        discount_type: "MIRACLESALE",
        rule_type: "TIME",
        start_time: "04:00",
        end_time: "07:00",
        discount_rate: 30,
        ...overrides,
      }),
    );

  it("현재 시각이 사용 가능 시간대(04:00~07:00)면 사용 가능하다", () => {
    expect(miracle().canUse().type).toBe("USABLE"); // 고정 시각 05:00
  });

  it("현재 시각이 시간대 밖이면 사용 불가하다", () => {
    expect(miracle({ start_time: "06:00", end_time: "07:00" }).canUse().type).toBe("UNUSABLE");
  });

  it("주문금액의 할인율(%)만큼 할인한다", () => {
    const { summary } = miracle().execute(props(10000));
    expect(summary.discountPrice).toBe(3000); // 10000 * 30%
  });
});
