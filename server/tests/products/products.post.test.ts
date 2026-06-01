import request from "supertest";
import app from "../../src/app.js";
import { reset } from "../../src/repositories/products.repository.js";
const validProduct = {
  name: "콜라",
  stock: 10,
  imageUrl: "https://example.com/images/cola.png",
  price: 1500,
};

describe("POST /products", () => {
  beforeEach(() => {
    reset();
  });
  it("상품 추가 요청이 유효하면 201 Created와 빈 응답을 반환한다.", async () => {
    // 추가 요청 검증
    const response = await request(app).post("/products").send(validProduct);
    expect(response.status).toBe(201);
    expect(response.text).toBe("");

    // 실제 테스트 검증
    const { body: updatedProductsList } = await request(app).get("/products").expect(200);
    expect(updatedProductsList).toEqual([
      {
        id: expect.any(Number),
        ...validProduct,
      },
    ]);
  });

  it.each([
    ["이름이 없으면", { name: undefined }],
    ["이름이 100자를 초과하면", { name: "가".repeat(101) }],
    ["재고가 없으면", { stock: undefined }],
    ["재고가 1보다 작으면", { stock: 0 }],
    ["재고가 99보다 크면", { stock: 100 }],
    ["재고가 정수가 아니면", { stock: 1.5 }],
    ["이미지가 없으면", { imageUrl: undefined }],
    ["가격이 없으면", { price: undefined }],
    ["가격이 0이면", { price: 0 }],
    ["가격이 음수이면", { price: -1 }],
  ])("%s 400 Bad Request를 반환한다.", async (_caseName, invalidField) => {
    const invalidProduct = {
      ...validProduct,
      ...invalidField,
    };
    // 추가 요청 검증
    const response = await request(app).post("/products").send(invalidProduct);
    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      code: expect.any(String),
      message: expect.any(String),
    });

    // 실제 데이터 검증
    const { body: updatedProductsList } = await request(app).get("/products").expect(200);
    expect(updatedProductsList).toEqual([]);
  });
});
