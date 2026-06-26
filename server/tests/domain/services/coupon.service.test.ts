import {
  validateCouponCondition,
  calculateCouponDiscount,
  findBestCouponCombination,
  getValidCoupons,
  MAX_COUPON_COUNT,
} from "../../../src/services/coupon/index.js";
import { Coupon, COUPON_CATEGORY } from "../../../src/interfaces/coupon.interface.js";
import { PricedItem } from "../../../src/interfaces/checkout.interface.js";
import { AppError } from "../../../src/errors/AppError.js";
import { CouponModel } from "../../../src/models/index.js";
import { reset as resetCoupon } from "../../../src/repositories/coupon.repository.js";

function coupon(overrides: Partial<Coupon> & Pick<Coupon, "id" | "category">): Coupon {
  return {
    couponCode: `CODE${overrides.id}`,
    name: `쿠폰 ${overrides.id}`,
    expiredDate: "2099-12-31",
    ...overrides,
  };
}

const items: PricedItem[] = [{ productId: 1, price: 35000, quantity: 3 }]; // 105,000원, 수량 3

const FIXED = coupon({ id: 1, category: COUPON_CATEGORY.FIXED, amount: 5000 });
const BTGO = coupon({ id: 2, category: COUPON_CATEGORY.BTGO });
const FREESHIPPING = coupon({ id: 3, category: COUPON_CATEGORY.FREESHIPPING });
const RATE = coupon({ id: 4, category: COUPON_CATEGORY.RATE, rate: 10 });

