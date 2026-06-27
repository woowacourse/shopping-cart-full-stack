import type { CartItem, Coupon } from "@/type";
import { calculateFinalAmount, findBogoGiftProductId, isCouponUsable, selectTopTwoCoupons } from "./orders.domain";

const FIXED5000: Coupon = {
  id: 1,
  code: "FIXED5000",
  title: "5,000원 할인 쿠폰",
  discountType: "fixed",
  discountValue: 5_000,
  minimumAmount: 100_000,
  expirationDate: "2026-11-30",
};

const BOGO: Coupon = {
  id: 2,
  code: "BOGO",
  title: "2+1 쿠폰",
  discountType: "buyXgetY",
  discountValue: 0,
  expirationDate: "2026-06-30",
};

const FREESHIPPING: Coupon = {
  id: 3,
  code: "FREESHIPPING",
  title: "무료 배송 쿠폰",
  discountType: "freeShipping",
  discountValue: 0,
  minimumAmount: 50_000,
  expirationDate: "2026-08-31",
};

const MIRACLESALE: Coupon = {
  id: 4,
  code: "MIRACLESALE",
  title: "30% 시간제 할인 쿠폰",
  discountType: "percentage",
  discountValue: 30,
  expirationDate: "2026-07-31",
  availableTime: { start: "04:00", end: "07:00" },
};

const makeCartItem = (
  id: number,
  price: number,
  quantity: number,
): CartItem => ({
  product: { id, name: `상품${id}`, price, image: "" },
  quantity,
});

const DELIVERY_FEE = 3_000;

describe("calculateFinalAmount", () => {
  it("쿠폰이 없으면 orderTotal + deliveryFee를 반환한다.", () => {
    const cartItems = [makeCartItem(1, 50_000, 1)];
    expect(calculateFinalAmount([], cartItems, 50_000, DELIVERY_FEE)).toBe(53_000);
  });

  it("정액 쿠폰 적용 시 할인 금액을 차감한다.", () => {
    const cartItems = [makeCartItem(1, 100_000, 1)];
    // 100,000 - 5,000 + 3,000 = 98,000
    expect(calculateFinalAmount([FIXED5000], cartItems, 100_000, DELIVERY_FEE)).toBe(98_000);
  });

  it("무료 배송 쿠폰 적용 시 배송비가 0원이 된다.", () => {
    const cartItems = [makeCartItem(1, 50_000, 1)];
    // 50,000 + 3,000 - 3,000 = 50,000
    expect(calculateFinalAmount([FREESHIPPING], cartItems, 50_000, DELIVERY_FEE)).toBe(50_000);
  });

  it("정액 + 무료 배송 쿠폰 동시 적용 시 둘 다 차감된다.", () => {
    const cartItems = [makeCartItem(1, 100_000, 1)];
    // 100,000 - 5,000 + 3,000 - 3,000 = 95,000
    expect(
      calculateFinalAmount([FIXED5000, FREESHIPPING], cartItems, 100_000, DELIVERY_FEE),
    ).toBe(95_000);
  });
});

describe("findBogoGiftProductId", () => {
  it("수량 2개 이상인 상품이 없으면 null을 반환한다.", () => {
    const cartItems = [makeCartItem(1, 50_000, 1)];
    expect(findBogoGiftProductId(cartItems)).toBeNull();
  });

  it("수량 2개 이상인 상품 중 단가가 가장 높은 상품 ID를 반환한다.", () => {
    const cartItems = [makeCartItem(1, 20_000, 2), makeCartItem(2, 30_000, 2)];
    expect(findBogoGiftProductId(cartItems)).toBe(2);
  });

  it("수량 1개인 상품은 대상에서 제외된다.", () => {
    const cartItems = [makeCartItem(1, 50_000, 1), makeCartItem(2, 20_000, 2)];
    expect(findBogoGiftProductId(cartItems)).toBe(2);
  });
});

describe("isCouponUsable", () => {
  const orderTotal = 100_000;
  const cartItems = [makeCartItem(1, 50_000, 1)];
  const cartItemsWithBogo = [makeCartItem(1, 50_000, 2)];

  it("만료일이 지난 쿠폰은 사용 불가하다.", () => {
    const expired: Coupon = { ...FIXED5000, expirationDate: "2024-01-01" };
    expect(isCouponUsable(expired, cartItems, orderTotal, new Date("2025-01-01"))).toBe(false);
  });

  it("만료일이 오늘인 쿠폰은 사용 가능하다.", () => {
    const today = new Date("2026-06-30T12:00:00");
    const coupon: Coupon = { ...FIXED5000, expirationDate: "2026-06-30" };
    expect(isCouponUsable(coupon, cartItems, orderTotal, today)).toBe(true);
  });

  it("최소 주문 금액 미달이면 사용 불가하다.", () => {
    const coupon: Coupon = { ...FIXED5000, minimumAmount: 200_000, expirationDate: "2099-12-31" };
    expect(isCouponUsable(coupon, cartItems, 100_000, new Date())).toBe(false);
  });

  it("최소 주문 금액 이상이면 사용 가능하다.", () => {
    const coupon: Coupon = { ...FIXED5000, minimumAmount: 50_000, expirationDate: "2099-12-31" };
    expect(isCouponUsable(coupon, cartItems, 100_000, new Date())).toBe(true);
  });

  it("사용 가능 시간이 아니면 사용 불가하다.", () => {
    const coupon: Coupon = { ...MIRACLESALE, expirationDate: "2099-12-31" };
    expect(isCouponUsable(coupon, cartItems, orderTotal, new Date("2026-07-01T12:00:00"))).toBe(false);
  });

  it("사용 가능 시간이면 사용 가능하다.", () => {
    const coupon: Coupon = { ...MIRACLESALE, expirationDate: "2099-12-31" };
    expect(isCouponUsable(coupon, cartItems, orderTotal, new Date("2026-07-01T05:00:00"))).toBe(true);
  });

  it("BOGO: 수량 2개 이상인 상품이 없으면 사용 불가하다.", () => {
    const coupon: Coupon = { ...BOGO, expirationDate: "2099-12-31" };
    expect(isCouponUsable(coupon, cartItems, orderTotal, new Date())).toBe(false);
  });

  it("BOGO: 수량 2개 이상인 상품이 있으면 사용 가능하다.", () => {
    const coupon: Coupon = { ...BOGO, expirationDate: "2099-12-31" };
    expect(isCouponUsable(coupon, cartItemsWithBogo, orderTotal, new Date())).toBe(true);
  });
});

