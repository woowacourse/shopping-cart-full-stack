import { describe, test, expect } from "vitest";
import Cart from "../domain/Cart";
import { CartItem } from "../types";

const cartItems: CartItem[] = [
  {
    product_id: "1",
    quantity: 2,
    product: { name: "피자", thumbnail: "pizza.png", price: 20000 },
  },
  {
    product_id: "2",
    quantity: 1,
    product: { name: "버거", thumbnail: "burger.png", price: 7000 },
  },
  {
    product_id: "3",
    quantity: 3,
    product: { name: "치킨", thumbnail: "chicken.png", price: 18000 },
  },
];

describe("Cart Tests", () => {
  describe("isItemAllSelected", () => {
    test("모든 아이템이 선택되어 있으면 true를 반환한다.", () => {
      const cart = new Cart(cartItems, ["1", "2", "3"]);
      expect(cart.isItemAllSelected()).toBe(true);
    });

    test("일부 아이템만 선택되어 있거나 초기일때는 false를 반환한다.", () => {
      const cart1 = new Cart(cartItems, ["1", "2"]);
      expect(cart1.isItemAllSelected()).toBe(false);
      const cart2 = new Cart(cartItems, null);
      expect(cart2.isItemAllSelected()).toBe(false);
    });
  });

  describe("selectedItemCount", () => {
    test("선택된 아이템 종류 수를 반환한다.", () => {
      const cart = new Cart(cartItems, ["1", "3"]);
      expect(cart.selectedItemCount()).toBe(2);
    });

    test("선택된 아이템이 null이면 0을 반환한다.", () => {
      const cart = new Cart(cartItems, null);
      expect(cart.selectedItemCount()).toBe(0);
    });

    test("카트에 존재하지 않는 ID는 카운트에 포함되지 않는다.", () => {
      const cart = new Cart(cartItems, ["1", "99"]);
      expect(cart.selectedItemCount()).toBe(1);
    });
  });

  describe("selectedItemTotalQuantity", () => {
    test("선택된 아이템들의 수량 합계를 반환한다.", () => {
      const cart = new Cart(cartItems, ["1", "2"]);
      expect(cart.selectedItemTotalQuantity()).toBe(3);
    });

    test("선택된 아이템이 null이면 0을 반환한다.", () => {
      const cart = new Cart(cartItems, null);
      expect(cart.selectedItemTotalQuantity()).toBe(0);
    });
  });

  describe("calculateItemTotalPrice", () => {
    test("선택된 아이템들의 가격과 수량을 곱한 아이템 금액을 반환한다.", () => {
      const cart = new Cart(cartItems, ["1", "2"]);
      expect(cart.calculateItemTotalPrice()).toBe(47000);
    });

    test("선택된 아이템이 null이면 0을 반환한다.", () => {
      const cart = new Cart(cartItems, null);
      expect(cart.calculateItemTotalPrice()).toBe(0);
    });
  });
});
