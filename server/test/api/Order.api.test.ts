import request from "supertest";
import app from "../../src/app";
import { storedOrderRepository } from "../../src/repositories/StoredOrderRepository";

describe("주문 API 통합 테스트", () => {
  beforeEach(() => {
    storedOrderRepository.clear();
  });

  describe("POST /order", () => {
    it("주문을 생성하고 orderId를 반환한다", async () => {
      const response = await request(app)
        .post("/order")
        .send({
          items: [{ productId: 1, quantity: 2 }],
          appliedCoupon: [],
          remoteArea: false,
        });

      expect(response.status).toBe(201);
      expect(response.body.orderId).toBe(1);
    });
  });

  describe("GET /order/:orderId", () => {
    let orderId: number;

    beforeEach(() => {
      const order = storedOrderRepository.addOrder({
        items: [{ productId: 1, quantity: 2 }],
        appliedCoupon: [],
        remoteArea: false,
      });
      orderId = order.orderId;
    });

    it("orderId로 주문을 조회한다", async () => {
      const response = await request(app).get(`/order/${orderId}`);

      expect(response.status).toBe(200);
      expect(response.body.orderId).toBe(orderId);
    });

    it("존재하지 않는 orderId로 요청 시 404를 반환한다", async () => {
      const response = await request(app).get("/order/999");

      expect(response.status).toBe(404);
    });
  });

  describe("DELETE /order/:orderId", () => {
    let orderId: number;

    beforeEach(() => {
      const order = storedOrderRepository.addOrder({
        items: [{ productId: 1, quantity: 2 }],
        appliedCoupon: [],
        remoteArea: false,
      });
      orderId = order.orderId;
    });

    it("주문을 삭제하고 204를 반환한다", async () => {
      const response = await request(app).delete(`/order/${orderId}`);

      expect(response.status).toBe(204);
      expect(storedOrderRepository.findById(orderId)).toBeNull();
    });

    it("존재하지 않는 orderId로 요청 시 404를 반환한다", async () => {
      const response = await request(app).delete("/order/999");

      expect(response.status).toBe(404);
    });
  });
});
