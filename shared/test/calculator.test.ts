import {
  calculateBaseShippingFee,
  calculateBogoDiscount,
  calculateOrderAmount,
  generateOrderReceipt,
} from "../src/calculator";
import { Coupon, DELIVERY_RULES, PreorderItem } from "../src/types";
import { describe, it, expect } from "vitest";

describe("기본 상품 주문 금액 계산: calculateOrderAmount", () => {
  it("장바구니가 비어있으면 0원", () => {
    expect(calculateOrderAmount([])).toBe(0);
  });

  it("상품의 단가와 수량을 곱한 주문금액을 반환해야 한다.", () => {
    const items: PreorderItem[] = [
      {
        productId: 1,
        name: "셔츠",
        price: 20000,
        thumbnailUrl: "",
        quantity: 2,
      },
      {
        productId: 2,
        name: "바지",
        price: 30000,
        thumbnailUrl: "",
        quantity: 1,
      },
    ];

    expect(calculateOrderAmount(items)).toBe(70000);
  });
});

describe("BOGO 2+1 쿠폰 할인액 계산: calculateBogoDiscount", () => {
  it("수량이 2개 이상인 상품이 없으면 할인액은 0원", () => {
    const items: PreorderItem[] = [
      {
        productId: 1,
        name: "셔츠",
        price: 20000,
        thumbnailUrl: "",
        quantity: 1,
      },
    ];
    const bogoCoupon: Coupon = {
      couponId: 4,
      name: "2+1 쿠폰",
      type: "BOGO",
      expirationDate: "",
      condition: { minBogoQuantity: 2 },
      benefit: { bogoFreeQuantity: 1 },
    };
    expect(calculateBogoDiscount(items, bogoCoupon)).toBe(0);
  });

  it("수량이 2개 이상인 상품이 1개일 경우, 해당 상품의 단가를 할인액으로 반환", () => {
    const items: PreorderItem[] = [
      {
        productId: 1,
        name: "셔츠",
        price: 20000,
        thumbnailUrl: "",
        quantity: 2,
      },
    ];
    const bogoCoupon: Coupon = {
      couponId: 4,
      name: "2+1 쿠폰",
      type: "BOGO",
      expirationDate: "",
      condition: { minBogoQuantity: 2 },
      benefit: { bogoFreeQuantity: 1 },
    };
    expect(calculateBogoDiscount(items, bogoCoupon)).toBe(20000);
  });

  it("수량이 2개 이상인 상품이 여러 개일 경우, 단가가 가장 높은 상품의 단가를 반환", () => {
    const items: PreorderItem[] = [
      {
        productId: 1,
        name: "싼거",
        price: 15000,
        thumbnailUrl: "",
        quantity: 3,
      },
      {
        productId: 2,
        name: "비싼거",
        price: 20000,
        thumbnailUrl: "",
        quantity: 2,
      },
    ];
    const bogoCoupon: Coupon = {
      couponId: 4,
      name: "2+1 쿠폰",
      type: "BOGO",
      expirationDate: "",
      condition: { minBogoQuantity: 2 },
      benefit: { bogoFreeQuantity: 1 },
    };

    expect(calculateBogoDiscount(items, bogoCoupon)).toBe(20000);
  });
});

describe("배송비 계산: calculateBaseShippingFee", () => {
  it("주문 금액이 0원이면 배송비는 0원", () => {
    expect(calculateBaseShippingFee(0, false)).toBe(0);
  });

  it("주문 금액이 무료배송기준 미만, 일반 지역일 경우 기본 배송비", () => {
    const amount = DELIVERY_RULES.FREE_DELIVERY_LIMIT - 1;
    expect(calculateBaseShippingFee(amount, false)).toBe(3000);
  });

  it("주문 금액이 무료배송기준 이상이면 지역에 상관없이 배송비가 0원", () => {
    const amount = DELIVERY_RULES.FREE_DELIVERY_LIMIT;
    expect(calculateBaseShippingFee(amount, false)).toBe(0);
    expect(calculateBaseShippingFee(amount, true)).toBe(0);
  });

  it("주문 금액이 무료배송기준 미만이고, 도서산간 지역일 경우 기본 배송비에 도서산간추가금이 붙어 6000원", () => {
    const amount = DELIVERY_RULES.FREE_DELIVERY_LIMIT - 1;
    expect(calculateBaseShippingFee(amount, true)).toBe(6000);
  });
});

