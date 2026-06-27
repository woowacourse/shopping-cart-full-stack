import { jest } from "@jest/globals";
import request from "supertest";

const loadApp = async () => {
  jest.resetModules();
  jest.unstable_unmockModule("../src/container.js");

  const { default: app } = await import("../src/app.js");

  return app;
};

const loadAppWithOrderServiceError = async () => {
  jest.resetModules();
  jest.unstable_mockModule("../src/container.js", () => ({
    productService: { getProducts: jest.fn(), createProduct: jest.fn(), deleteProduct: jest.fn() },
    cartService: { getCartItems: jest.fn(), updateQuantity: jest.fn(), deleteCartItem: jest.fn() },
    couponService: { getCoupons: jest.fn() },
    orderService: {
      previewOrder() {
        throw new Error("order service error");
      },
    },
  }));

  const { default: app } = await import("../src/app.js");

  return app;
};

describe("Order API", () => {
  test("POST /order/preview는 결제 금액 정보를 응답한다", async () => {
    const app = await loadApp();

    const response = await request(app)
      .post("/order/preview")
      .send({ selectedItemIds: ["1"], coupons: [], isRemoteArea: false })
      .expect(200);

    expect(response.body).toMatchObject({
      orderAmount: 100000000000,
      couponDiscount: 0,
      deliveryFee: 0,
      totalPrice: 100000000000,
      appliedCoupons: [],
    });
  });

  test("POST /order/preview는 selectedItemIds가 비어있으면 400을 응답한다", async () => {
    const app = await loadApp();

    await request(app)
      .post("/order/preview")
      .send({ selectedItemIds: [], coupons: [], isRemoteArea: false })
      .expect(400);
  });

  test("POST /order/preview는 manual 모드에서 쿠폰이 3개 이상이면 400을 응답한다", async () => {
    const app = await loadApp();

    await request(app)
      .post("/order/preview")
      .send({ selectedItemIds: ["1"], coupons: ["1", "2", "3"], isRemoteArea: false })
      .expect(400);
  });

  test("POST /order/preview?mode=auto는 쿠폰을 3개 이상 받아도 200을 응답한다", async () => {
    const app = await loadApp();

    const response = await request(app)
      .post("/order/preview?mode=auto")
      .send({ selectedItemIds: ["1"], coupons: ["1", "2", "3", "4"], isRemoteArea: false })
      .expect(200);

    expect(response.body.appliedCoupons.length).toBeLessThanOrEqual(2);
  });

  test("POST /order/preview는 존재하지 않는 장바구니 항목이면 404를 응답한다", async () => {
    const app = await loadApp();

    await request(app)
      .post("/order/preview")
      .send({ selectedItemIds: ["999"], coupons: [], isRemoteArea: false })
      .expect(404);
  });

  test("POST /order/preview는 서버 오류가 발생하면 500을 응답한다", async () => {
    const app = await loadAppWithOrderServiceError();

    await request(app)
      .post("/order/preview")
      .send({ selectedItemIds: ["1"], coupons: [], isRemoteArea: false })
      .expect(500);
  });
});
