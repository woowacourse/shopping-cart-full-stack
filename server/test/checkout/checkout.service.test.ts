import CheckoutService from "../../src/features/checkout/checkout.service.js";
import CartService from "../../src/features/cart/cart.service.js";
import InMemoryCartRepository from "../../src/features/cart/cart.repository.js";
import InMemoryCouponRepository from "../../src/features/coupon/coupon.repository.js";
import { type InMemoryDB } from "../../src/db/in-memory-db.js";
import { type CouponEntity } from "../../src/features/coupon/coupon.entity.js";

const FUTURE = new Date("2099-12-31");

const coupon = (overrides: Partial<CouponEntity>): CouponEntity => ({
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

// 상품 1: 30,000원 x 2개, 상품 2: 20,000원 x 1개 -> 주문금액 80,000원
const createService = (coupons: CouponEntity[]) => {
  const db: InMemoryDB = {
    PRODUCT_TABLE: [
      { id: 1, name: "A", price: 30000, imgUrl: "" },
      { id: 2, name: "B", price: 20000, imgUrl: "" },
    ],
    CART_TABLE: [
      { product_id: 1, quantity: 2 },
      { product_id: 2, quantity: 1 },
    ],
    COUPON_TABLE: coupons,
  };
  const cartService = new CartService(new InMemoryCartRepository(db));
  return new CheckoutService(cartService, new InMemoryCouponRepository(db));
};

const FIXED = coupon({ id: "FIX", discount_type: "FIXED", limit_price: 50000, discount_fixed: 5000 });
const BOGO = coupon({ id: "BOGO", discount_type: "BOGO" });

describe("CheckoutService.checkout", () => {
  it("선택한 사용 가능 쿠폰만 apply=true 로 표시하고 할인에 반영한다", async () => {
    const service = createService([FIXED, BOGO]);

    const result = await service.checkout({
      checkedProductIds: ["1", "2"],
      hardDeliveryPlace: false,
      selectedCouponIds: ["FIX"],
    });

    const status = (id: string) => result.coupons.find((c) => c.coupon.id === id)!.status;
    expect(status("FIX").apply).toBe(true);
    expect(status("BOGO").apply).toBe(false); // 선택 안 함
    expect(result.summary.discountPrice).toBe(5000);
  });

  it("BOGO 적용 시 결제금액은 그대로지만 사은품을 응답에 내려준다", async () => {
    const service = createService([BOGO]);

    const result = await service.checkout({
      checkedProductIds: ["1", "2"],
      hardDeliveryPlace: false,
      selectedCouponIds: ["BOGO"],
    });

    expect(result.summary.discountPrice).toBe(0); // 증정이라 결제금액 변화 없음
    expect(result.gifts).toEqual([{ productId: "1", quantity: 1 }]); // 단가 높은 상품(1) 1개 증정
  });

  it("최소금액 미달 쿠폰은 선택해도 적용되지 않는다", async () => {
    const highMin = coupon({
      id: "HIGH",
      discount_type: "FIXED",
      limit_price: 1000000,
      discount_fixed: 5000,
    });
    const service = createService([highMin]);

    const result = await service.checkout({
      checkedProductIds: ["1", "2"],
      hardDeliveryPlace: false,
      selectedCouponIds: ["HIGH"],
    });

    expect(result.coupons[0].status.type).toBe("UNUSABLE");
    expect(result.coupons[0].status.apply).toBe(false);
    expect(result.summary.discountPrice).toBe(0);
  });

  it("bestCouponIds 는 가장 할인이 큰 서로 다른 종류 조합을 고른다", async () => {
    const service = createService([FIXED, BOGO]);

    const result = await service.checkout({
      checkedProductIds: ["1", "2"],
      hardDeliveryPlace: false,
      selectedCouponIds: [],
    });

    // FIXED(-5,000) + BOGO(단가 높은 상품1 1개 무료 -30,000) 조합이 최선
    expect(result.bestCouponIds).toEqual(expect.arrayContaining(["FIX", "BOGO"]));
    expect(result.bestCouponIds).toHaveLength(2);
  });

  it("usable 쿠폰이 1개만 있는 경우, 해당 1개 쿠폰을 단독 추천한다", async () => {
    const service = createService([BOGO]);

    const result = await service.checkout({
      checkedProductIds: ["1", "2"],
      hardDeliveryPlace: false,
      selectedCouponIds: [],
    });

    expect(result.bestCouponIds).toEqual(["BOGO"]);
  });
});
