import * as productsService from "./products.service.ts";

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

  describe("createProducts 테스트", () => {
    it("필수 필드가 모두 존재하고 도메인 규칙에 맞는 경우 새 상품을 추가한다.", () => {
      const product = {
        price: 25000,
        name: "Eco Bag",
        imgUrl: "https://example.com/images/eco-bag.png",
      };
      const productsBeforeCreate = productsService.getProducts();

      productsService.createProducts(product);

      const productsAfterCreate = productsService.getProducts();

      expect(productsAfterCreate).toHaveLength(productsBeforeCreate.length + 1);
      expect(productsAfterCreate).toContainEqual({
        id: expect.any(String),
        ...product,
      });
    });
  });
});
