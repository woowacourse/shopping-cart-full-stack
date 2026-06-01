import request from "supertest";
import createApp from "../app.js";
import type { Express } from "express";

describe("POST /products API 테스트", () => {
  let app: Express;
  beforeEach(() => {
    app = createApp();
  });

  test("정상적인 상품 정보로 요청 시 201과 생성된 id를 응답한다.", async () => {
    // given
    const newProduct = {
      name: "아디다스 양말",
      price: 13000,
      imgUrl: "https://image-url.com",
      quantity: 2,
    };

    // when
    const response = await request(app).post("/products").send(newProduct);

    // then
    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      message: "성공적으로 생성되었습니다.",
      result: { id: expect.any(Number) },
    });
  });

  test("상품명이 100자를 초과하면 400과 PRODUCT_NAME_LENGTH_EXCEEDED 코드를 응답한다.", async () => {
    // given
    const invalidProduct = {
      name: "a".repeat(101),
      price: 13000,
      imgUrl: "https://image-url.com",
      quantity: 2,
    };

    // when
    const response = await request(app).post("/products").send(invalidProduct);

    // then
    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      code: "PRODUCT_NAME_LENGTH_EXCEEDED",
      message: "상품명은 100자를 초과할 수 없습니다.",
    });
  });

  test("가격이 0 이하이면 400과 INVALID_PRODUCT_PRICE_TYPE 코드를 응답한다.", async () => {
    // given
    const invalidProduct = {
      name: "아디다스 양말",
      price: 0,
      imgUrl: "https://image-url.com",
      quantity: 2,
    };

    // when
    const response = await request(app).post("/products").send(invalidProduct);

    // then
    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      code: "INVALID_PRODUCT_PRICE_TYPE",
      message: "가격은 0보다 큰 숫자여야 합니다.",
    });
  });

  test("재고 수량이 범위(1~99)를 벗어나면 400과 INVALID_PRODUCT_QUANTITY_RANGE 코드를 응답한다.", async () => {
    // given
    const invalidProduct = {
      name: "아디다스 양말",
      price: 13000,
      imgUrl: "https://image-url.com",
      quantity: 100,
    };

    // when
    const response = await request(app).post("/products").send(invalidProduct);

    // then
    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      code: "INVALID_PRODUCT_QUANTITY_RANGE",
      message: "상품 재고는 1이상 99이하의 정수이어야 합니다.",
    });
  });

  test("상품명 필드가 누락되면 400과 EMPTY_PRODUCT_NAME 코드를 응답한다.", async () => {
    // given
    const invalidProduct = {
      price: 13000,
      imgUrl: "https://image-url.com",
      quantity: 2,
    };

    // when
    const response = await request(app).post("/products").send(invalidProduct);

    // then
    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      code: "EMPTY_PRODUCT_NAME",
      message: "상품명 필드가 누락되었습니다.",
    });
  });

  test("상품 가격 필드가 누락되면 400과 EMPTY_PRODUCT_PRICE 코드를 응답한다.", async () => {
    // given
    const invalidProduct = {
      name: "아디다스 양말",
      imgUrl: "https://image-url.com",
      quantity: 2,
    };

    // when
    const response = await request(app).post("/products").send(invalidProduct);

    // then
    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      code: "EMPTY_PRODUCT_PRICE",
      message: "가격 필드가 누락되었습니다.",
    });
  });

  test("재고 수량 필드가 누락되면 400과 EMPTY_PRODUCT_QUANTITY 코드를 응답한다.", async () => {
    // given
    const invalidProduct = {
      name: "아디다스 양말",
      price: 13000,
      imgUrl: "https://image-url.com",
    };

    // when
    const response = await request(app).post("/products").send(invalidProduct);

    // then
    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      code: "EMPTY_PRODUCT_QUANTITY",
      message: "상품 재고 필드가 누락되었습니다.",
    });
  });
});

