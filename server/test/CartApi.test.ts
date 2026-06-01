import { jest } from "@jest/globals";
import request from "supertest";

const loadApp = async () => {
  jest.resetModules();
  jest.unstable_unmockModule("../src/services/ProductService.js");
  jest.unstable_unmockModule("../src/services/CartService.js");

  const { default: app } = await import("../src/app.js");

  return app;
};

const loadAppWithCartServiceError = async () => {
  jest.resetModules();
  jest.unstable_unmockModule("../src/services/ProductService.js");
  jest.unstable_mockModule("../src/services/CartService.js", () => ({
    cartService: {
      getCartItems() {
        throw new Error("cart service error");
      },
      updateQuantity: jest.fn(),
      deleteCartItem: jest.fn(),
    },
  }));

  const { default: app } = await import("../src/app.js");

  return app;
};

describe("Cart API", () => {
  test("GET /carts는 장바구니 목록을 응답한다", async () => {
    const app = await loadApp();
    const response = await request(app).get("/carts").expect(200);

    expect(response.body).toHaveLength(3);
    expect(response.body[0]).toMatchObject({
      id: "1",
      product: {
        id: "1",
        name: "EASTER",
      },
      quantity: 1,
    });
  });

  test("GET /carts는 서버 오류가 발생하면 500을 응답한다", async () => {
    const app = await loadAppWithCartServiceError();

    await request(app).get("/carts").expect(500);
  });

  test("PATCH /carts/:id는 수량을 변경하고 변경 결과를 응답한다", async () => {
    const app = await loadApp();
    const response = await request(app)
      .patch("/carts/1")
      .send({ quantity: 3 })
      .expect(200);

    expect(response.body).toEqual({
      id: "1",
      quantity: 3,
    });
  });

  test("PATCH /carts/:id는 유효하지 않은 수량이면 400을 응답한다", async () => {
    const app = await loadApp();

    await request(app).patch("/carts/1").send({ quantity: 0 }).expect(400);
  });

  test("PATCH /carts/:id는 없는 장바구니 항목이면 404를 응답한다", async () => {
    const app = await loadApp();

    await request(app).patch("/carts/999").send({ quantity: 3 }).expect(404);
  });

  test("DELETE /carts/:id는 장바구니 항목을 삭제한다", async () => {
    const app = await loadApp();

    await request(app).delete("/carts/1").expect(204);
  });

  test("DELETE /carts/:id는 없는 장바구니 항목이면 404를 응답한다", async () => {
    const app = await loadApp();

    await request(app).delete("/carts/999").expect(404);
  });
});
