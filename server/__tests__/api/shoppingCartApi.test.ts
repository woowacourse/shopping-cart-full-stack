import request from "supertest";
import app from "../../src/app";
import { describe, expect, test } from "@jest/globals";
import {
  getAllProducts,
  addProductToList,
} from "../../src/service/productService";
import {
  addItemToCart,
  updateQuantityOfItem,
  getItemsFromCart,
} from "../../src/service/shoppingCartService";
import { beforeEach } from "node:test";
import { cartRepository } from "../../src/database/inMemoryDatabase";

beforeEach(() => {
  cartRepository.clear();
});

describe("장바구니 상품 API 테스트", () => {
  test("클라이언트가 GET 요청 시 장바구니 상품 목록을 받아온다.", async () => {
    const productData = {
      name: "test",
      price: 1000,
      image: "example/com",
    };
    addProductToList(productData);
    const repositoryData = getAllProducts();

    addItemToCart(repositoryData[0].id, 3);

    const response = await request(app).get("/carts");

    expect(response.status).toBe(200);
    expect(response.body).toEqual([
      {
        product: { id: repositoryData[0].id, ...productData },
        quantity: 3,
      },
    ]);
  });

  test("클라이언트가 PATCH 요청 시 상품 수량을 변경한다", async () => {
    const id = getAllProducts()[0].id;

    updateQuantityOfItem(id, 4);

    const response = await request(app)
      .patch(`/carts/${id}`)
      .send({ quantity: 4 });

    expect(response.status).toBe(204);
    expect(getItemsFromCart()[0].quantity).toBe(4);
  });

  test("클라이언트가 DELETE 요청 시 해당 상품을 삭제한다.", async () => {
    const id = getAllProducts()[0].id;

    const response = await request(app).delete(`/carts/${id}`);

    expect(response.status).toBe(204);
    expect(getItemsFromCart()).toEqual([]);
  });
});
