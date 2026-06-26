import { jest } from "@jest/globals";
import { DeliveryFee, HardPlacePolicy } from "../models/DeliveryFee.js";
import TempOrder from "../models/TempOrder.js";
import {
  AmountDiscountCoupon,
  BonusCoupon,
  FreeDeliveryCoupon,
  RateDiscountCoupon,
} from "../models/Coupon.js";
import Product from "../models/Product.js";
import request from "supertest";
import { ProductType } from "../models/Product.js";
import {
  HotTimeDiscountCondition,
  MinimumOrderPriceDiscountCondition,
} from "../models/DiscountCondition.js";
import { createShopApp } from "../factory.js";

describe("프로덕트 API 테스트", () => {
  const { app, productRepository } = createShopApp();

  const product1 = new Product({
    name: "피자",
    price: 30000,
    thumbnail: "pizza.png",
  });
  const product2 = new Product({
    name: "치킨",
    price: 20000,
    thumbnail: "chicken.png",
  });

  beforeEach(() => {
    productRepository.save(product1.getId(), product1);
    productRepository.save(product2.getId(), product2);
  });

  afterEach(() => {
    productRepository.clearAll();
  });

  test("프로덕트 목록을 반환한다.", async () => {
    const res = await request(app).get("/api/products/");
    res.body.map((product: ProductType) => (product.id = "fixed id"));
    expect(res.status).toBe(200);
    expect(res.body).toEqual([
      { id: "fixed id", name: "피자", price: 30000, thumbnail: "pizza.png" },
      { id: "fixed id", name: "치킨", price: 20000, thumbnail: "chicken.png" },
    ]);
  });

  test("프로덕트를 추가한다.", async () => {
    const res = await request(app)
      .post("/api/products/")
      .send({ name: "햄버거", price: 8000, thumnail: "hamburger.png" })
      .set("Accept", "application/json");
    res.body.id = "fixed id";
    expect(res.status).toBe(201);
    expect(res.body).toEqual({ id: "fixed id" });
    const products = productRepository.findAll();
    expect(products.length).toBe(3);
  });

  test("프로덕트를 삭제한다.", async () => {
    const id = product1.getId();
    const res = await request(app).del(`/api/products/${id}/`);
    expect(res.status).toBe(204);
    const products = productRepository.findAll();
    expect(products.length).toBe(1);
  });

  test("필수필드를 전달하지 않으면 400 에러가 발생한다.", async () => {
    const res = await request(app)
      .post("/api/products/")
      .send({ name: "", price: "", thumnail: "hamburger.png" })
      .set("Accept", "application/json");
    expect(res.status).toBe(400);
    expect(res.body).toEqual({
      code: "BAD_REQUEST",
      message: "요청 데이터가 유효하지 않습니다.",
      errors: {
        name: {
          code: "REQUIRED_FIELD",
          message: "상품명 필드가 누락되었습니다.",
        },
        price: {
          code: "REQUIRED_FIELD",
          message: "가격 필드가 누락되었습니다.",
        },
      },
    });
  });

  test("상품명길이가 100자 이상인 경우 400 에러가 발생한다.", async () => {
    const name = "엄청 긴 상품명".repeat(100);
    const res = await request(app)
      .post("/api/products/")
      .send({ name: name, price: "10000", thumnail: "hamburger.png" })
      .set("Accept", "application/json");
    expect(res.status).toBe(400);
    expect(res.body).toEqual({
      code: "BAD_REQUEST",
      message: "요청 데이터가 유효하지 않습니다.",
      errors: {
        name: {
          code: "INVALID_LENGTH_RANGE",
          message: "상품명은 0자 이상 100자 이하 문자여야 합니다.",
        },
      },
    });
  });

  test("가격이 0보다 작으면 400 에러가 발생한다.", async () => {
    const res = await request(app)
      .post("/api/products/")
      .send({ name: "햄버거", price: "0", thumnail: "hamburger.png" })
      .set("Accept", "application/json");
    expect(res.status).toBe(400);
    expect(res.body).toEqual({
      code: "BAD_REQUEST",
      message: "요청 데이터가 유효하지 않습니다.",
      errors: {
        price: {
          code: "INVALID_MIN_NUMBER",
          message: "가격은 0 보다 큰 숫자여야 합니다.",
        },
      },
    });
  });

  test("존재하지 않는 상품을 제거하려고 하면 404 에러가 발생한다.", async () => {
    const res = await request(app).del(`/api/products/unknown/`);
    expect(res.status).toBe(404);
    expect(res.body).toEqual({
      code: "RESOURCE_NOT_FOUND",
      message: "요청한 리소스를 찾을 수 없습니다.",
    });
  });

  test("스토리지 에러가 발생하면 500 에러가 반환된다.", async () => {
    jest.spyOn(productRepository, "findAll").mockImplementationOnce(() => {
      throw new Error("Repository error");
    });
    const res = await request(app).get("/api/products/");
    expect(res.status).toBe(500);
    expect(res.body).toEqual({
      code: "INTERNAL_SERVER_ERROR",
      message: "예기치 못한 오류가 발생했습니다.",
    });
  });
});

