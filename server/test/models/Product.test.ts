import Product, { ProductType } from "../../src/models/product.js";

describe("상품 생성 테스트", () => {
  const validField: ProductType = {
    name: "상품이름A",
    imgUrl: "https://example.com/image.jpg",
    price: 35000,
  };

  it("상품을 생성할 수 있다", () => {
    const item = {
      ...validField,
    };
    const product = new Product(item);
    expect(product).toBeInstanceOf(Product);
    expect(product.getProduct()).toEqual(item);
  });

  it("네임 필드 비었을 때 생성 실패", () => {
    const item = {
      ...validField,
      name: "",
    };
    expect(() => new Product(item)).toThrow();
  });

  it("네임 필드 100자 이상일때 생성 실패", () => {
    const inValidName = "n".repeat(101);
    const item = {
      ...validField,
      name: inValidName,
    };
    expect(() => new Product(item)).toThrow();
  });

  it("이미지 확장자로 끝나지 않을 때", () => {
    const item = {
      ...validField,
      imgUrl: "https://example.com/image.mp4",
    };

    expect(() => new Product(item)).toThrow();
  });

  it("price 값이 음수일 때 생성 실패", () => {
    const item = {
      ...validField,
      price: -3000,
    };
    expect(() => new Product(item)).toThrow();
  });

  it("price 값이 0일 때 생성 실패", () => {
    const item = {
      ...validField,
      price: 0,
    };
    expect(() => new Product(item)).toThrow();
  });
});
