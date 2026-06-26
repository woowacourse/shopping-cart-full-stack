import {
  calculateOrderSheetAmount,
  calculateAppliedShippingFee,
  calculateCouponDiscountAmount,
  calculatePaymentAmount,
  canUseCoupon,
  calculateBestCouponCombination,
} from "./orderSheets.domain.ts";

const DEFAULT_SHIPPING_POLICY = {
  baseShippingFee: 3000,
  remoteAreaAdditionalFee: 3000,
  freeShippingThreshold: 50000,
};

describe("주문서 금액 요약 정보 계산", () => {
  describe("주문금액 계산", () => {
    it("상품 가격과 수량을 곱해 주문금액을 계산한다", () => {
      // Arrange
      const products = [
        { price: 18000, quantity: 2 },
        { price: 9900, quantity: 1 },
      ];
      const expectedOrderSheetAmount = 45900;

      // Act
      const result = calculateOrderSheetAmount(products);

      // Assert
      expect(result).toBe(expectedOrderSheetAmount);
    });
  });

  describe("최종 배송비 계산", () => {
    it("무료 배송 기준에 못 미치는 경우 기본 배송비가 적용된다", () => {
      // Arrange
      const orderSheetAmount = 45900;
      const isRemoteArea = false;
      const hasFreeShippingFeeCoupon = false;

      const expectedShippingFee = 3000;

      // Act
      const result = calculateAppliedShippingFee(
        orderSheetAmount,
        isRemoteArea,
        hasFreeShippingFeeCoupon,
        DEFAULT_SHIPPING_POLICY,
      );

      // Assert
      expect(result).toBe(expectedShippingFee);
    });
    it("도서산간 지역인 경우 추가 배송비가 적용된다", () => {
      // Arrange
      const orderSheetAmount = 45900;
      const isRemoteArea = true;
      const hasFreeShippingFeeCoupon = false;

      const expectedShippingFee = 6000;

      // Act
      const result = calculateAppliedShippingFee(
        orderSheetAmount,
        isRemoteArea,
        hasFreeShippingFeeCoupon,
        DEFAULT_SHIPPING_POLICY,
      );

      // Assert
      expect(result).toBe(expectedShippingFee);
    });
    it("무료 배송 조건을 만족하면 배송비가 면제된다", () => {
      // Arrange
      const orderSheetAmount = 50000;
      const isRemoteArea = false;
      const hasFreeShippingFeeCoupon = false;

      const expectedShippingFee = 0;

      // Act
      const result = calculateAppliedShippingFee(
        orderSheetAmount,
        isRemoteArea,
        hasFreeShippingFeeCoupon,
        DEFAULT_SHIPPING_POLICY,
      );

      // Assert
      expect(result).toBe(expectedShippingFee);
    });
    it("무료 배송 쿠폰을 사용하면 배송비가 면제된다", () => {
      // Arrange
      const orderSheetAmount = 49500;
      const isRemoteArea = false;
      const hasFreeShippingFeeCoupon = true;

      const expectedShippingFee = 0;

      // Act
      const result = calculateAppliedShippingFee(
        orderSheetAmount,
        isRemoteArea,
        hasFreeShippingFeeCoupon,
        DEFAULT_SHIPPING_POLICY,
      );

      // Assert
      expect(result).toBe(expectedShippingFee);
    });
  });

  describe("쿠폰 할인금액 계산", () => {
    it("5000원 할인 쿠폰을 사용하면 할인금액에 반영한다", () => {
      // Arrange
      const products = [
        { price: 18000, quantity: 2 },
        { price: 32000, quantity: 2 },
      ];
      const coupons = ["FIXED5000"];
      const shippingFreeBeforeCoupon = 3000;

      const expectedDiscountCouponAmount = 5000;

      // Act
      const result = calculateCouponDiscountAmount(
        products,
        coupons,
        shippingFreeBeforeCoupon,
      );

      // Assert
      expect(result).toBe(expectedDiscountCouponAmount);
    });
    it("2 + 1 BOGO 쿠폰은 상품 3개 구매시 1개 가격 만큼 할인한다", () => {
      // Arrange
      const products = [{ price: 9900, quantity: 3 }];
      const coupons = ["BOGO"];
      const shippingFreeBeforeCoupon = 3000;

      const expectedDiscountCouponAmount = 9900;

      // Act
      const result = calculateCouponDiscountAmount(
        products,
        coupons,
        shippingFreeBeforeCoupon,
      );

      // Assert
      expect(result).toBe(expectedDiscountCouponAmount);
    });
    it("2 + 1 BOGO 쿠폰 조건을 만족하는 상품 중 단가가 가장 높은 상품에 적용한다", () => {
      // Arrange
      const products = [
        { price: 18000, quantity: 3 },
        { price: 9900, quantity: 3 },
      ];
      const coupons = ["BOGO"];
      const shippingFreeBeforeCoupon = 3000;

      const expectedDiscountCouponAmount = 18000;

      // Act
      const result = calculateCouponDiscountAmount(
        products,
        coupons,
        shippingFreeBeforeCoupon,
      );

      // Assert
      expect(result).toBe(expectedDiscountCouponAmount);
    });
    it("30% 할인 쿠폰을 사용하면 할인금액에 반영한다", () => {
      // Arrange
      const products = [
        { price: 18000, quantity: 3 },
        { price: 9900, quantity: 3 },
      ];
      const coupons = ["MIRACLESALE"];
      const shippingFreeBeforeCoupon = 3000;

      const expectedDiscountCouponAmount = 25110;

      // Act
      const result = calculateCouponDiscountAmount(
        products,
        coupons,
        shippingFreeBeforeCoupon,
      );

      // Assert
      expect(result).toBe(expectedDiscountCouponAmount);
    });

    it("BOGO 쿠폰 적용 후 남은 금액 기준으로 30% 할인 세일 쿠폰 할인금액에 반영한다", () => {
      // Arrange
      const products = [
        { price: 18000, quantity: 3 },
        { price: 9900, quantity: 3 },
      ];

      const coupons = ["BOGO", "MIRACLESALE"];
      const shippingFreeBeforeCoupon = 3000;

      const expectedDiscountCouponAmount = 37710;

      // Act
      const result = calculateCouponDiscountAmount(
        products,
        coupons,
        shippingFreeBeforeCoupon,
      );

      // Assert
      expect(result).toBe(expectedDiscountCouponAmount);
    });
  });

  describe("총 결제 금액 계산", () => {
    it("주문금액 - 쿠폰 할인 금액 + 최종 배송비로 총 결제 금액을 계산한다", () => {
      // Arrange
      const orderSheetAmount = 83700;
      const couponDiscountAmount = 37710;
      const appliedShippingFee = 3000;

      const expectedAmount = 48990;

      // Act
      const result = calculatePaymentAmount(
        orderSheetAmount,
        couponDiscountAmount,
        appliedShippingFee,
      );

      // Assert
      expect(result).toBe(expectedAmount);
    });
  });
});