describe("전체 결제 영수증 생성: generateOrderReceipt", () => {
  const dummyItems: PreorderItem[] = [
    {
      productId: 1,
      name: "셔츠",
      price: 100000,
      thumbnailUrl: "",
      quantity: 1,
    },
  ];

  it("쿠폰이 없을 경우 기본 총액과 배송비만 계산", () => {
    const result = generateOrderReceipt(dummyItems, [], false, new Date());
    expect(result.priceSummary.orderAmount).toBe(100000);
    expect(result.priceSummary.discountAmount).toBe(0);
    expect(result.priceSummary.shippingFee).toBe(0);
    expect(result.priceSummary.totalPaymentAmount).toBe(100000);
    expect(result.giftItems).toEqual([]);
  });

  it("정액 할인 후 정률 할인", () => {
    const fixedCoupon: Coupon = {
      couponId: 1,
      name: "5천원 할인",
      type: "DISCOUNT",
      expirationDate: "",
      condition: { minOrderLimit: 100000 },
      benefit: { discountAmount: 5000 },
    };
    const rateCoupon: Coupon = {
      couponId: 2,
      name: "30% 할인",
      type: "TIMESALE",
      expirationDate: "",
      condition: { validTime: { startHour: 0, endHour: 24 } },
      benefit: { discountRate: 0.3 },
    };

    const mockServerTime = new Date("2026-06-16T12:00:00Z");

    const result = generateOrderReceipt(
      dummyItems,
      [fixedCoupon, rateCoupon],
      false,
      mockServerTime,
    );

    // (100,000 - 5,000) * 0.3 = 28,500
    // 총 할인금: 5,000 + 28,500 = 33,500
    expect(result.priceSummary.discountAmount).toBe(33500);
    expect(result.priceSummary.totalPaymentAmount).toBe(66500);
  });

  it("FREESHIPPING 쿠폰 적용 시, 산간지역이어도 배송비가 0원", () => {
    const item: PreorderItem[] = [
      {
        productId: 1,
        name: "셔츠",
        price: 50000,
        thumbnailUrl: "",
        quantity: 1,
      },
    ];
    const freeShippingCoupon: Coupon = {
      couponId: 3,
      name: "무료배송",
      type: "FREESHIPPING",
      expirationDate: "",
      condition: { minOrderLimit: 50000 },
      benefit: {},
    };

    const result = generateOrderReceipt(
      item,
      [freeShippingCoupon],
      true,
      new Date(),
    );

    expect(result.priceSummary.shippingFee).toBe(6000);
    expect(result.priceSummary.discountAmount).toBe(6000);
    expect(result.priceSummary.totalPaymentAmount).toBe(50000);
  });

  describe("BOGO 사은품 지급 로직 검증", () => {
    it("BOGO 조건을 만족하면 사은품 명세 반환", () => {
      const bogoItems: PreorderItem[] = [
        {
          productId: 99,
          name: "바지",
          price: 30000,
          thumbnailUrl: "",
          quantity: 2,
        },
      ];
      const bogoCoupon: Coupon = {
        couponId: 4,
        name: "2+1 이벤트",
        type: "BOGO",
        expirationDate: "",
        condition: { minBogoQuantity: 2 },
        benefit: { bogoFreeQuantity: 1 },
      };

      const result = generateOrderReceipt(
        bogoItems,
        [bogoCoupon],
        false,
        new Date(),
      );

      expect(result.priceSummary.discountAmount).toBe(0);
      expect(result.priceSummary.totalPaymentAmount).toBe(63000);
      expect(result.giftItems).toEqual([{ productId: 99, giftQuantity: 1 }]);
    });

    it("BOGO 조건을 만족하는 수량이 없으면 사은품 배열은 비어있어야 한다", () => {
      const lackItems: PreorderItem[] = [
        {
          productId: 99,
          name: "바지",
          price: 30000,
          thumbnailUrl: "",
          quantity: 1,
        },
      ];
      const bogoCoupon: Coupon = {
        couponId: 6,
        name: "2+1",
        type: "BOGO",
        expirationDate: "",
        condition: { minBogoQuantity: 2 },
        benefit: { bogoFreeQuantity: 1 },
      };

      const result = generateOrderReceipt(
        lackItems,
        [bogoCoupon],
        false,
        new Date(),
      );
      expect(result.giftItems).toEqual([]);
    });
  });
});