describe("카트 API 테스트", () => {
  const { app, cartRepository } = createShopApp();
  const cart = cartRepository.get();

  beforeEach(() => {
    cart.updateItemByProductId("123", 10);
    cart.updateItemByProductId("456", 20);
  });

  test("장바구니 내 아이템목록을 반환한다.", async () => {
    const res = await request(app).get("/api/cart/");
    expect(res.status).toBe(200);
    expect(res.body).toEqual([
      { product_id: "123", quantity: 10 },
      { product_id: "456", quantity: 20 },
    ]);
  });

  test("장바구니 내 아이템 수량을 수정한다.", async () => {
    const res = await request(app)
      .patch("/api/cart/items/123/")
      .send({ quantity: 40 })
      .set("Accept", "application/json");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ product_id: "123", quantity: 40 });
    const cart = cartRepository.get();
    expect(cart.getItemById("123")).toBe(40);
  });

  test("장바구니 내 아이템을 삭제한다.", async () => {
    const res = await request(app).delete("/api/cart/items/123");
    expect(res.status).toBe(204);
    const cart = cartRepository.get();
    expect(cart.getAllItems().length).toBe(1);
  });

  test("1 ~ 99개 사이가 아닌 수량을 수정하려 하면 400 에러가 발생한다.", async () => {
    const res = await request(app)
      .patch("/api/cart/items/123/")
      .send({ quantity: 100 })
      .set("Accept", "application/json");
    expect(res.status).toBe(400);
    expect(res.body).toEqual({
      code: "BAD_REQUEST",
      message: "요청 데이터가 유효하지 않습니다.",
      errors: {
        quantity: {
          code: "INVALID_NUMBER_RANGE",
          message: "수량은 1 이상 99 이하여야 합니다.",
        },
      },
    });
  });

  test("존재하지 않는 장바구니 내 아이템 수량 변경하려고 하면 404에러가 발생한다.", async () => {
    const res = await request(app)
      .patch("/api/cart/items/unknown/")
      .send({ quantity: 5 })
      .set("Accept", "application/json");
    expect(res.status).toBe(404);
    expect(res.body).toEqual({
      code: "RESOURCE_NOT_FOUND",
      message: "요청한 리소스를 찾을 수 없습니다.",
    });
  });

  test("존재하지 않은 장바구니 내 아이템을 제거하려고 하면 404에러가 발생한다.", async () => {
    const res = await request(app).del("/api/cart/items/unknown/");
    expect(res.status).toBe(404);
    expect(res.body).toEqual({
      code: "RESOURCE_NOT_FOUND",
      message: "요청한 리소스를 찾을 수 없습니다.",
    });
  });
});

