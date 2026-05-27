import Product from "../models/Product.js";

describe("Product Tests", () => {
  test("프로덕트 클래스를 객체 형태로 반환한다.", () => {
    const product = new Product("수건", 10000, "some.jpg");
    expect(product.getProduct()).toEqual(
      expect.objectContaining({
        name: "수건",
        price: 10000,
        thumbnail: "some.jpg",
      }),
    );
  });
});
