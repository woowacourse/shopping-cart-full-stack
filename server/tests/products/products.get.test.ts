import request from "supertest";
import app from "../../src/app.js";

const validProduct = {
  name: "콜라",
  stock: 10,
  imageUrl: "https://example.com/images/cola.png",
  price: 1500,
};

describe("GET /products", () => {
  it("상품이 없으면 204 No Content와 빈 응답을 반환한다.", async () => {
    const response = await request(app).get("/products");

    expect(response.status).toBe(204);
    expect(response.text).toBe("");
  });

  it("상품이 있으면 200 OK와 전체 상품 목록을 반환한다.", async () => {
    await request(app).post("/products").send(validProduct).expect(201);

    const response = await request(app).get("/products");

    expect(response.status).toBe(200);
    expect(response.headers["content-type"]).toContain("application/json");
    expect(response.body).toEqual([
      {
        id: expect.any(Number),
        ...validProduct,
      },
    ]);
  });
});
