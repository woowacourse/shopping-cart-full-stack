import { jest } from "@jest/globals";
import { createApp } from "../app.js";
import InMemoryStorage from "../storages/InMemoryStorage.js";
import Product from "../models/Product.js";
import request from "supertest";
import Cart from "../models/Cart.js";
import {
  createCartController,
  createProductController,
} from "../controllers.js";
import { ProductType } from "../models/Product.js";

describe("프로덕트 API 테스트", () => {
  const storage = new InMemoryStorage();
  const cartController = createCartController(storage);
  const productController = createProductController(storage);

  const app = createApp({ productController, cartController });
  const product1 = new Product("피자", 30000, "pizza.png");
  const product2 = new Product("치킨", 20000, "chicken.png");

  beforeEach(() => {
    storage.addItemById("products", product1.getId(), product1);
    storage.addItemById("products", product2.getId(), product2);
  });

  afterEach(() => {
    storage.clearAllItems("products");
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
  });

  test("프로덕트를 삭제한다.", async () => {
    const id = product1.getId();
    const res = await request(app).del(`/api/products/${id}/`);
    expect(res.status).toBe(204);
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
          message: "상품명은 0 이상 100 이하여야 합니다.",
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
    jest.spyOn(storage, "allItems").mockImplementationOnce(() => {
      throw new Error("Storage error");
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
  const storage = new InMemoryStorage();
  const productController = createProductController(storage);
  const cartController = createCartController(storage);
  const app = createApp({ productController, cartController });
  const cart = storage.getItemById("cart", "my-cart") as Cart;

  beforeEach(() => {
    cart.updateItemByProductId("123", 10);
    cart.updateItemByProductId("456", 20);
  });

  test("장바구니 내 아이템목록을 반환한다.", async () => {
    const res = await request(app).get("/api/cart/");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      items: [
        { product_id: "123", quantity: 10 },
        { product_id: "456", quantity: 20 },
      ],
    });
  });

  test("장바구니 내 아이템 수량을 수정한다.", async () => {
    const res = await request(app)
      .patch("/api/cart/items/123/")
      .send({ quantity: 40 })
      .set("Accept", "application/json");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ product_id: "123", quantity: 40 });
  });

  test("장바구니 내 아이템을 삭제한다.", async () => {
    const res = await request(app).delete("/api/cart/items/123");
    expect(res.status).toBe(204);
  });

  test("0 ~ 100개 사이가 아닌 수량을 수정하려 하면 400 에러가 발생한다.", async () => {
    const res = await request(app)
      .patch("/api/cart/items/123/")
      .send({ quantity: 101 })
      .set("Accept", "application/json");
    expect(res.status).toBe(400);
    expect(res.body).toEqual({
      code: "BAD_REQUEST",
      message: "요청 데이터가 유효하지 않습니다.",
      errors: {
        quantity: {
          code: "INVALID_NUMBER_RANGE",
          message: "수량은 0 이상 100 이하여야 합니다.",
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
