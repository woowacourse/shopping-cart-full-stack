import { describe, test, expect } from "vitest";
import DeliveryFee from "../domain/DeliveryFee";

describe("DeliveryFee Tests", () => {
  const deliveryFee = new DeliveryFee(5_000, 200_000);

  test("상품 총액이 무료 배송 기준 미만이면 배달비를 반환한다.", () => {
    expect(deliveryFee.calculate(200_000 - 1)).toBe(5_000);
  });

  test("상품 총액이 무료 배송 기준이상이면 0을 반환한다.", () => {
    expect(deliveryFee.calculate(200_000)).toBe(0);
    expect(deliveryFee.calculate(200_000 + 1)).toBe(0);
  });
});