describe("selectTopTwoCoupons", () => {
  describe("쿠폰 개수", () => {
    it("쿠폰이 없으면 빈 배열을 반환한다.", () => {
      expect(selectTopTwoCoupons([], [], 0, DELIVERY_FEE)).toEqual([]);
    });

    it("쿠폰이 2개 이하이면 전부 반환한다.", () => {
      const cartItems = [makeCartItem(1, 50_000, 1)];
      const coupons = [FREESHIPPING, MIRACLESALE];

      expect(
        selectTopTwoCoupons(
          coupons,
          cartItems,
          50_000,
          DELIVERY_FEE,
          new Date("2026-07-01T12:00:00"), // MIRACLESALE 비적용 시간 → FREESHIPPING이 1위
        ),
      ).toEqual([FREESHIPPING, MIRACLESALE]);
    });
  });

  describe("fixed 쿠폰 (FIXED5000)", () => {
    it("주문 금액이 최소 주문 금액 이상이면 고정 할인 금액을 적용한다.", () => {
      const cartItems = [makeCartItem(1, 100_000, 1)];
      // FIXED5000: 5000원, FREESHIPPING: 3000원, MIRACLESALE: 30% of 100,000 = 30,000원
      const result = selectTopTwoCoupons(
        [FIXED5000, FREESHIPPING, MIRACLESALE],
        cartItems,
        100_000,
        DELIVERY_FEE,
        new Date("2026-07-01T05:00:00"), // MIRACLESALE 적용 시간
      );

      expect(result).toEqual([MIRACLESALE, FIXED5000]);
    });
  });

  describe("buyXgetY 쿠폰 (BOGO)", () => {
    it("동일 상품 2개 이상 구매 시 단가가 가장 높은 상품 1개를 무료로 적용한다.", () => {
      // BOGO: 20,000원 (단가 20,000 x 1개), FREESHIPPING: 3,000원
      const cartItems = [
        makeCartItem(1, 20_000, 2),
        makeCartItem(2, 10_000, 2),
      ];

      const result = selectTopTwoCoupons(
        [BOGO, FREESHIPPING],
        cartItems,
        60_000,
        DELIVERY_FEE,
      );

      expect(result).toEqual([BOGO, FREESHIPPING]);
    });

    it("수량이 2개 미만인 상품만 있으면 BOGO 할인은 0원이다.", () => {
      // BOGO: 0원, FREESHIPPING: 3,000원
      const cartItems = [makeCartItem(1, 50_000, 1)];

      const result = selectTopTwoCoupons(
        [BOGO, FREESHIPPING],
        cartItems,
        50_000,
        DELIVERY_FEE,
      );

      expect(result).toEqual([FREESHIPPING, BOGO]);
    });
  });

  describe("freeShipping 쿠폰 (FREESHIPPING)", () => {
    it("배송비만큼 할인한다.", () => {
      // FREESHIPPING: 3,000원, FIXED5000: 최소금액 미달이라 0원
      const cartItems = [makeCartItem(1, 50_000, 1)];

      const result = selectTopTwoCoupons(
        [FIXED5000, FREESHIPPING],
        cartItems,
        50_000,
        DELIVERY_FEE,
      );

      expect(result).toEqual([FREESHIPPING, FIXED5000]);
    });
  });

  describe("percentage 쿠폰 (MIRACLESALE)", () => {
    it("사용 가능 시간이면 주문 금액에 할인율을 적용한다.", () => {
      // MIRACLESALE: 30% of 50,000 = 15,000원, FREESHIPPING: 3,000원
      const cartItems = [makeCartItem(1, 50_000, 1)];

      const result = selectTopTwoCoupons(
        [MIRACLESALE, FREESHIPPING],
        cartItems,
        50_000,
        DELIVERY_FEE,
        new Date("2026-07-01T05:00:00"), // 오전 5시
      );

      expect(result).toEqual([MIRACLESALE, FREESHIPPING]);
    });

    it("사용 가능 시간이 아니면 MIRACLESALE 할인은 0원이다.", () => {
      // MIRACLESALE: 0원 (오전 4~7시 외), FREESHIPPING: 3,000원
      const cartItems = [makeCartItem(1, 50_000, 1)];

      const result = selectTopTwoCoupons(
        [MIRACLESALE, FREESHIPPING],
        cartItems,
        50_000,
        DELIVERY_FEE,
        new Date("2026-07-01T12:00:00"), // 낮 12시
      );

      expect(result).toEqual([FREESHIPPING, MIRACLESALE]);
    });
  });
});
