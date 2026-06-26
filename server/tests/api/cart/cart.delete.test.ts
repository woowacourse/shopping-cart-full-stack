import request from "supertest";
import app from "../../../src/app.js";
import { reset, saveNewItem, findAll } from "../../../src/repositories/cart.repository.js";
import {
  reset as resetProducts,
  save as saveProduct,
  findAll as findProducts,
} from "../../../src/repositories/products.repository.js";

const validProduct = { name: "콜라", stock: 10, imageUrl: "https://example.com/cola.png", price: 1500 };

describe("DELETE /cart/:id", () => {
  beforeEach(async () => {
    await resetProducts();
    await reset();
  });

  it("존재하는 장바구니 상품을 삭제하면 204 No Content와 빈 응답을 반환한다.", async () => {
    await saveProduct(validProduct);
    const [product] = await findProducts();
    await saveNewItem({ productId: product.id, quantity: 2 });
    const [item] = await findAll();
    const id = item.id;

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

  it("id가 숫자가 아니면 400 Bad Request를 반환한다.", async () => {
    const response = await request(app).delete("/cart/abc");

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      code: "INVALID_CART_ITEM_ID",
      message: "장바구니 상품 ID는 숫자여야 합니다.",
    });
  });
});