describe("coupon.service", () => {
  describe("validateCouponCondition", () => {
    const now = new Date("2025-01-01T12:00:00");
    const base = { checkoutAmount: 100000, items, now };

    it("만료일이 지났으면 false다.", () => {
      const expired = coupon({ id: 1, category: COUPON_CATEGORY.FIXED, expiredDate: "2020-01-01" });
      expect(validateCouponCondition(expired, base)).toBe(false);
    });

    it("checkoutAmount가 min_order_amount보다 작으면 false다.", () => {
      const minOrder = coupon({ id: 1, category: COUPON_CATEGORY.FIXED, minOrderAmount: 100000 });
      expect(validateCouponCondition(minOrder, { ...base, checkoutAmount: 99999 })).toBe(false);
      expect(validateCouponCondition(minOrder, { ...base, checkoutAmount: 100000 })).toBe(true);
    });

    it("usable 시간 범위 밖이면 false다.", () => {
      const timed = coupon({ id: 1, category: COUPON_CATEGORY.RATE, usableStartAt: "04:00", usableEndAt: "07:00" });
      const morning = new Date("2025-01-01T05:00:00");
      const noon = new Date("2025-01-01T12:00:00");
      expect(validateCouponCondition(timed, { ...base, now: morning })).toBe(true);
      expect(validateCouponCondition(timed, { ...base, now: noon })).toBe(false);
    });

    it("BTGO는 같은 상품을 3개 이상 담은 종류가 하나도 없으면 false다.", () => {
      // 상품 A 2개 + 상품 B 1개: 각 3개 미만 → 사용 불가(수량을 합산하지 않는다)
      const split: PricedItem[] = [
        { productId: 1, price: 35000, quantity: 2 },
        { productId: 2, price: 25000, quantity: 1 },
      ];
      expect(validateCouponCondition(BTGO, { ...base, items: split })).toBe(false);
      // 상품 A 3개: 한 종류가 3개 이상 → 사용 가능
      expect(validateCouponCondition(BTGO, { ...base, items: [{ productId: 1, price: 35000, quantity: 3 }] })).toBe(
        true,
      );
    });

    it("모든 조건을 만족하면 true다.", () => {
      expect(validateCouponCondition(FIXED, base)).toBe(true);
    });
  });

  describe("calculateCouponDiscount", () => {
    it("FIXED는 amount만큼 할인한다.", () => {
      expect(calculateCouponDiscount([FIXED], { items, shippingFee: 0 })).toBe(5000);
    });

    it("BTGO는 같은 상품 3개당 1개를 그 상품 단가로 할인한다.", () => {
      // 상품 A 35,000 x3 → A 1개 무료 = 35,000
      expect(calculateCouponDiscount([BTGO], { items, shippingFee: 0 })).toBe(35000);
    });

    it("BTGO는 같은 상품 6개면 2개를 무료 처리한다.", () => {
      const six: PricedItem[] = [{ productId: 1, price: 35000, quantity: 6 }];
      expect(calculateCouponDiscount([BTGO], { items: six, shippingFee: 0 })).toBe(70000);
    });

    it("BTGO는 상품별로 따로 계산하며 서로 다른 상품 수량을 합산하지 않는다.", () => {
      // A 3개(→1개 무료 35,000) + B 2개(3개 미만 → 0). 합계 35,000
      const mixed: PricedItem[] = [
        { productId: 1, price: 35000, quantity: 3 },
        { productId: 2, price: 25000, quantity: 2 },
      ];
      expect(calculateCouponDiscount([BTGO], { items: mixed, shippingFee: 0 })).toBe(35000);
    });

    it("BTGO는 같은 상품이 3개 미만이면 0이다.", () => {
      const few: PricedItem[] = [{ productId: 1, price: 35000, quantity: 2 }];
      expect(calculateCouponDiscount([BTGO], { items: few, shippingFee: 0 })).toBe(0);
    });

    it("FREESHIPPING은 shippingFee만큼 할인한다.", () => {
      expect(calculateCouponDiscount([FREESHIPPING], { items, shippingFee: 3000 })).toBe(3000);
    });

    it("무료배송으로 shippingFee가 0이면 FREESHIPPING 할인액도 0이다.", () => {
      expect(calculateCouponDiscount([FREESHIPPING], { items, shippingFee: 0 })).toBe(0);
    });

    it("RATE는 BTGO/FIXED 적용 후 남은 상품 금액 기준으로 마지막에 적용한다.", () => {
      // 105,000 - FIXED 5,000 = 100,000 → 10% = 10,000. 합계 15,000
      expect(calculateCouponDiscount([FIXED, RATE], { items, shippingFee: 0 })).toBe(15000);
    });

    it("총 할인 금액은 checkoutAmount + shippingFee를 넘지 않는다.", () => {
      const huge = coupon({ id: 9, category: COUPON_CATEGORY.FIXED, amount: 999999 });
      expect(calculateCouponDiscount([huge], { items, shippingFee: 3000 })).toBe(105000 + 3000);
    });
  });

  describe("findBestCouponCombination", () => {
    const now = new Date("2025-01-01T12:00:00");

    it("MAX_COUPON_COUNT 이하 조합 중 할인이 가장 큰 조합을 반환한다.", () => {
      const best = findBestCouponCombination([FIXED, BTGO, FREESHIPPING], { items, shippingFee: 0, now });
      // FIXED(5000) + BTGO(35000) = 40000 이 최대
      expect(best.sort()).toEqual([FIXED.id, BTGO.id].sort());
    });

    it("BTGO는 수량이 부족하면(2개) 최적 조합에서 제외된다.", () => {
      const few: PricedItem[] = [{ productId: 1, price: 35000, quantity: 2 }]; // 70,000원, 수량 2
      const best = findBestCouponCombination([FIXED, BTGO], { items: few, shippingFee: 0, now });
      // FIXED는 minOrder 없음(테스트용)이라 선택, BTGO는 수량 미달로 제외
      expect(best).not.toContain(BTGO.id);
    });

    it("조건을 만족하는 쿠폰이 없으면 빈 배열을 반환한다.", () => {
      const expired = coupon({ id: 7, category: COUPON_CATEGORY.FIXED, amount: 5000, expiredDate: "2000-01-01" });
      expect(findBestCouponCombination([expired], { items, shippingFee: 0, now })).toEqual([]);
    });

    it("최대 개수를 넘는 조합은 선택하지 않는다.", () => {
      const best = findBestCouponCombination([FIXED, BTGO, RATE], { items, shippingFee: 0, now });
      expect(best.length).toBeLessThanOrEqual(MAX_COUPON_COUNT);
    });
  });

  describe("getValidCoupons", () => {
    const now = new Date("2099-01-01T12:00:00");
    const base = { checkoutAmount: 100000, items, now };

    beforeEach(async () => {
      await resetCoupon();
      await CouponModel.bulkCreate([
        { id: 1, couponCode: "FIXED", name: "정액", expiredDate: "2099-12-31", category: "FIXED", amount: 5000 },
        {
          id: 2,
          couponCode: "MIN",
          name: "최소금액",
          expiredDate: "2099-12-31",
          category: "FIXED",
          amount: 5000,
          minOrderAmount: 100000,
        },
        { id: 3, couponCode: "BTGO", name: "BTGO", expiredDate: "2099-12-31", category: "BTGO" },
      ]);
    });

    it("MAX_COUPON_COUNT를 초과하면 INVALID_COUPON_CONDITION을 던진다.", async () => {
      await expect(getValidCoupons([1, 2, 1], base)).rejects.toMatchObject({
        code: "INVALID_COUPON_CONDITION",
      });
    });

    it("존재하지 않는 쿠폰이면 COUPON_NOT_FOUND를 던진다.", async () => {
      await expect(getValidCoupons([9999], base)).rejects.toMatchObject({
        code: "COUPON_NOT_FOUND",
      });
    });

    it("조건을 만족하지 못하는 쿠폰이 있으면 INVALID_COUPON_CONDITION을 던진다.", async () => {
      await expect(getValidCoupons([2], { ...base, checkoutAmount: 50000 })).rejects.toMatchObject({
        code: "INVALID_COUPON_CONDITION",
      });
    });

    it("BTGO는 같은 상품 3개 이상인 종류가 없으면 INVALID_COUPON_CONDITION을 던진다.", async () => {
      const few: PricedItem[] = [{ productId: 1, price: 35000, quantity: 2 }];
      await expect(getValidCoupons([3], { ...base, items: few })).rejects.toMatchObject({
        code: "INVALID_COUPON_CONDITION",
      });
    });

    it("모든 검증을 통과하면 Coupon 목록을 반환한다.", async () => {
      const coupons = await getValidCoupons([1, 2], base);
      expect(coupons.map((c) => c.id).sort()).toEqual([1, 2]);
    });

    it("던지는 에러는 AppError 인스턴스다.", async () => {
      await expect(getValidCoupons([9999], base)).rejects.toThrow(AppError);
    });
  });
});