describe("DELETE /products API 테스트", () => {
  let deleteId = 0;
  let app: Express;
  beforeEach(async () => {
    app = createApp();
    const newProduct = {
      name: "아디다스 양말",
      price: 13000,
      imgUrl: "https://image-url.com",
      quantity: 2,
    };
    const productResponse = await request(app)
      .post("/products")
      .send(newProduct);

    deleteId = productResponse.body.result.id;
  });

  test("정상적인 상품 삭제 시 204를 응답한다.", async () => {
    // when
    const response = await request(app).delete(`/products/${deleteId}`);

    // then
    expect(response.status).toBe(204);
  });

  test("존재하지 않는 상품 삭제 시 404와 PRODUCT_NOT_EXIST 코드를 응답한다.", async () => {
    const wrongDeleteId = 999999999;
    // when
    const response = await request(app).delete(`/products/${wrongDeleteId}`);

    // then
    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      code: "PRODUCT_NOT_EXIST",
      message: "상품이 존재하지 않습니다.",
    });
  });
});

describe("GET /products API 테스트", () => {
  let app: Express;
  beforeEach(() => {
    app = createApp();
  });

  test("상품 조회 시 200과 상품 목록을 응답한다.", async () => {
    // given
    const newProduct = {
      name: "아디다스 양말",
      price: 13000,
      imgUrl: "https://image-url.com",
      quantity: 2,
    };
    const productResponse = await request(app)
      .post("/products")
      .send(newProduct);

    // when
    const response = await request(app).get(`/products`);

    // then
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      code: 200,
      message: "요청에 성공했습니다.",
      result: {
        products: [{ ...newProduct, id: productResponse.body.result.id }],
      },
    });
  });
});

describe("GET /carts/:cartId/items API 테스트", () => {
  let app: Express;
  let cartId = 0;

  beforeEach(async () => {
    app = createApp();

    const cartResponse = await request(app).post("/carts");
    cartId = cartResponse.body.result.id;
  });

  test("장바구니 상품 조회 시 200과 상품 목록을 응답한다.", async () => {
    // given
    const newProduct = {
      name: "아디다스 양말",
      price: 13000,
      imgUrl: "https://image-url.com",
      quantity: 20,
    };
    const productResponse = await request(app)
      .post("/products")
      .send(newProduct);
    const productId = productResponse.body.result.id;

    const newCartItem = {
      productId,
      itemCount: 10,
    };
    await request(app).post(`/carts/${cartId}/items`).send(newCartItem);

    // when
    const response = await request(app).get(`/carts/${cartId}/items`);

    // then
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      code: 200,
      message: "요청에 성공했습니다.",
      result: {
        cartItems: [
          {
            id: productId,
            name: "아디다스 양말",
            price: 13000,
            imgUrl: "https://image-url.com",
            itemCount: 10,
          },
        ],
      },
    });
  });

  test("존재하지 않는 장바구니 조회 시 404와 CART_NOT_EXIST 코드를 응답한다.", async () => {
    // given
    const wrongCartId = 999999999;

    // when
    const response = await request(app).get(`/carts/${wrongCartId}/items`);

    // then
    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      code: "CART_NOT_EXIST",
      message: "장바구니가 존재하지 않습니다.",
    });
  });
});

describe("DELETE /carts/:cartId/items/:productId API 테스트", () => {
  let app: Express;
  let cartId = 0;
  let deleteId = 0;

  beforeEach(async () => {
    app = createApp();

    const cartResponse = await request(app).post("/carts");
    cartId = cartResponse.body.result.id;

    const newProduct = {
      name: "아디다스 양말",
      price: 13000,
      imgUrl: "https://image-url.com",
      quantity: 20,
    };
    const productResponse = await request(app)
      .post("/products")
      .send(newProduct);
    const productId = productResponse.body.result.id;

    const newCartItem = {
      productId,
      itemCount: 10,
    };
    await request(app).post(`/carts/${cartId}/items`).send(newCartItem);

    deleteId = productId;
  });

  test("장바구니 상품 삭제 시 204를 응답한다.", async () => {
    // when
    const response = await request(app).delete(
      `/carts/${cartId}/items/${deleteId}`,
    );

    // then
    expect(response.status).toBe(204);
  });

  test("장바구니에 존재하지 않는 상품 삭제 시 404와 PRODUCT_NOT_EXIST_IN_CART 코드를 응답한다.", async () => {
    const wrongDeleteId = 999999999;

    // when
    const response = await request(app).delete(
      `/carts/${cartId}/items/${wrongDeleteId}`,
    );

    // then
    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      code: "PRODUCT_NOT_EXIST_IN_CART",
      message: "해당 상품이 장바구니에 존재하지 않습니다.",
    });
  });
});

