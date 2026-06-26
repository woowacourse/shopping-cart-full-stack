import request from "supertest";
import app from "@/app";
import { ordersRepository } from "../orders.module";
import { productsRepository } from "@modules/products/products.module";
import { cartsRepository } from "@modules/carts/carts.module";
import type { Product } from "@modules/products/types";

const resetDB = () => {
  productsRepository.clear();
  cartsRepository.clear();
  ordersRepository.clear();
};

const createProductViaApi = async (
  overrides: Partial<Omit<Product, "id">> = {},
): Promise<Product> => {
  const res = await request(app)
    .post("/products")
    .send({
      name: overrides.name ?? `상품-${Math.random().toString(36).slice(2, 8)}`,
      price: overrides.price ?? 1000,
      image: overrides.image ?? "https://example.com/img.png",
    });
  return res.body.data;
};

const createOrderViaApi = (
  orderProducts: { productId: string; quantity: number }[],
) => request(app).post("/order").send({ orderProducts });

// 명세상 주문 정보 수정/할인 계산은 기존 주문이 있어야 동작하므로 공통 시드 헬퍼
const seedOrder = async () => {
  const product = await createProductViaApi({ name: "주문상품", price: 60000 });
  await createOrderViaApi([{ productId: product.id, quantity: 2 }]);
};

beforeEach(() => {
  resetDB();
});

describe("GET /order (주문 정보 조회)", () => {
  it("주문 정보를 200으로 조회한다", async () => {
    const productA = await createProductViaApi({ name: "상품A", price: 16000 });
    const productB = await createProductViaApi({ name: "상품B", price: 11000 });
    await createOrderViaApi([
      { productId: productA.id, quantity: 2 },
      { productId: productB.id, quantity: 1 },
    ]);

    const res = await request(app).get("/order");

    expect(res.status).toBe(200);
    expect(res.body.status).toBe("success");
    expect(res.body.message).toBe("주문 정보를 정상적으로 조회하였습니다.");
    expect(res.body.data).toEqual(
      expect.objectContaining({
        orderId: expect.any(String),
        orderProducts: expect.any(Array),
        isIsland: expect.any(Boolean),
        couponIds: expect.any(Array),
        priceInfo: expect.objectContaining({
          orderPrice: expect.any(Number),
          discountPrice: expect.any(Number),
          deliveryFee: expect.any(Number),
          totalPrice: expect.any(Number),
        }),
      }),
    );
  });

  it("저장된 주문이 없으면 404를 반환한다", async () => {
    const res = await request(app).get("/order");

    expect(res.status).toBe(404);
    expect(res.body.status).toBe("error");
    expect(res.body.message).toBe("존재하지 않는 주문입니다.");
  });

  it("주문 상품 항목은 상품 상세 정보를 포함한다", async () => {
    const product = await createProductViaApi({ name: "상품A", price: 16000 });
    await createOrderViaApi([{ productId: product.id, quantity: 2 }]);

    const res = await request(app).get("/order");

    expect(res.body.data.orderProducts[0]).toEqual(
      expect.objectContaining({
        productId: expect.any(String),
        productName: expect.any(String),
        productPrice: expect.any(Number),
        imgUrl: expect.any(String),
        quantity: expect.any(Number),
      }),
    );
  });
});

describe("POST /order (주문 정보 추가)", () => {
  it("정상 요청 시 201과 생성된 주문 ID를 반환한다", async () => {
    const product = await createProductViaApi({ price: 16000 });

    const res = await createOrderViaApi([
      { productId: product.id, quantity: 2 },
    ]);

    expect(res.status).toBe(201);
    expect(res.body.status).toBe("success");
    expect(res.body.message).toBe("주문 정보를 정상적으로 추가하였습니다.");
    expect(res.body.data).toEqual({ orderId: expect.any(String) });
  });

  it("orderProducts가 빈 배열이면 400을 반환한다", async () => {
    const res = await createOrderViaApi([]);

    expect(res.status).toBe(400);
    expect(res.body.status).toBe("error");
  });

  it("orderProducts가 누락되면 400을 반환한다", async () => {
    const res = await request(app).post("/order").send({});

    expect(res.status).toBe(400);
    expect(res.body.status).toBe("error");
  });

  it("존재하지 않는 productId이면 404를 반환한다", async () => {
    const res = await createOrderViaApi([
      { productId: "non-existent", quantity: 1 },
    ]);

    expect(res.status).toBe(404);
    expect(res.body.status).toBe("error");
  });

  it("quantity가 1 미만이면 400을 반환한다", async () => {
    const product = await createProductViaApi();

    const res = await createOrderViaApi([
      { productId: product.id, quantity: 0 },
    ]);

    expect(res.status).toBe(400);
    expect(res.body.status).toBe("error");
  });

  it("quantity가 99를 초과하면 400을 반환한다", async () => {
    const product = await createProductViaApi();

    const res = await createOrderViaApi([
      { productId: product.id, quantity: 100 },
    ]);

    expect(res.status).toBe(400);
    expect(res.body.status).toBe("error");
  });
});

