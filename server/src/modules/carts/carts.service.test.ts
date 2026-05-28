import { ServiceError } from "../../common/error.ts";
import * as cartsService from "./carts.service.ts";

describe("carts service 테스트", () => {
  describe("getCartById 테스트", () => {
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

    it("존재하지 않는 cartId로 조회하는 경우 ServiceError를 던진다.", () => {
      const nonExistentCartId = 999;

      let caughtError: unknown;
      try {
        cartsService.getCartById(nonExistentCartId);
      } catch (error) {
        caughtError = error;
      }

      expect(caughtError).toBeInstanceOf(ServiceError);
      expect(caughtError).toMatchObject({
        errorCode: "RESOURCE_NOT_FOUND",
      });
    });
  });
});