describe("사용 가능한 쿠폰 계산", () => {
  describe("FIXED5000 쿠폰", () => {
    it("주문금액이 쿠폰의 최저 주문 금액 미만이면 사용 할 수 없다 ", () => {
      // Arrange
      const coupon = {
        code: "FIXED5000",
        expirationDate: "2026-11-30",
        condition: {
          minOrderAmount: 100000,
        },
      } as const;

      const orderSheetAmount = 36000;
      const now = new Date("2026-06-19");

      // Act
      const result = canUseCoupon(coupon, { orderSheetAmount, now });

      // Assert
      expect(result).toBe(false);
    });
    it("주문금액이 쿠폰의 최저 주문 금액 이상이면 사용 할 수 있다 ", () => {
      // Arrange
      const coupon = {
        code: "FIXED5000",
        expirationDate: "2026-11-30",
        condition: {
          minOrderAmount: 100000,
        },
      } as const;

      const orderSheetAmount = 108000;
      const now = new Date("2026-06-19");

      // Act
      const result = canUseCoupon(coupon, { orderSheetAmount, now });

      // Assert
      expect(result).toBe(true);
    });
  });
  describe("2 + 1 BOGO 쿠폰", () => {
    it("동일 상품을 3개 이하 담은 경우 사용할 수 없다", () => {
      // Arrange
      const coupon = {
        code: "BOGO",
        expirationDate: "2026-11-30",
        condition: {
          buyQuantity: 2,
          freeQuantity: 1,
        },
      } as const;

      const products = [
        {
          price: 18000,
          quantity: 2,
        },
      ];
      const now = new Date("2026-06-19");

      // Act
      const result = canUseCoupon(coupon, { products, now });

      // Assert
      expect(result).toBe(false);
    });
    it("동일 상품을 3개 이상 담은 경우 사용할 수 있다", () => {
      // Arrange
      const coupon = {
        code: "BOGO",
        expirationDate: "2026-11-30",
        condition: {
          buyQuantity: 2,
          freeQuantity: 1,
        },
      } as const;

      const products = [
        {
          price: 18000,
          quantity: 3,
        },
      ];
      const now = new Date("2026-06-19");

      // Act
      const result = canUseCoupon(coupon, { products, now });

      // Assert
      expect(result).toBe(true);
    });
  });
  describe("FREESHIPPING 쿠폰", () => {
    it("주문금액이 쿠폰의 최저 주문 금액 미만이면 사용 할 수 없다 ", () => {
      // Arrange
      const coupon = {
        code: "FREESHIPPING",
        expirationDate: "2026-11-30",
        condition: {
          minOrderAmount: 50000,
        },
      } as const;

      const orderSheetAmount = 36000;
      const now = new Date("2026-06-19");

      // Act
      const result = canUseCoupon(coupon, { orderSheetAmount, now });

      // Assert
      expect(result).toBe(false);
    });
    it("주문금액이 쿠폰의 최저 주문 금액 이상이면 사용 할 수 있다 ", () => {
      // Arrange
      const coupon = {
        code: "FREESHIPPING",
        expirationDate: "2026-11-30",
        condition: {
          minOrderAmount: 50000,
        },
      } as const;

      const orderSheetAmount = 54000;
      const now = new Date("2026-06-19");

      // Act
      const result = canUseCoupon(coupon, { orderSheetAmount, now });

      // Assert
      expect(result).toBe(true);
    });
  });

  describe("MIRACLESALE 쿠폰", () => {
    it("현재 시간이 쿠폰의 사용 가능 시간이 아니면 사용 할 수 없다 ", () => {
      // Arrange
      const coupon = {
        code: "MIRACLESALE",
        expirationDate: "2026-11-30",
        condition: {
          validTime: {
            start: "04:00",
            end: "07:00",
          },
        },
      } as const;

      const now = new Date("2026-06-19");

      // Act
      const result = canUseCoupon(coupon, { now });

      // Assert
      expect(result).toBe(false);
    });
    it("현재 시간이 쿠폰의 사용 가능 시간이면 사용 할 수 있다 ", () => {
      // Arrange
      const coupon = {
        code: "MIRACLESALE",
        expirationDate: "2026-11-30",
        condition: {
          validTime: {
            start: "04:00",
            end: "07:00",
          },
        },
      } as const;

      const now = new Date("2026-06-19T04:30:00");

      // Act
      const result = canUseCoupon(coupon, { now });

      // Assert
      expect(result).toBe(true);
    });
  });
});

describe("최대 2개의 최적 쿠폰 조합 계산", () => {
  it("전체 쿠폰 중 사용 가능한 쿠폰을 기준으로 할인 금액이 가장 큰 2개의 쿠폰 조합을 반환한다", () => {
    // Arrange
    const products = [{ price: 32000, quantity: 4 }];
    const shippingFeeBeforeCoupon = 3000;
    const coupons = ["FIXED5000", "BOGO", "MIRACLESALE", "FREESHIPPING"];

    const expectedCoupons = ["BOGO", "MIRACLESALE"];
    // Act

    const result = calculateBestCouponCombination(
      products,
      coupons,
      shippingFeeBeforeCoupon,
    );

    // Assert
    expect(result).toEqual(expectedCoupons);
  });
});
