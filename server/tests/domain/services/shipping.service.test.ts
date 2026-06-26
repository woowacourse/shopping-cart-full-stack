import {
  calculateShippingFee,
  FREE_SHIPPING_THRESHOLD,
  SHIPPING_FEE,
  REMOTE_AREA_FEE,
} from "../../../src/services/shipping.service.js";

describe("shipping.service", () => {
  describe("calculateShippingFee", () => {
    it("checkoutAmount가 FREE_SHIPPING_THRESHOLD 이상이면 0이다.", () => {
      expect(calculateShippingFee(FREE_SHIPPING_THRESHOLD, false)).toBe(0);
      expect(calculateShippingFee(FREE_SHIPPING_THRESHOLD + 1, true)).toBe(0);
    });

    it("임계값 미만이면 기본 배송비를 부과한다.", () => {
      expect(calculateShippingFee(FREE_SHIPPING_THRESHOLD - 1, false)).toBe(SHIPPING_FEE);
    });

    it("도서산간이면 기본 배송비에 추가 요금을 더한다.", () => {
      expect(calculateShippingFee(50000, true)).toBe(SHIPPING_FEE + REMOTE_AREA_FEE);
    });

    it("무료배송이면 도서산간이어도 0이다.", () => {
      expect(calculateShippingFee(FREE_SHIPPING_THRESHOLD, true)).toBe(0);
    });
  });
});
