import request from "supertest";
import app from "../../src/app";
import { describe, expect, test } from "@jest/globals";

describe("쿠폰 API", () => {
  test("GET /coupons 는 등록된 쿠폰 목록을 반환한다.", async () => {
    const response = await request(app).get("/coupons");

    expect(response.status).toBe(200);
    expect(response.body.coupons).toHaveLength(4);
    expect(response.body.coupons[0]).toMatchObject({
      id: 1,
      type: "FIXED5000",
      minAmount: 100_000,
    });
  });

  test("POST /coupons/calculation 은 선택한 쿠폰을 적용한 결제 금액을 반환한다.", async () => {
    const response = await request(app)
      .post("/coupons/calculation")
      .send({
        items: [{ price: 60_000, quantity: 2 }],
        couponIds: [1],
        isRemoteArea: false,
      });

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      orderAmount: 120_000,
      discountAmount: 5_000,
      shippingFee: 0,
      totalPayment: 115_000,
    });
    expect(Array.isArray(response.body.recommendedCouponIds)).toBe(true);
  });

  test("존재하지 않는 쿠폰 id 로 계산을 요청하면 400을 응답한다.", async () => {
    const response = await request(app)
      .post("/coupons/calculation")
      .send({ items: [], couponIds: [999], isRemoteArea: false });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("존재하지 않는 쿠폰입니다.");
  });

  test("쿠폰을 2개 초과로 선택하면 400을 응답한다.", async () => {
    const response = await request(app)
      .post("/coupons/calculation")
      .send({ items: [], couponIds: [1, 2, 3], isRemoteArea: false });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("사용 가능한 쿠폰 수량을 초과했습니다.");
  });

  test("POST /coupons/validation 은 유효한 쿠폰이면 200을 응답한다.", async () => {
    const response = await request(app)
      .post("/coupons/validation")
      .send({ couponIds: [1] });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("올바른 쿠폰입니다.");
  });

  test("존재하지 않는 쿠폰을 검증하면 404를 응답한다.", async () => {
    const response = await request(app)
      .post("/coupons/validation")
      .send({ couponIds: [999] });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("해당 쿠폰이 존재하지 않습니다.");
  });
});