describe("PATCH /carts/:cartId/items/:productId API 테스트", () => {
  let updateId = 0;
  let app: Express;
  let cartId = 0;

  beforeEach(async () => {
    app = createApp();

    const cartResponse = await request(app).post("/carts");
    cartId = cartResponse.body.result.id;

    const newProduct = {
      name: "아디다스 양말",
      price: 13000,
      imgUrl: "https://image-url.com",
      quantity: 20,
    };
    const productResponse = await request(app)
      .post("/products")
      .send(newProduct);
    const productId = productResponse.body.result.id;

    const newCartItem = {
      productId,
      itemCount: 10,
    };
    await request(app).post(`/carts/${cartId}/items`).send(newCartItem);

    updateId = productId;
  });

  test("장바구니 상품 수량 변경 성공 시 200과 id, itemCount를 응답한다.", async () => {
    // given
    const updateItemCount = 5;

    // when
    const response = await request(app)
      .patch(`/carts/${cartId}/items/${updateId}`)
      .send({
        itemCount: updateItemCount,
      });

    // then
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      code: 200,
      message: "성공적으로 수량이 변경되었습니다.",
      result: {
        id: updateId,
        itemCount: updateItemCount,
      },
    });
  });

  test("변경하고자 하는 수량이 0보다 큰 숫자가 아닌 경우 400과 INVALID_PRODUCT_ORDER_COUNT_TYPE 코드를 응답한다.", async () => {
    // given
    const updateItemCount = "asd";

    // when
    const response = await request(app)
      .patch(`/carts/${cartId}/items/${updateId}`)
      .send({
        itemCount: updateItemCount,
      });

    // then
    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      code: "INVALID_PRODUCT_ORDER_COUNT_TYPE",
      message: "변경할 수량은 0보다 큰 숫자여야 합니다.",
    });
  });

  test("보유한 상품의 개수를 넘어 장바구니에 담는 경우 400과 PRODUCT_ORDER_COUNT_EXCEEDED 코드를 응답한다.", async () => {
    // given
    const overUpdateItemCount = 999;

    // when
    const response = await request(app)
      .patch(`/carts/${cartId}/items/${updateId}`)
      .send({
        itemCount: overUpdateItemCount,
      });

    // then
    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      code: "PRODUCT_ORDER_COUNT_EXCEEDED",
      message: "보유한 상품의 개수를 넘어섰습니다.",
    });
  });

  test("수량 필드가 누락된 경우 400과 EMPTY_PRODUCT_ORDER_COUNT 코드를 응답한다.", async () => {
    // when
    const response = await request(app)
      .patch(`/carts/${cartId}/items/${updateId}`)
      .send({
        itemCount: null,
      });

    // then
    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      code: "EMPTY_PRODUCT_ORDER_COUNT",
      message: "주문 수량 필드가 누락되었습니다.",
    });
  });

  test("장바구니에 존재하지 않는 상품의 수량을 변경하면 404와 PRODUCT_NOT_EXIST_IN_CART 코드를 응답한다.", async () => {
    // given
    const anotherProduct = {
      name: "나이키 양말",
      price: 15000,
      imgUrl: "https://image-url.com",
      quantity: 20,
    };

    const anotherProductResponse = await request(app)
      .post("/products")
      .send(anotherProduct);

    const notInCartProductId = anotherProductResponse.body.result.id;
    const updateItemCount = 5;

    // when
    const response = await request(app)
      .patch(`/carts/${cartId}/items/${notInCartProductId}`)
      .send({
        itemCount: updateItemCount,
      });

    // then
    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      code: "PRODUCT_NOT_EXIST_IN_CART",
      message: "해당 상품이 장바구니에 존재하지 않습니다.",
    });
  });
});