describe("임시 주문서 API 테스트", () => {
  const { app, productRepository, tempOrderRepository, couponRepository } =
    createShopApp();

  const amountDiscountCoupon = new AmountDiscountCoupon({
    conditions: [],
    discountPrice: 5000,
  });

  const rateDiscountCoupon = new RateDiscountCoupon({
    conditions: [],
    discountRate: 30,
  });

  const tempOrder = new TempOrder(
    [
      {
        product_id: "777",
        quantity: 4,
        product: {
          name: "레몬에이드",
          price: 2500,
          thumbnail: "lemon-ade.png",
        },
      },
      {
        product_id: "555",
        quantity: 4,
        product: {
          name: "블루레몬에이드",
          price: 10000,
          thumbnail: "blue-lemon-ade.png",
        },
      },
    ],
    new DeliveryFee(3000, [new HardPlacePolicy(3000)], true),
    [amountDiscountCoupon, rateDiscountCoupon],
  );

  const freeDeliveryCoupon = new FreeDeliveryCoupon({
    conditions: [],
  });
  const bonusCoupon = new BonusCoupon({
    conditions: [],
    minQuantity: 2,
    bonusCount: 1,
  });

  beforeEach(() => {
    productRepository.save(
      "123",
      new Product({ name: "상품A", price: 10000, thumbnail: "a.png" }),
    );
    productRepository.save(
      "456",
      new Product({ name: "상품B", price: 20000, thumbnail: "b.png" }),
    );
    tempOrderRepository.save(tempOrder.getId(), tempOrder);
    couponRepository.save(freeDeliveryCoupon.getId(), freeDeliveryCoupon);
    couponRepository.save(bonusCoupon.getId(), bonusCoupon);
  });

  afterEach(() => {
    tempOrderRepository.clearAll();
    couponRepository.clearAll();
    productRepository.clearAll();
  });

  test("임시 주문서를 생성한다.", async () => {
    tempOrderRepository.clearAll();
    const res = await request(app)
      .post("/api/orders/")
      .send([
        { product_id: "123", quantity: 2 },
        { product_id: "456", quantity: 5 },
      ])
      .set("Accept", "application/json");
    res.body.order_id = "fixed id";
    expect(res.status).toBe(201);
    expect(res.body).toEqual({ order_id: "fixed id" });
    const tempOrder = tempOrderRepository.findAll();
    expect(tempOrder.length).toBe(1);
  });

  test("존재하지 않는 상품 id로 임시 주문서를 생성하려 하면 404 에러가 발생한다.", async () => {
    const res = await request(app)
      .post("/api/orders/")
      .send([
        { product_id: "123", quantity: 2 },
        { product_id: "unknown", quantity: 5 },
      ])
      .set("Accept", "application/json");
    expect(res.status).toBe(404);
    expect(res.body).toEqual({
      code: "RESOURCE_NOT_FOUND",
      message: "요청한 리소스를 찾을 수 없습니다.",
    });
  });

  test("특정 임시 주문서를 가져온다.", async () => {
    const id = tempOrder.getId();
    const res = await request(app).get(`/api/orders/${id}/`);
    expect(res.status).toBe(200);
    res.body.selected_coupons = ["SOME_COUPON1", "SOME_COUPON2"];
    res.body.price_summary = {
      order_price: 30500,
      discount_price: 6000,
      delivery_price: 3000,
      total_price: 21500,
    };
    expect(res.body).toEqual({
      id: id,
      hard_delivery_place: true,
      selected_coupons: ["SOME_COUPON1", "SOME_COUPON2"],
      selected_items: [
        {
          product_id: "777",
          quantity: 4,
          product: {
            name: "레몬에이드",
            price: 2500,
            thumbnail: "lemon-ade.png",
          },
        },
        {
          product_id: "555",
          quantity: 4,
          product: {
            name: "블루레몬에이드",
            price: 10000,
            thumbnail: "blue-lemon-ade.png",
          },
        },
      ],
      price_summary: {
        order_price: 30500,
        discount_price: 6000,
        delivery_price: 3000,
        total_price: 21500,
      },
    });
  });

  test("존재하지 않은 임시주문서를 가져오면 404 에러가 발생한다.", async () => {
    const res = await request(app).get(`/api/orders/unknown/`);
    expect(res.status).toBe(404);
    expect(res.body).toEqual({
      code: "RESOURCE_NOT_FOUND",
      message: "요청한 리소스를 찾을 수 없습니다.",
    });
  });

  test("특정 임시 주문서를 수정한다.", async () => {
    const id = tempOrder.getId();
    const res = await request(app)
      .patch(`/api/orders/${id}/`)
      .send({
        selected_coupons: [freeDeliveryCoupon.getId(), bonusCoupon.getId()],
      })
      .set("Accept", "application/json");
    expect(res.status).toBe(200);
    res.body.price_summary = {
      order_price: 30500,
      discount_price: 4000,
      delivery_price: 0,
      total_price: 26500,
    };
    expect(res.body).toEqual({
      id: id,
      hard_delivery_place: true,
      selected_coupons: [freeDeliveryCoupon.getId(), bonusCoupon.getId()],
      selected_items: [
        {
          product_id: "777",
          quantity: 4,
          product: {
            name: "레몬에이드",
            price: 2500,
            thumbnail: "lemon-ade.png",
          },
        },
        {
          product_id: "555",
          quantity: 4,
          product: {
            name: "블루레몬에이드",
            price: 10000,
            thumbnail: "blue-lemon-ade.png",
          },
        },
      ],
      price_summary: {
        order_price: 30500,
        discount_price: 4000,
        delivery_price: 0,
        total_price: 26500,
      },
    });
  });

  test("존재하지 않은 임시주문서를 수정하려고 하면 404 에러가 발생한다.", async () => {
    const res = await request(app)
      .patch(`/api/orders/unknown/`)
      .send({
        selected_coupons: [freeDeliveryCoupon.getId(), bonusCoupon.getId()],
      })
      .set("Accept", "application/json");
    expect(res.status).toBe(404);
    expect(res.body).toEqual({
      code: "RESOURCE_NOT_FOUND",
      message: "요청한 리소스를 찾을 수 없습니다.",
    });
  });

  test("쿠폰을 2개 초과 전달하면 400 에러가 발생한다.", async () => {
    const id = tempOrder.getId();
    const res = await request(app)
      .patch(`/api/orders/${id}/`)
      .send({
        selected_coupons: [
          freeDeliveryCoupon.getId(),
          bonusCoupon.getId(),
          freeDeliveryCoupon.getId(),
        ],
      })
      .set("Accept", "application/json");
    expect(res.status).toBe(400);
    expect(res.body).toEqual({
      code: "BAD_REQUEST",
      message: "요청 데이터가 유효하지 않습니다.",
      errors: {
        selected_coupons: {
          code: "EXCEED_MAX_COUNT",
          message: "쿠폰은 최대 2개까지 선택할 수 있습니다.",
        },
      },
    });
  });
});

