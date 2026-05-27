import { BadRequestError } from "../../common/error.ts";
import * as productsService from "./products.service.ts";
import type { ProductRequest } from "./products.dto.ts";

describe("product service 테스트", () => {
  describe("getProducts 테스트", () => {
    it("상품 리스트를 반환한다.", () => {
      const products = productsService.getProducts();

      expect(products).toEqual([
        {
          id: 1,
          price: 18000,
          name: "Shopping Basket",
          imgUrl: "https://example.com/images/shopping-basket.png",
        },
        {
          id: 2,
          price: 32000,
          name: "Tote Bag",
          imgUrl: "https://example.com/images/tote-bag.png",
        },
        {
          id: 3,
          price: 9900,
          name: "Reusable Cup",
          imgUrl: "https://example.com/images/reusable-cup.png",
        },
      ]);
    });
  });

  describe("createProduct 테스트", () => {
    it("필수 필드가 모두 존재하고 도메인 규칙에 맞는 경우 새 상품을 추가한다.", () => {
      const product = {
        price: 25000,
        name: "Eco Bag",
        imgUrl: "https://example.com/images/eco-bag.png",
      };
      const productsBeforeCreate = productsService.getProducts();

      productsService.createProduct(product);

      const productsAfterCreate = productsService.getProducts();

      expect(productsAfterCreate).toHaveLength(productsBeforeCreate.length + 1);
      expect(productsAfterCreate).toContainEqual({
        id: expect.any(Number),
        ...product,
      });
    });

    it("필수값이 누락된 경우 BadRequestError를 던진다.", () => {
      const requiredFields = ["price", "name", "imgUrl"] as const;
      const product = {
        price: 25000,
        name: "Eco Bag",
        imgUrl: "https://example.com/images/eco-bag.png",
      };

      requiredFields.forEach((field) => {
        const productWithoutRequiredField: Partial<ProductRequest> = {
          ...product,
        };
        delete productWithoutRequiredField[field];

        let caughtError: unknown;
        try {
          productsService.createProduct(
            productWithoutRequiredField as ProductRequest,
          );
        } catch (error) {
          caughtError = error;
        }

        expect(caughtError).toBeInstanceOf(BadRequestError);
        expect(caughtError).toMatchObject({
          errorCode: "MISSING_FIELD",
          data: expect.arrayContaining([
            expect.objectContaining({
              type: field,
              errorCode: `${field.toUpperCase()}_MISSING_FIELD`,
            }),
          ]),
        });
      });
    });

    it("전달받은 값의 타입이 하나라도 불일치하는 경우 BadRequestError를 던진다.", () => {
      const invalidProducts = [
        {
          price: "25000",
          name: "Eco Bag",
          imgUrl: "https://example.com/images/eco-bag.png",
        },
        {
          price: 25000,
          name: 123,
          imgUrl: "https://example.com/images/eco-bag.png",
        },
        {
          price: 25000,
          name: "Eco Bag",
          imgUrl: 123,
        },
      ] as const;

      invalidProducts.forEach((product) => {
        let caughtError: unknown;
        try {
          productsService.createProduct(product as unknown as ProductRequest);
        } catch (error) {
          caughtError = error;
        }

        expect(caughtError).toBeInstanceOf(BadRequestError);
        expect(caughtError).toMatchObject({
          errorCode: "TYPE_MISMATCH",
        });
      });
    });

    it("도메인 규칙에 맞지 않는 값이 포함된 경우 BadRequestError를 던진다.", () => {
      const product = {
        price: 0,
        name: "a".repeat(101),
        imgUrl: "https://example.com/images/eco-bag.png",
      };

      let caughtError: unknown;
      try {
        productsService.createProduct(product);
      } catch (error) {
        caughtError = error;
      }

      expect(caughtError).toBeInstanceOf(BadRequestError);
      expect(caughtError).toMatchObject({
        errorCode: "INVALID",
        data: expect.arrayContaining([
          expect.objectContaining({
            type: "price",
            errorCode: "INVALID_PRICE",
          }),
          expect.objectContaining({
            type: "name",
            errorCode: "INVALID_NAME",
          }),
        ]),
      });
    });
  });
});
