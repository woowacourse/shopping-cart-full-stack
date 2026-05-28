import request from "supertest";
import app from "../../src/app.js";
import { reset } from "../../src/repositories/products.repository.js";
import { reset as resetCart, saveNewItem } from "../../src/repositories/cart.repository.js";

const validProduct = {
  name: "콜라",
  stock: 10,
  imageUrl: "https://example.com/images/cola.png",
  price: 1500,
};

describe("DELETE /products/:id", () => {
  beforeEach(() => {
    reset();
    resetCart();
  });

  it("존재하는 상품을 삭제하면 204 No Content와 빈 응답을 반환한다.", async () => {
    await request(app).post("/products").send(validProduct).expect(201);
    const { body: products } = await request(app).get("/products").expect(200);
    const id = products[0].id;

    const response = await request(app).delete(`/products/${id}`);

    expect(response.status).toBe(204);
    expect(response.text).toBe("");
  });

  it("상품을 삭제하면 장바구니에 있는 해당 상품도 함께 삭제된다.", async () => {
    await request(app).post("/products").send(validProduct).expect(201);
    const { body: products } = await request(app).get("/products").expect(200);
    const productId = products[0].id;
    saveNewItem({ productId, quantity: 1 });

    await request(app).delete(`/products/${productId}`).expect(204);

    const { body: cartItems } = await request(app).get("/cart");
    expect(cartItems).not.toContainEqual(expect.objectContaining({ productId }));
  });

  it("존재하지 않는 상품을 삭제하면 404 Not Found를 반환한다.", async () => {
    const response = await request(app).delete("/products/9999");

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      code: "PRODUCT_NOT_FOUND",
      message: "요청한 상품을 찾을 수 없습니다.",
    });
  });
});
