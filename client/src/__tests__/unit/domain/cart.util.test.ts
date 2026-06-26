import { describe, expect, test } from "vitest";
import {
  getDeliveryFee,
  getFilteredCartItem,
  getOrderPrice,
  getTotalPrice,
} from "../../../domain/cart/cart.util";
import type { CartItemModel } from "../../../domain/cart/cart.api";

const cartItems: CartItemModel[] = [
  {
    productId: 1,
    name: "테스트 상품 1",
    price: 10000,
    itemCount: 2,
  },
  {
    productId: 2,
    name: "테스트 상품 2",
    price: 3000,
    itemCount: 3,
  },
];

describe("getOrderPrice", () => {
  test("상품 가격과 수량을 곱한 값의 합계를 반환한다", () => {
    expect(getOrderPrice(cartItems)).toBe(29000);
  });

  test("상품 목록이 비어있으면 0을 반환한다", () => {
    expect(getOrderPrice([])).toBe(0);
  });
});

describe("getFilteredCartItem", () => {
  test("선택된 상품 id에 해당하는 장바구니 상품만 반환한다", () => {
    expect(getFilteredCartItem(cartItems, [2])).toEqual([cartItems[1]]);
  });
});

describe("getDeliveryFee", () => {
  test("주문 금액이 무료 배송 기준 미만이면 배송비를 반환한다", () => {
    expect(getDeliveryFee(99999)).toBe(3000);
  });

  test("주문 금액이 무료 배송 기준 이상이면 0을 반환한다", () => {
    expect(getDeliveryFee(100000)).toBe(0);
  });
});

describe("getTotalPrice", () => {
  test("주문 금액과 배송비의 합계를 반환한다", () => {
    expect(getTotalPrice(29000, 3000)).toBe(32000);
  });
});
