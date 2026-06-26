import request from "supertest";
import app from "../../../src/app.js";
import { reset as resetCart, saveNewItem } from "../../../src/repositories/cart.repository.js";
import { reset as resetProducts, save as saveProduct } from "../../../src/repositories/products.repository.js";

const validProduct = {
  name: "콜라",
  stock: 10,
  imageUrl: "https://example.com/images/cola.png",
  price: 1500,
};

describe("POST /reset", () => {
  beforeEach(async () => {
    await resetCart();
    await resetProducts();
  });

  it("장바구니가 비어 있으면 204를 반환하고 시드 데이터로 복원한다.", async () => {
    const response = await request(app).post("/reset");

    expect(response.status).toBe(204);

    const cart = await request(app).get("/cart");
    expect(cart.body.data.length).toBeGreaterThan(0);
  });

  it("장바구니에 상품이 남아 있으면 409를 반환하고 초기화하지 않는다.", async () => {
    await saveProduct(validProduct);
    await saveNewItem({ productId: 1, quantity: 2 });

    const response = await request(app).post("/reset");

    expect(response.status).toBe(409);
    expect(response.body.code).toBe("CART_NOT_EMPTY");

    const cart = await request(app).get("/cart");
    expect(cart.body.data).toHaveLength(1);
  });
});