describe("쿠폰 API 테스트", () => {
  const { app, couponRepository, tempOrderRepository } = createShopApp();

  const amountDiscountCoupon = new AmountDiscountCoupon({
    conditions: [new HotTimeDiscountCondition(5, 8)],
    discountPrice: 5000,
    expirationDate: new Date("2020-01-01"),
  });

  const rateDiscountCoupon = new RateDiscountCoupon({
    conditions: [new MinimumOrderPriceDiscountCondition(1000)],
    discountRate: 30,
    expirationDate: new Date("2030-12-31"),
  });

  const tempOrder = new TempOrder(
    [
      {
        product_id: "1",
        quantity: 1,
        product: { name: "피자", price: 5000, thumbnail: "" },
      },
    ],
    new DeliveryFee(0, []),
    [],
  );

  couponRepository.save(amountDiscountCoupon.getId(), amountDiscountCoupon);
  couponRepository.save(rateDiscountCoupon.getId(), rateDiscountCoupon);
  tempOrderRepository.save(tempOrder.getId(), tempOrder);

  test("쿠폰 목록을 가져온다", async () => {
    const res = await request(app).get(
      `/api/orders/${tempOrder.getId()}/coupons/`,
    );
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      max_coupon_count: 2,
      items: [
        {
          id: amountDiscountCoupon.getId(),
          name: "5,000원 할인 쿠폰",
          expiration_date: "2020년 1월 1일",
          description: "사용 가능 시간: 오전 5시부터 오전 8시까지",
          is_active: false,
        },
        {
          id: rateDiscountCoupon.getId(),
          name: "30% 시간제 할인 쿠폰",
          expiration_date: "2030년 12월 31일",
          description: "최소 주문 금액: 1000",
          is_active: true,
        },
      ],
    });
  });
});

describe("할인금액 API 테스트", () => {
  const { app, tempOrderRepository, couponRepository } = createShopApp();

  const amountDiscountCoupon = new AmountDiscountCoupon({
    conditions: [],
    discountPrice: 5000,
  });

  const rateDiscountCoupon = new RateDiscountCoupon({
    conditions: [],
    discountRate: 30,
  });

  const freeDeliveryCoupon = new FreeDeliveryCoupon({
    conditions: [],
  });

  const tempOrder = new TempOrder(
    [
      {
        product_id: "777",
        quantity: 4,
        product: {
          name: "레몬에이드",
          price: 2500,
          thumbnail: "lemon-ade.png",
        },
      },
      {
        product_id: "555",
        quantity: 4,
        product: {
          name: "블루레몬에이드",
          price: 10000,
          thumbnail: "blue-lemon-ade.png",
        },
      },
    ],
    new DeliveryFee(3000, [new HardPlacePolicy(3000)], true),
    [amountDiscountCoupon, rateDiscountCoupon],
  );

  tempOrderRepository.save(tempOrder.getId(), tempOrder);
  couponRepository.save(amountDiscountCoupon.getId(), amountDiscountCoupon);
  couponRepository.save(rateDiscountCoupon.getId(), rateDiscountCoupon);

  test("할인 금액을 응답한다", async () => {
    const res = await request(app)
      .post(`/api/orders/${tempOrder.getId()}/discount-summary/`)
      .send({ selected_coupons: [amountDiscountCoupon.getId()] })
      .set("Accept", "application/json");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      discount_price: 5000,
    });
  });

  test("쿠폰을 2개 초과 전달하면 400 에러가 발생한다.", async () => {
    const res = await request(app)
      .post(`/api/orders/${tempOrder.getId()}/discount-summary/`)
      .send({
        selected_coupons: [
          amountDiscountCoupon.getId(),
          rateDiscountCoupon.getId(),
          freeDeliveryCoupon.getId(),
        ],
      })
      .set("Accept", "application/json");
    expect(res.status).toBe(400);
    expect(res.body).toEqual({
      code: "BAD_REQUEST",
      message: "요청 데이터가 유효하지 않습니다.",
      errors: {
        selected_coupons: {
          code: "EXCEED_MAX_COUNT",
          message: "쿠폰은 최대 2개까지 선택할 수 있습니다.",
        },
      },
    });
  });
});
