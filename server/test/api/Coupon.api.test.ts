import { jest } from "@jest/globals";
import request from "supertest";
import app from "../../src/app";
import { storedOrderRepository } from "../../src/repositories/StoredOrderRepository";
import { productRepository } from "../../src/repositories/ProductRepository";
import { cartRepository } from "../../src/repositories/CartRepository";
import { StoredOrder } from "../../src/repositories/StoredOrder";

const IMG = "https://example.com/img.jpg";

const addProduct = (
  price = 30000,
  totalQuantity = 10, // 100 → 10 (validateQuantity: 1~99)
) =>
  productRepository.addProduct({
    name: "테스트 상품",
    price,
    thumbnailUrl: IMG,
    totalQuantity,
  });

const addOrder = (overrides: Partial<Omit<StoredOrder, "orderId">> = {}) =>
  storedOrderRepository.addOrder({
    items: [{ productId: 1, quantity: 1 }],
    appliedCoupon: [],
    remoteArea: false,
    orderAmount: 50000,
    couponDiscountAmount: 0,
    shippingFee: 3000,
    totalAmount: 53000,
    ...overrides,
  });

describe("쿠폰 통합 테스트", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2026-06-18T10:00:00"));
    storedOrderRepository.clear();
    productRepository.clear();
    cartRepository.clear();
  });

  afterEach(() => jest.useRealTimers());

  // ─────────────────────────────────────────────────
  // 1. 주문확인 버튼 — GET /order/:id (자동 최적 쿠폰)
  // ─────────────────────────────────────────────────
  describe("1. 주문 확인 페이지 — GET /order/:id", () => {
    it("주문금액·배송비·총 결제금액이 반환된다", async () => {
      addProduct();
      const order = addOrder({ orderAmount: 30000 });

      const res = await request(app).get(`/order/${order.orderId}`);

      expect(res.status).toBe(200);
      expect(res.body.orderAmount).toBe(30000);
      expect(res.body.shippingFee).toBe(3000);
      expect(res.body.totalAmount).toBe(33000);
    });

    it("적용 가능한 쿠폰이 없으면 할인 없이 기본 배송비가 적용된다", async () => {
      addProduct();
      const order = addOrder({ orderAmount: 30000 }); // FIXED(<100k) FREESHIPPING(<50k) BTGO(qty1) MIRACLESALE(10am)

      const res = await request(app).get(`/order/${order.orderId}`);

      expect(res.body.couponDiscountAmount).toBe(0);
      expect(res.body.shippingFee).toBe(3000);
    });

    it("FREESHIPPING이 최적이면 배송비 무료로 자동 적용된다", async () => {
      addProduct();
      const order = addOrder({ orderAmount: 75000 });

      const res = await request(app).get(`/order/${order.orderId}`);

      expect(res.body.appliedCoupon).toEqual([3]);
      expect(res.body.shippingFee).toBe(0);
      expect(res.body.totalAmount).toBe(75000);
    });

    it("FIXED5000이 최적이면 5,000원 할인 + 배송비 무료로 자동 적용된다", async () => {
      addProduct();
      const order = addOrder({ orderAmount: 150000 });

      const res = await request(app).get(`/order/${order.orderId}`);

      expect(res.body.appliedCoupon).toEqual([1]);
      expect(res.body.couponDiscountAmount).toBe(5000);
      expect(res.body.shippingFee).toBe(0);
      expect(res.body.totalAmount).toBe(145000);
    });

    it("BTGO 할인이 더 크면 BTGO가 자동으로 선택된다", async () => {
      addProduct(50000); // BTGO=50000 > FIXED5000+배송비=8000
      const order = addOrder({
        items: [{ productId: 1, quantity: 3 }],
        orderAmount: 150000,
      });

      const res = await request(app).get(`/order/${order.orderId}`);

      expect(res.body.appliedCoupon).toEqual([2]);
      expect(res.body.couponDiscountAmount).toBe(50000);
      expect(res.body.totalAmount).toBe(103000); // 150000 - 50000 + 3000
    });

    it("MIRACLESALE 시간대에는 최대 할인 조합이 자동으로 선택된다", async () => {
      jest.setSystemTime(new Date("2026-06-18T05:00:00"));
      addProduct();
      const order = addOrder({ orderAmount: 75000 }); // [3,4]=25500 > [4]=22500 > [3]=3000

      const res = await request(app).get(`/order/${order.orderId}`);

      expect(res.body.appliedCoupon).toEqual([3, 4]);
      expect(res.body.shippingFee).toBe(0);
      expect(res.body.couponDiscountAmount).toBe(22500);
      expect(res.body.totalAmount).toBe(52500);
    });
  });

  // ─────────────────────────────────────────────────
  // 2. 쿠폰 적용 버튼 — GET /coupons/:orderId (활성화 여부)
  // ─────────────────────────────────────────────────
  describe("2. 쿠폰 모달 — GET /coupons/:orderId", () => {
    it("FIXED5000: 100,000원 이상이면 활성화, 미만이면 비활성화된다", async () => {
      addProduct();
      const on = addOrder({ orderAmount: 100000 });
      const off = addOrder({ orderAmount: 99999 });

      const coupon = (orderId: number) =>
        request(app)
          .get(`/coupons/${orderId}`)
          .then((r) => r.body.find((c: any) => c.couponId === 1));

      expect((await coupon(on.orderId)).isAvailable).toBe(true);
      expect((await coupon(off.orderId)).isAvailable).toBe(false);
    });

    it("BTGO: 수량 3개 이상이면 활성화, 미만이면 비활성화된다", async () => {
      addProduct();
      const on = addOrder({ items: [{ productId: 1, quantity: 3 }] });
      const off = addOrder({ items: [{ productId: 1, quantity: 2 }] });

      const coupon = (orderId: number) =>
        request(app)
          .get(`/coupons/${orderId}`)
          .then((r) => r.body.find((c: any) => c.couponId === 2));

      expect((await coupon(on.orderId)).isAvailable).toBe(true);
      expect((await coupon(off.orderId)).isAvailable).toBe(false);
    });

    it("FREESHIPPING: 50,000~99,999원이면 활성화, 범위 밖이면 비활성화된다", async () => {
      addProduct();
      const on = addOrder({ orderAmount: 75000 });
      const low = addOrder({ orderAmount: 49999 });
      const high = addOrder({ orderAmount: 100000 });

      const coupon = (orderId: number) =>
        request(app)
          .get(`/coupons/${orderId}`)
          .then((r) => r.body.find((c: any) => c.couponId === 3));

      expect((await coupon(on.orderId)).isAvailable).toBe(true);
      expect((await coupon(low.orderId)).isAvailable).toBe(false);
      expect((await coupon(high.orderId)).isAvailable).toBe(false);
    });

    it("MIRACLESALE: 04:00~06:59이면 활성화, 시간 외면 비활성화된다", async () => {
      addProduct();
      const order = addOrder();

      jest.setSystemTime(new Date("2026-06-18T05:00:00"));
      const resIn = await request(app).get(`/coupons/${order.orderId}`);

      jest.setSystemTime(new Date("2026-06-18T07:00:00"));
      const resOut = await request(app).get(`/coupons/${order.orderId}`);

      expect(resIn.body.find((c: any) => c.couponId === 4).isAvailable).toBe(
        true,
      );
      expect(resOut.body.find((c: any) => c.couponId === 4).isAvailable).toBe(
        false,
      );
    });

    it("만료된 쿠폰은 비활성화된다", async () => {
      jest.setSystemTime(new Date("2026-07-01T10:00:00")); // BTGO 만료일(2026-06-30) 이후
      addProduct();
      const order = addOrder({ items: [{ productId: 1, quantity: 3 }] });

      const res = await request(app).get(`/coupons/${order.orderId}`);

      expect(res.body.find((c: any) => c.couponId === 2).isAvailable).toBe(
        false,
      );
    });
  });

  // ─────────────────────────────────────────────────
  // 3. 쿠폰 적용 버튼 — 예상 할인액 표시
  //    GET /order/:id/coupon/calculate?couponIds=...
  // ─────────────────────────────────────────────────
  describe("3. 쿠폰 할인 미리보기 — GET /order/:id/coupon/calculate", () => {
    it("쿠폰 없이 요청하면 할인액 0을 반환한다", async () => {
      addProduct();
      const order = addOrder({ orderAmount: 30000 });

      const res = await request(app).get(
        `/order/${order.orderId}/coupon/calculate`,
      );

      expect(res.body.discountAmount).toBe(0);
    });

    it("BTGO: 수량 3개 이상 상품의 최고가를 반환한다", async () => {
      addProduct(30000);
      const order = addOrder({
        items: [{ productId: 1, quantity: 3 }],
        orderAmount: 90000,
      });

      const res = await request(app).get(
        `/order/${order.orderId}/coupon/calculate?couponIds=2`,
      );

      expect(res.body.discountAmount).toBe(30000);
    });

    it("FIXED5000: 5,000원 + 배송비 3,000원 할인액을 반환한다", async () => {
      addProduct();
      const order = addOrder({ orderAmount: 100000 });

      const res = await request(app).get(
        `/order/${order.orderId}/coupon/calculate?couponIds=1`,
      );

      expect(res.body.discountAmount).toBe(8000); // 5000 + 3000
    });

    it("FREESHIPPING: 배송비 3,000원 할인액을 반환한다", async () => {
      addProduct();
      const order = addOrder({ orderAmount: 75000 });

      const res = await request(app).get(
        `/order/${order.orderId}/coupon/calculate?couponIds=3`,
      );

      expect(res.body.discountAmount).toBe(3000);
    });
    it("MIRACLESALE: 주문금액의 30% 할인액을 반환한다", async () => {
      addProduct();
      const order = addOrder({ orderAmount: 75000 });

      const res = await request(app).get(
        `/order/${order.orderId}/coupon/calculate?couponIds=4`,
      );

      expect(res.body.discountAmount).toBe(22500); // 75000 * 0.3
    });

    it("FIXED5000 + MIRACLESALE: 5,000원 할인 후 남은 금액의 30% + 배송비를 반환한다", async () => {
      addProduct();
      const order = addOrder({ orderAmount: 100000 });

      const res = await request(app).get(
        `/order/${order.orderId}/coupon/calculate?couponIds=1,4`,
      );

      // couponDiscount: 5000 + (100000-5000)*0.3=28500 → 33500 / shippingDiscount: 3000
      expect(res.body.discountAmount).toBe(36500);
    });

    it("존재하지 않는 주문 ID는 404를 반환한다", async () => {
      const res = await request(app).get(
        "/order/999/coupon/calculate?couponIds=1",
      );

      expect(res.status).toBe(404);
    });
  });

  // ─────────────────────────────────────────────────
  // 3-1. 쿠폰 선택 적용 — PATCH /order/:id/coupon
  // ─────────────────────────────────────────────────
  describe("3-1. 쿠폰 적용 — PATCH /order/:id/coupon", () => {
    it("BTGO: 수량 3개 이상 상품들 중 최고가만큼 할인된다", async () => {
      const p1 = productRepository.addProduct({
        name: "A",
        price: 20000,
        thumbnailUrl: IMG,
        totalQuantity: 10,
      });
      const p2 = productRepository.addProduct({
        name: "B",
        price: 50000,
        thumbnailUrl: IMG,
        totalQuantity: 10,
      });
      const order = addOrder({
        items: [
          { productId: p1.productId, quantity: 3 },
          { productId: p2.productId, quantity: 3 },
        ],
        orderAmount: 210000,
      });

      await request(app)
        .patch(`/order/${order.orderId}/coupon`)
        .send({ couponIds: [2] });

      expect(
        storedOrderRepository.findById(order.orderId)!.couponDiscountAmount,
      ).toBe(50000);
    });

    it("BTGO: 수량 3개 미만 상품은 할인 대상에서 제외된다", async () => {
      const p1 = productRepository.addProduct({
        name: "A",
        price: 50000,
        thumbnailUrl: IMG,
        totalQuantity: 10,
      });
      const p2 = productRepository.addProduct({
        name: "B",
        price: 10000,
        thumbnailUrl: IMG,
        totalQuantity: 10,
      });
      const order = addOrder({
        items: [
          { productId: p1.productId, quantity: 2 },
          {
            productId: p2.productId,

            quantity: 3,
          },
        ],
        orderAmount: 130000,
      });

      await request(app)
        .patch(`/order/${order.orderId}/coupon`)
        .send({ couponIds: [2] });

      expect(
        storedOrderRepository.findById(order.orderId)!.couponDiscountAmount,
      ).toBe(10000);
    });

    it("FIXED5000: 5,000원 할인되고 배송비가 무료가 된다", async () => {
      addProduct();
      const order = addOrder({ orderAmount: 150000 });

      await request(app)
        .patch(`/order/${order.orderId}/coupon`)
        .send({ couponIds: [1] });

      const updated = storedOrderRepository.findById(order.orderId)!;
      expect(updated.couponDiscountAmount).toBe(5000);
      expect(updated.shippingFee).toBe(0);
      expect(updated.totalAmount).toBe(145000);
    });

    it("FREESHIPPING: 일반/도서산간 지역 모두 배송비가 무료가 된다", async () => {
      addProduct();
      const normal = addOrder({ orderAmount: 75000, remoteArea: false });
      const remote = addOrder({
        orderAmount: 75000,
        remoteArea: true,
        shippingFee: 6000,
      });

      await request(app)
        .patch(`/order/${normal.orderId}/coupon`)
        .send({ couponIds: [3] });
      await request(app)
        .patch(`/order/${remote.orderId}/coupon`)
        .send({ couponIds: [3] });

      expect(storedOrderRepository.findById(normal.orderId)!.shippingFee).toBe(
        0,
      );
      expect(storedOrderRepository.findById(remote.orderId)!.shippingFee).toBe(
        0,
      );
    });

    it("MIRACLESALE: 주문금액의 30%가 할인된다", async () => {
      addProduct();
      const order = addOrder({ orderAmount: 75000 });

      await request(app)
        .patch(`/order/${order.orderId}/coupon`)
        .send({ couponIds: [4] });

      const updated = storedOrderRepository.findById(order.orderId)!;
      expect(updated.couponDiscountAmount).toBe(22500);
      expect(updated.totalAmount).toBe(55500); // 75000 - 22500 + 3000
    });

    it("FREESHIPPING + MIRACLESALE: 배송비 면제 후 주문금액의 30%가 할인된다", async () => {
      addProduct();
      const order = addOrder({ orderAmount: 75000 });

      await request(app)
        .patch(`/order/${order.orderId}/coupon`)
        .send({ couponIds: [3, 4] });

      const updated = storedOrderRepository.findById(order.orderId)!;
      expect(updated.shippingFee).toBe(0);
      expect(updated.couponDiscountAmount).toBe(22500);
      expect(updated.totalAmount).toBe(52500);
    });

    it("FIXED5000 + MIRACLESALE: 5,000원 할인 후 남은 금액의 30%가 추가 할인된다", async () => {
      addProduct();
      const order = addOrder({ orderAmount: 150000 });

      await request(app)
        .patch(`/order/${order.orderId}/coupon`)
        .send({ couponIds: [1, 4] });

      const updated = storedOrderRepository.findById(order.orderId)!;
      expect(updated.shippingFee).toBe(0);
      expect(updated.couponDiscountAmount).toBe(48500); // 5000 + (150000-5000)*0.3
      expect(updated.totalAmount).toBe(101500);
    });

    it("쿠폰 3개 이상 전송 시 400을 반환한다", async () => {
      addProduct();
      const order = addOrder();

      const res = await request(app)
        .patch(`/order/${order.orderId}/coupon`)
        .send({ couponIds: [1, 2, 3] });

      expect(res.status).toBe(400);
    });
  });

  // ─────────────────────────────────────────────────
  // 4. 결제하기 버튼 — POST /order/:id/payment
  // ─────────────────────────────────────────────────
  describe("4. 결제 — POST /order/:id/payment", () => {
    it("상품 종류, 총 수량, 최종 결제금액을 반환한다", async () => {
      const p = addProduct(30000, 10);
      cartRepository.addProductToCart(p.productId, 2);
      const order = addOrder({
        items: [{ productId: p.productId, quantity: 2 }],
        orderAmount: 60000,
        couponDiscountAmount: 5000,
        shippingFee: 0,
        totalAmount: 55000,
      });

      const res = await request(app).post(`/order/${order.orderId}/payment`);

      expect(res.status).toBe(200);
      expect(res.body.itemCount).toBe(1);
      expect(res.body.orderQuantity).toBe(2);
      expect(res.body.totalAmount).toBe(55000);
    });

    it("결제 후 재고가 감소하고 주문과 장바구니가 삭제된다", async () => {
      const p = addProduct(30000, 10);
      cartRepository.addProductToCart(p.productId, 3);
      const order = addOrder({
        items: [{ productId: p.productId, quantity: 3 }],
      });

      await request(app).post(`/order/${order.orderId}/payment`);

      expect(productRepository.findById(p.productId)!.totalQuantity).toBe(7);
      expect(storedOrderRepository.findById(order.orderId)).toBeNull();
      expect(cartRepository.getCartProducts()).toHaveLength(0);
    });

    it("재고 초과 주문 시 400을 반환하고 재고가 변경되지 않는다", async () => {
      const p = addProduct(30000, 2);
      const order = addOrder({
        items: [{ productId: p.productId, quantity: 5 }],
      });

      const res = await request(app).post(`/order/${order.orderId}/payment`);

      expect(res.status).toBe(400);
      expect(productRepository.findById(p.productId)!.totalQuantity).toBe(2);
    });

    it("존재하지 않는 주문으로 결제 시 404를 반환한다", async () => {
      const res = await request(app).post("/order/999/payment");

      expect(res.status).toBe(404);
    });
  });
});
