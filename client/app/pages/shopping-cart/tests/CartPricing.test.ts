import { describe, test, expect } from "vitest";
import Cart from "../domain/Cart";
import CartPricing from "../domain/CartPricing";
import DeliveryFee from "../domain/DeliveryFee";
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
];

describe("CartPricing Tests", () => {
  const deliveryFee = new DeliveryFee(7_000, 200_000);

  test("선택된 아이템의 총 금액, 배달비, 최종 금액을 반환한다.", () => {
    const cart = new Cart(cartItems, ["1", "2"]);
    const pricing = new CartPricing(cart, deliveryFee);
    expect(pricing.calculatePriceSummary()).toEqual({
      price: 47000,
      delivery: 7000,
      totalPrice: 54000,
    });
  });

  test("상품 총액이 무료 배송 기준 이상이면 배달비는 0원이다.", () => {
    const bigItems: CartItem[] = [
      {
        product_id: "1",
        quantity: 10,
        product: { name: "피자", thumbnail: "pizza.png", price: 20_000 },
      },
    ];
    const cart = new Cart(bigItems, ["1"]);
    const pricing = new CartPricing(cart, deliveryFee);
    expect(pricing.calculatePriceSummary()).toEqual({
      price: 200_000,
      delivery: 0,
      totalPrice: 200_000,
    });
  });

  test("선택된 아이템이 없으면 배달비는 계산되지 않는다.", () => {
    const cart = new Cart(cartItems, null);
    const pricing = new CartPricing(cart, deliveryFee);
    expect(pricing.calculatePriceSummary()).toEqual({
      price: 0,
      delivery: 0,
      totalPrice: 0,
    });
  });
});
