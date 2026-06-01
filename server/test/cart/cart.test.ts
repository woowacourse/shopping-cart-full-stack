import Cart from "../../src/features/cart/cart.js";
import { CartValidationError } from "../../src/features/cart/cart.error.js";

describe("Cart Domain Model", () => {
  describe("생성자", () => {
    it("유효한 상품 ID와 수량으로 Cart를 생성할 수 있다", () => {
      const cart = new Cart({ productId: 1, quantity: 5 });
      expect(cart.getCart()).toEqual({
        productId: 1,
        quantity: 5,
      });
    });

    it("수량이 1 미만 시 에러", () => {
      expect(() => new Cart({ productId: 1, quantity: 0 })).toThrow(CartValidationError);
      expect(() => new Cart({ productId: 1, quantity: -5 })).toThrow(CartValidationError);
    });

    it("수량이 100 에러 ", () => {
      expect(() => new Cart({ productId: 1, quantity: 100 })).toThrow(CartValidationError);
    });
  });
});
