import * as cartsService from "./carts.service.ts";

describe("carts service 테스트", () => {
  describe("getCarts 테스트", () => {
    it("cartId에 해당하는 장바구니 상품 목록을 반환한다.", () => {
      const cart = cartsService.getCartById(1);

      expect(cart).toEqual({
        id: 1,
        products: [
          {
            id: 1,
            price: 18000,
            name: "Shopping Basket",
            imgUrl: "https://example.com/images/shopping-basket.png",
            quantity: 2,
          },
          {
            id: 3,
            price: 9900,
            name: "Reusable Cup",
            imgUrl: "https://example.com/images/reusable-cup.png",
            quantity: 1,
          },
        ],
      });
    });
  });
});
