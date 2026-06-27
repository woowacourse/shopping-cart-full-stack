import { jest } from "@jest/globals";
import request from "supertest";

const loadApp = async () => {
  jest.resetModules();
  jest.unstable_unmockModule("../src/container.js");

  const { default: app } = await import("../src/app.js");

  return app;
};

const loadAppWithCouponServiceError = async () => {
  jest.resetModules();
  jest.unstable_mockModule("../src/container.js", () => ({
    productService: {
      getProducts: jest.fn(),
      createProduct: jest.fn(),
      deleteProduct: jest.fn(),
    },
    cartService: {
      getCartItems: jest.fn(),
      updateQuantity: jest.fn(),
      deleteCartItem: jest.fn(),
    },
    couponService: {
      getCoupons() {
        throw new Error("coupon service error");
      },
    },
    orderService: {
      previewOrder: jest.fn(),
    },
  }));

  const { default: app } = await import("../src/app.js");

  return app;
};

describe("Coupon API", () => {
  test("GET /coupons는 사용 가능한 쿠폰 목록을 응답한다", async () => {
    const app = await loadApp();
    const response = await request(app).get("/coupons").expect(200);

    expect(response.body).toHaveLength(4);
    expect(response.body[0]).toMatchObject({
      id: "1",
      name: "5,000원 할인 쿠폰",
      type: "FIXED5000",
      expirationDate: "2026-11-30",
    });
  });

  test("GET /coupons는 서버 오류가 발생하면 500을 응답한다", async () => {
    const app = await loadAppWithCouponServiceError();

    await request(app).get("/coupons").expect(500);
  });
});
