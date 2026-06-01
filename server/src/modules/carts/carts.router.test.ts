import express from "express";
import request from "supertest";

import { cartStore } from "../../raw/raw.carts.ts";
import cartsRouter from "./carts.router.ts";

const initialCarts = [
  {
    id: 1,
    products: [
      {
        id: 1,
        quantity: 2,
      },
      {
        id: 3,
        quantity: 1,
      },
    ],
  },
  {
    id: 2,
    products: [
      {
        id: 2,
        quantity: 1,
      },
    ],
  },
];

const cartResponse = {
  id: 1,
  products: [
    {
      id: 1,
      price: 18000,
      name: "Shopping Basket",
      imgUrl: "https://example.com/images/shopping-basket.png",
      quantity: 2,
    },
    {
      id: 3,
      price: 9900,
      name: "Reusable Cup",
      imgUrl: "https://example.com/images/reusable-cup.png",
      quantity: 1,
    },
  ],
};

const app = express();
app.use(express.json());
app.use("/carts", cartsRouter);

describe("carts router 테스트", () => {
  beforeEach(() => {
    cartStore.reset();
  });

  describe("GET /carts/:cartId", () => {
    it("cartId에 해당하는 장바구니 상품 목록을 반환한다.", async () => {
      const response = await request(app).get("/carts/1");

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        status: 200,
        data: cartResponse,
      });
    });

    it("존재하지 않는 cartId로 조회하면 실패 응답을 반환한다.", async () => {
      const response = await request(app).get("/carts/999");

      expect(response.status).toBe(404);
      expect(response.body).toEqual({
        status: 404,
        errorCode: "RESOURCE_NOT_FOUND",
        errorMessage: "id에 해당하는 장바구니가 존재하지 않습니다.",
      });
    });
  });

  describe("PATCH /carts/:cartId/products/:productId", () => {
    it("장바구니 상품 수량을 변경한다.", async () => {
      const response = await request(app)
        .patch("/carts/1/products/1")
        .send({ quantity: 3 });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        status: 200,
        data: {
          id: 1,
          price: 18000,
          name: "Shopping Basket",
          imgUrl: "https://example.com/images/shopping-basket.png",
          quantity: 3,
        },
      });
      expect(cartStore.carts[0].products).toContainEqual({
        id: 1,
        quantity: 3,
      });
    });

    it("quantity가 누락되면 실패 응답을 반환한다.", async () => {
      const response = await request(app).patch("/carts/1/products/1").send({});

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        status: 400,
        errorCode: "MISSING_FIELD",
        errorMessage: "필수값이 누락되었습니다.",
        data: [
          {
            type: "quantity",
            errorCode: "MISSING_FIELD_QUANTITY",
          },
        ],
      });
    });

    it("존재하지 않는 cartId 또는 productId면 실패 응답을 반환한다.", async () => {
      const response = await request(app)
        .patch("/carts/1/products/999")
        .send({ quantity: 3 });

      expect(response.status).toBe(404);
      expect(response.body).toEqual({
        status: 404,
        errorCode: "RESOURCE_NOT_FOUND",
        errorMessage: "id에 해당하는 장바구니 상품이 존재하지 않습니다.",
      });
    });
  });

  describe("DELETE /carts/:cartId/products/:productId", () => {
    it("cartId와 productId에 해당하는 장바구니 상품을 제거한다.", async () => {
      const response = await request(app).delete("/carts/1/products/3");

      expect(response.status).toBe(204);
      expect(response.body).toEqual({});
      expect(cartStore.carts[0].products).not.toContainEqual({
        id: 3,
        quantity: 1,
      });
    });

    it("존재하지 않는 cartId 또는 productId면 실패 응답을 반환한다.", async () => {
      const response = await request(app).delete("/carts/1/products/999");

      expect(response.status).toBe(404);
      expect(response.body).toEqual({
        status: 404,
        errorCode: "RESOURCE_NOT_FOUND",
        errorMessage: "id에 해당하는 장바구니 상품이 존재하지 않습니다.",
      });
    });
  });
});
