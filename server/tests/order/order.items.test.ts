import request from "supertest";
import app from "../../src/app.js";
import { reset as resetCart, saveNewItem } from "../../src/repositories/cart.repository.js";
import { reset as resetProducts } from "../../src/repositories/products.repository.js";

const product = {
  name: "콜라",
  stock: 10,
  imageUrl: "https://example.com/images/cola.png",
  price: 1500,
};

describe("POST /orders/summary", () => {
  beforeEach(() => {
    resetCart();
    resetProducts();
  });

  it("선택한 장바구니 상품과 주문 요약을 함께 반환한다.", async () => {
    await request(app).post("/products").send(product).expect(201);
    await request(app)
      .post("/products")
      .send({ ...product, name: "사이다" })
      .expect(201);
    saveNewItem({ productId: 1, quantity: 2 });
    saveNewItem({ productId: 2, quantity: 1 });

    const response = await request(app)
      .post("/orders/summary")
      .send({ selectedCartItemIds: [2], selectedCouponIds: [], isRemoteArea: false });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      orderItems: [
        {
          id: 2,
          productId: 2,
          quantity: 1,
          ...product,
          name: "사이다",
        },
      ],
      orderAmount: 1500,
      couponDiscountAmount: 0,
      shippingFee: 3000,
      totalPaymentAmount: 4500,
    });
  });

  it("선택한 장바구니 상품이 존재하지 않으면 404를 반환한다.", async () => {
    const response = await request(app)
      .post("/orders/summary")
      .send({ selectedCartItemIds: [999], selectedCouponIds: [], isRemoteArea: false });

    expect(response.status).toBe(404);
    expect(response.body.code).toBe("CART_ITEM_NOT_FOUND");
  });

  it("요청 body가 없으면 400을 반환한다.", async () => {
    const response = await request(app).post("/orders/summary").send({});

    expect(response.status).toBe(400);
    expect(response.body.code).toBe("INVALID_REQUEST_BODY");
  });
});
