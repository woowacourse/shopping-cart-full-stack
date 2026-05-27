import request from "supertest";
import app from "../../src/app.js";
import { reset, saveNewItem } from "../../src/repositories/cart.repository.js";

describe("GET /cart", () => {
  beforeEach(() => {
    reset();
  });

  it("장바구니가 비어있으면 204 No Content와 빈 응답을 반환한다.", async () => {
    const response = await request(app).get("/cart");

    expect(response.status).toBe(204);
    expect(response.text).toBe("");
  });

  it("장바구니에 상품이 있으면 200 OK와 장바구니 목록을 반환한다.", async () => {
    saveNewItem({ productId: 1, quantity: 2 });

    const response = await request(app).get("/cart");

    expect(response.status).toBe(200);
    expect(response.headers["content-type"]).toContain("application/json");
    expect(response.body).toEqual([{ id: expect.any(Number), productId: 1, quantity: 2 }]);
  });
});
