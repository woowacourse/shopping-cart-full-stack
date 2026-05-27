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
});
