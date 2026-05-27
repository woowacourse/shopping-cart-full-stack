import { BadRequestError } from "../../common/error.ts";
import * as productsService from "./products.service.ts";
import type { ProductRequest } from "./products.dto.ts";

describe("product service 테스트", () => {
  describe("getProducts 테스트", () => {
    it("상품 리스트를 반환한다.", () => {
      const products = productsService.getProducts();

      expect(products).toEqual([
        {
          id: "1",
          price: 18000,
          name: "Shopping Basket",
          imgUrl: "https://example.com/images/shopping-basket.png",
        },
        {
          id: "2",
          price: 32000,
          name: "Tote Bag",
          imgUrl: "https://example.com/images/tote-bag.png",
        },
        {
          id: "3",
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
        id: expect.any(String),
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
  });
});
