import request from "supertest";
import app from "../../src/app.js";
import { reset, saveNewItem } from "../../src/repositories/cart.repository.js";

describe("DELETE /cart/:id", () => {
  beforeEach(() => {
    reset();
  });

  it("존재하는 장바구니 상품을 삭제하면 204 No Content와 빈 응답을 반환한다.", async () => {
    saveNewItem({ productId: 1, quantity: 2 });
    const { body: cartItems } = await request(app).get("/cart").expect(200);
    const id = cartItems[0].id;

    const response = await request(app).delete(`/cart/${id}`);

    expect(response.status).toBe(204);
    expect(response.text).toBe("");
  });

  it("존재하지 않는 장바구니 상품을 삭제하면 404 Not Found를 반환한다.", async () => {
    const response = await request(app).delete("/cart/9999");

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      code: "CART_ITEM_NOT_FOUND",
      message: "장바구니 상품을 찾을 수 없습니다.",
    });
  });
});
