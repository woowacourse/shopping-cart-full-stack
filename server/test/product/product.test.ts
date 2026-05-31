import Product from "../../src/features/product/product.js";
import { VALID_PRODUCT_A } from "../mock-data/product.mock.js";

describe("상품 생성 테스트", () => {
  it("상품을 생성할 수 있다", () => {
    const item = {
      ...VALID_PRODUCT_A,
    };
    const product = new Product(item);
    expect(product).toBeInstanceOf(Product);
    expect(product.getProduct()).toEqual(item);
  });

  it("네임 필드 비었을 때 생성 실패", () => {
    const item = {
      ...VALID_PRODUCT_A,
      name: "",
    };
    expect(() => new Product(item)).toThrow();
  });

  it("네임 필드 100자 이상일때 생성 실패", () => {
    const inValidName = "n".repeat(101);
    const item = {
      ...VALID_PRODUCT_A,
      name: inValidName,
    };
    expect(() => new Product(item)).toThrow();
  });

  it("이미지 확장자로 끝나지 않을 때", () => {
    const item = {
      ...VALID_PRODUCT_A,
      imgUrl: "https://example.com/image.mp4",
    };

    expect(() => new Product(item)).toThrow();
  });

  it("price 값이 음수일 때 생성 실패", () => {
    const item = {
      ...VALID_PRODUCT_A,
      price: -3000,
    };
    expect(() => new Product(item)).toThrow();
  });

  it("price 값이 0일 때 생성 실패", () => {
    const item = {
      ...VALID_PRODUCT_A,
      price: 0,
    };
    expect(() => new Product(item)).toThrow();
  });
});
