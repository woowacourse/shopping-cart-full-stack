import request from "supertest";
import app from "../../../src/app.js";
import { reset, saveNewItem } from "../../../src/repositories/cart.repository.js";
import { reset as resetProducts, save as saveProduct } from "../../../src/repositories/products.repository.js";

const validProduct = {
  name: "콜라",
  stock: 10,
  imageUrl: "https://example.com/images/cola.png",
  price: 1500,
};

describe("GET /cart", () => {
  beforeEach(async () => {
    await reset();
    await resetProducts();
  });

  it("장바구니가 비어있으면 200 OK와 빈 배열을 반환한다.", async () => {
    const response = await request(app).get("/cart");

    expect(response.status).toBe(200);
    expect(response.body).toStrictEqual({ data: [] });
  });

  it("장바구니에 상품이 있으면 200 OK와 장바구니 목록을 반환한다.", async () => {
    await saveProduct(validProduct);
    await saveNewItem({ productId: 1, quantity: 2 });

    const response = await request(app).get("/cart");

    expect(response.status).toBe(200);
    expect(response.headers["content-type"]).toContain("application/json");
    expect(response.body).toEqual({
      data: [
        {
          id: expect.any(Number),
          name: validProduct.name,
          price: validProduct.price,
          quantity: 2,
          stock: validProduct.stock,
          status: "available",
          image_url: validProduct.imageUrl,
        },
      ],
    });
  });

  it.each([
    ["재고가 0이면", 0, 1, "outOfStock"],
    ["장바구니 수량이 재고보다 많으면", 3, 5, "quantityExceeded"],
    ["장바구니 수량이 재고 이하면", 5, 3, "available"],
  ])("%s status가 %s로 내려온다.", async (_caseName, stock, quantity, expectedStatus) => {
    await saveProduct({ ...validProduct, stock });
    await saveNewItem({ productId: 1, quantity });

    const response = await request(app).get("/cart");

    expect(response.body.data[0].status).toBe(expectedStatus);
  });
});