describe("PATCH /order (주문 정보 수정)", () => {
  it("couponIds를 수정하면 200과 priceInfo를 반환한다", async () => {
    await seedOrder();

    const res = await request(app)
      .patch("/order")
      .send({ couponIds: ["FIXED5000"] });

    expect(res.status).toBe(200);
    expect(res.body.status).toBe("success");
    expect(res.body.message).toBe("주문 정보를 정상적으로 수정하였습니다.");
    expect(res.body.data).toEqual(
      expect.objectContaining({
        priceInfo: expect.objectContaining({
          orderPrice: expect.any(Number),
          discountPrice: expect.any(Number),
          totalPrice: expect.any(Number),
        }),
      }),
    );
  });

  it("isIsland를 수정하면 200과 priceInfo를 반환한다", async () => {
    await seedOrder();

    const res = await request(app).patch("/order").send({ isIsland: true });

    expect(res.status).toBe(200);
    expect(res.body.status).toBe("success");
    expect(res.body.data.priceInfo).toBeDefined();
  });

  it("couponIds가 배열이 아니면 400을 반환한다", async () => {
    await seedOrder();

    const res = await request(app)
      .patch("/order")
      .send({ couponIds: "FIXED5000" });

    expect(res.status).toBe(400);
    expect(res.body.status).toBe("error");
  });

  it("couponIds가 2개를 초과하면 400을 반환한다", async () => {
    await seedOrder();

    const res = await request(app)
      .patch("/order")
      .send({ couponIds: ["FIXED5000", "BOGO", "FREESHIPPING"] });

    expect(res.status).toBe(400);
    expect(res.body.status).toBe("error");
  });

  it("존재하지 않는 쿠폰이면 404를 반환한다", async () => {
    await seedOrder();

    const res = await request(app)
      .patch("/order")
      .send({ couponIds: ["non-existent"] });

    expect(res.status).toBe(404);
    expect(res.body.status).toBe("error");
  });

  it("isIsland가 boolean이 아니면 400을 반환한다", async () => {
    await seedOrder();

    const res = await request(app).patch("/order").send({ isIsland: "true" });

    expect(res.status).toBe(400);
    expect(res.body.status).toBe("error");
  });
});

describe("POST /order/discount-price (할인 금액 계산)", () => {
  it("정상 요청 시 200과 할인 금액을 반환한다", async () => {
    await seedOrder();

    const res = await request(app)
      .post("/order/discount-price")
      .send({ couponIds: ["FIXED5000"] });

    expect(res.status).toBe(200);
    expect(res.body.status).toBe("success");
    expect(res.body.message).toBe("할인 금액을 정상적으로 계산하였습니다.");
    expect(res.body.data).toEqual({ discountPrice: expect.any(Number) });
  });

  it("couponIds가 유효하지 않으면 400을 반환한다", async () => {
    await seedOrder();

    const res = await request(app)
      .post("/order/discount-price")
      .send({ couponIds: "FIXED5000" });

    expect(res.status).toBe(400);
    expect(res.body.status).toBe("error");
  });

  it("존재하지 않는 쿠폰이면 404를 반환한다", async () => {
    await seedOrder();

    const res = await request(app)
      .post("/order/discount-price")
      .send({ couponIds: ["non-existent"] });

    expect(res.status).toBe(404);
    expect(res.body.status).toBe("error");
  });
});
