import request from "supertest";
import app from "../../src/app.js";
import { reset, saveNewItem } from "../../src/repositories/cart.repository.js";

describe("PATCH /cart/:id", () => {
  beforeEach(() => {
    reset();
  });

  it("유효한 요청이면 204 No Content와 빈 응답을 반환한다.", async () => {
    saveNewItem({ productId: 1, quantity: 1 });
    const { body: cartItems } = await request(app).get("/cart").expect(200);
    const id = cartItems[0].id;

    const response = await request(app).patch(`/cart/${id}`).send({ quantity: 2 });

    expect(response.status).toBe(204);
    expect(response.text).toBe("");
  });

  it("존재하지 않는 장바구니 상품이면 404 Not Found를 반환한다.", async () => {
    const response = await request(app).patch("/cart/9999").send({ quantity: 1 });

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      code: "CART_ITEM_NOT_FOUND",
      message: "장바구니 상품을 찾을 수 없습니다.",
    });
  });

  it.each([
    ["quantity가 없으면", { quantity: undefined }, "REQUIRED_CART_ITEM_QUANTITY"],
    ["quantity가 숫자가 아니면", { quantity: "abc" }, "REQUIRED_CART_ITEM_QUANTITY"],
    ["quantity가 1보다 작으면", { quantity: 0 }, "INVALID_CART_ITEM_QUANTITY"],
  ])("%s 400 Bad Request를 반환한다.", async (_caseName, body, code) => {
    saveNewItem({ productId: 1, quantity: 1 });
    const { body: cartItems } = await request(app).get("/cart").expect(200);
    const id = cartItems[0].id;

    const response = await request(app).patch(`/cart/${id}`).send(body);

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      code,
      message: expect.any(String),
    });
  });
});
