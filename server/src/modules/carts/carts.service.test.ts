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

  describe("updateCartProduct 테스트", () => {
    it("필수 필드가 모두 존재하고 도메인 규칙에 맞는 경우 장바구니 상품 수량을 변경한다.", () => {
      const cartId = 1;
      const productId = 1;
      const quantity = 3;
      const cartUpdateOption = {
        quantity,
      };

      const updatedProduct = cartsService.updateCartProduct(
        cartId,
        productId,
        cartUpdateOption,
      );
      const cart = cartsService.getCartById(cartId);

      expect(updatedProduct).toEqual({
        id: productId,
        price: 18000,
        name: "Shopping Basket",
        imgUrl: "https://example.com/images/shopping-basket.png",
        quantity,
      });
      expect(cart.products).toContainEqual(updatedProduct);
    });

    it("quantity가 누락된 경우 ServiceError를 던진다.", () => {
      const cartId = 1;
      const productId = 1;
      const cartUpdateOption = {} as Parameters<
        typeof cartsService.updateCartProduct
      >[2];

      let caughtError: unknown;
      try {
        cartsService.updateCartProduct(cartId, productId, cartUpdateOption);
      } catch (error) {
        caughtError = error;
      }

      expect(caughtError).toBeInstanceOf(ServiceError);
      expect(caughtError).toMatchObject({
        errorCode: "MISSING_FIELD",
        data: expect.arrayContaining([
          expect.objectContaining({
            type: "quantity",
            errorCode: "MISSING_FIELD_QUANTITY",
          }),
        ]),
      });
    });
  });

  describe("deleteCartProduct 테스트", () => {
    it("cartId와 productId에 해당하는 장바구니 상품을 제거한다.", () => {
      const cartId = 1;
      const productId = 3;
      const cartBeforeDelete = cartsService.getCartById(cartId);

      cartsService.deleteCartProduct(cartId, productId);

      const cartAfterDelete = cartsService.getCartById(cartId);

      expect(cartAfterDelete.products).toHaveLength(
        cartBeforeDelete.products.length - 1,
      );
      expect(cartAfterDelete.products).not.toContainEqual(
        expect.objectContaining({
          id: productId,
        }),
      );
    });
  });
});
