import request from "supertest";
import app from "../../../src/app.js";
import { reset, saveNewItem, findAll } from "../../../src/repositories/cart.repository.js";
import { reset as resetProducts } from "../../../src/repositories/products.repository.js";

const validProduct = {
  name: "콜라",
  stock: 10,
  imageUrl: "https://example.com/images/cola.png",
  price: 1500,
};

describe("PATCH /cart/:id", () => {
  beforeEach(async () => {
    await reset();
    await resetProducts();
  });

  it("유효한 요청이면 204 No Content와 빈 응답을 반환한다.", async () => {
    await request(app).post("/products").send(validProduct).expect(201);
    const { body: products } = await request(app).get("/products").expect(200);
    await saveNewItem({ productId: products[0].id, quantity: 1 });
    const { body: cartItems } = await request(app).get("/cart").expect(200);
    const id = cartItems.data[0].id;

    const response = await request(app).patch(`/cart/${id}`).send({ quantity: 2 });
    expect(response.status).toBe(204);
    expect(response.text).toBe("");
  });

  it("요청 수량이 재고보다 많고 기존 수량보다도 많으면 409 Conflict를 반환한다.", async () => {
    await request(app).post("/products").send(validProduct).expect(201);
    const { body: products } = await request(app).get("/products").expect(200);
    await saveNewItem({ productId: products[0].id, quantity: 1 });
    const { body: cartItems } = await request(app).get("/cart").expect(200);
    const response = await request(app)
      .patch(`/cart/${cartItems.data[0].id}`)
      .send({ quantity: validProduct.stock + 1 });

    expect(response.status).toBe(409);
    expect(response.body).toEqual({
      code: "OUT_OF_STOCK",
      message: "요청한 수량이 현재 재고보다 많습니다.",
    });
  });

  it("요청 수량이 재고보다 많아도 기존 수량보다 작은 경우(줄이는 요청)에는 204를 반환한다.", async () => {
    await request(app).post("/products").send(validProduct).expect(201);
    const { body: products } = await request(app).get("/products").expect(200);
    await saveNewItem({ productId: products[0].id, quantity: validProduct.stock + 2 });
    const { body: cartItems } = await request(app).get("/cart").expect(200);
    const response = await request(app)
      .patch(`/cart/${cartItems.data[0].id}`)
      .send({ quantity: validProduct.stock + 1 });

    expect(response.status).toBe(204);
  });

  it("존재하지 않는 장바구니 상품이면 404 Not Found를 반환한다.", async () => {
    const response = await request(app).patch("/cart/9999").send({ quantity: 1 });

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      code: "CART_ITEM_NOT_FOUND",
      message: "장바구니 상품을 찾을 수 없습니다.",
    });
  });

  it("id가 숫자가 아니면 400 Bad Request를 반환한다.", async () => {
    const response = await request(app).patch("/cart/abc").send({ quantity: 1 });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      code: "INVALID_CART_ITEM_ID",
      message: "장바구니 상품 ID는 숫자여야 합니다.",
    });
  });

  it.each([
    ["quantity가 없으면", { quantity: undefined }, "REQUIRED_CART_ITEM_QUANTITY"],
    ["quantity가 숫자가 아니면", { quantity: "abc" }, "REQUIRED_CART_ITEM_QUANTITY"],
    ["quantity가 1보다 작으면", { quantity: 0 }, "INVALID_CART_ITEM_QUANTITY"],
  ])("%s 400 Bad Request를 반환한다.", async (_caseName, body, code) => {
    await request(app).post("/products").send(validProduct).expect(201);
    const { body: products } = await request(app).get("/products").expect(200);
    await saveNewItem({ productId: products[0].id, quantity: 1 });
    const [item] = await findAll();
    const id = item.id;

    const response = await request(app).patch(`/cart/${id}`).send(body);

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      code,
      message: expect.any(String),
    });
  });
});
