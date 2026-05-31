import request from "supertest";
import app from "../../src/app";
import { describe, expect, test } from "@jest/globals";

import {
  addProductToList,
  getAllProducts,
} from "../../src/service/productService";
import { updateQuantityOfItem } from "../../src/service/shoppingCartService";
import { beforeEach } from "@jest/globals";
import {
  cartRepository,
  productRepository,
} from "../../src/database/inMemoryDatabase";

beforeEach(() => {
  productRepository.clear();
  cartRepository.clear();
});

describe("유효하지 않은 경로 테스트", () => {
  test("잘못된 경로로 상품 GET 요청 시 에러 처리한다.", async () => {
    const response = await request(app).get("/products1");
    expect(response.status).toBe(404);
  });

  test("잘못된 경로로 상품 DELETE 요청 시 에러 처리한다.", async () => {
    const response = await request(app).delete("/products/a");
    expect(response.status).toBe(404);
  });

  test("잘못된 경로로 상품 POST 요청 시 에러 처리한다.", async () => {
    const data = {
      name: "test",
      price: 1000,
      image: "example/com",
    };

    const response = await request(app).post("/products1").send(data);
    expect(response.status).toBe(404);
  });

  test("잘못된 경로로 장바구니 GET 요청 시 에러 처리한다.", async () => {
    const response = await request(app).get("/carts1");
    expect(response.status).toBe(404);
  });

  test("잘못된 경로로 장바구니 PATCH 요청 시 에러 처리한다.", async () => {
    const response = await request(app).patch("/carts1/1");
    expect(response.status).toBe(404);
  });

  test("잘못된 경로로 장바구니 DELETE 요청 시 에러 처리한다.", async () => {
    const response = await request(app).delete("/carts1/1");
    expect(response.status).toBe(404);
  });
});

describe("유효하지 않은 POST 형식 테스트", () => {
  test("빈 이름으로 POST 요청 시 예외 처리한다.", async () => {
    const data = {
      name: "",
      price: 1000,
    };
    const response = await request(app).post("/products").send(data);

    expect(response.status).toBe(400);
  });

  test("가격이 누락된 POST 요청 시 예외 처리한다.", async () => {
    const data = {
      name: "test",
    };
    const response = await request(app).post("/products").send(data);

    expect(response.status).toBe(400);
  });

  test("상품명이 100자 초과이면 POST 요청 시 예외 처리한다.", async () => {
    const data = {
      name: "a".repeat(104),
      price: 1000,
    };
    const response = await request(app).post("/products").send(data);

    expect(response.status).toBe(400);
  });

  test("가격이 0 이하로 POST 요청 시 예외 처리한다.", async () => {
    const data = {
      name: "test",
      price: 0,
    };
    const response = await request(app).post("/products").send(data);

    expect(response.status).toBe(400);
  });

  test("가격이 숫자 아닌 상태로 POST 요청 시 예외 처리한다.", async () => {
    const data = {
      name: "test",
      price: "test",
    };
    const response = await request(app).post("/products").send(data);

    expect(response.status).toBe(400);
  });

  // 5. 중복된 상품명이면 400을 응답한다.
  test("중복된 상품명이 있는 상품을 POST 요청 시 예외 처리한다.", async () => {
    const productData1 = {
      name: "test",
      price: 1000,
      image: "example/com",
    };
    const productData2 = {
      name: "test",
      price: 1000,
      image: "example/com",
    };
    addProductToList(productData1);
    const response = await request(app).post("/products").send(productData2);

    expect(response.status).toBe(400);
  });

  test("상품 수량이 허용 범위를 벗어난 PATCH 요청 시 예외 처리한다.", async () => {
    const productData = {
      name: "test",
      price: 1000,
      image: "example/com",
    };
    addProductToList(productData);
    const repositoryData = getAllProducts();
    const id = repositoryData[0].id;

    updateQuantityOfItem(id, 10);

    const response = await request(app)
      .patch(`/carts/${id}`)
      .send({ quantity: -2 });

    expect(response.status).toBe(400);
  });
});

describe("구현되지 않은 기능 501 테스트", () => {
  test("아직 구현되지 않은 요청이 들어오면 501을 반환한다.", async () => {
    const response = await request(app).post("/carts");

    expect(response.status).toBe(501);
  });
});
