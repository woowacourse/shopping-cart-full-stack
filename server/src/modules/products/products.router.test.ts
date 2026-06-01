import express from "express";
import request from "supertest";

import { productStore } from "../../raw/raw.products.ts";
import productsRouter from "./products.router.ts";

const initialProducts = [
  {
    id: 1,
    price: 18000,
    name: "Shopping Basket",
    imgUrl: "https://example.com/images/shopping-basket.png",
  },
  {
    id: 2,
    price: 32000,
    name: "Tote Bag",
    imgUrl: "https://example.com/images/tote-bag.png",
  },
  {
    id: 3,
    price: 9900,
    name: "Reusable Cup",
    imgUrl: "https://example.com/images/reusable-cup.png",
  },
];

const app = express();
app.use(express.json());
app.use("/products", productsRouter);

describe("product router 테스트", () => {
  beforeEach(() => {
    productStore.reset();
  });

  describe("GET /products", () => {
    it("상품 리스트를 반환한다.", async () => {
      const response = await request(app).get("/products");

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        status: 200,
        data: initialProducts,
      });
    });
  });

  describe("POST /products", () => {
    it("상품을 생성한다.", async () => {
      const product = {
        price: 25000,
        name: "Eco Bag",
        imgUrl: "https://example.com/images/eco-bag.png",
      };

      const response = await request(app).post("/products").send(product);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        status: 200,
        data: {
          id: 4,
          ...product,
        },
      });
    });

    it("필수값이 누락된 경우 실패 응답을 반환한다.", async () => {
      const response = await request(app).post("/products").send({
        price: 25000,
        name: "Eco Bag",
      });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        status: 400,
        errorCode: "MISSING_FIELD",
        errorMessage: "필수값이 누락되었습니다.",
        data: [
          {
            type: "imgUrl",
            errorCode: "MISSING_FIELD_IMGURL",
          },
        ],
      });
    });

    it("타입이 일치하지 않는 경우 실패 응답을 반환한다.", async () => {
      const response = await request(app).post("/products").send({
        price: "25000",
        name: "Eco Bag",
        imgUrl: "https://example.com/images/eco-bag.png",
      });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        status: 400,
        errorCode: "TYPE_MISMATCH",
        errorMessage: "타입이 일치하지 않습니다.",
      });
    });

    it("도메인 규칙에 맞지 않는 경우 실패 응답을 반환한다.", async () => {
      const response = await request(app)
        .post("/products")
        .send({
          price: 0,
          name: "a".repeat(101),
          imgUrl: "https://example.com/images/eco-bag.png",
        });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        status: 400,
        errorCode: "INVALID",
        errorMessage: "도메인 규칙에 맞지 않는 값입니다.",
        data: [
          {
            type: "price",
            errorCode: "INVALID_PRICE",
          },
          {
            type: "name",
            errorCode: "INVALID_NAME",
          },
        ],
      });
    });
  });

  describe("DELETE /products/:id", () => {
    it("id에 해당하는 상품을 삭제한다.", async () => {
      const response = await request(app).delete("/products/1");

      expect(response.status).toBe(204);
      expect(response.body).toEqual({});
      expect(productStore.products).not.toContainEqual(initialProducts[0]);
    });

    it("id에 해당하는 상품이 없으면 실패 응답을 반환한다.", async () => {
      const response = await request(app).delete("/products/999");

      expect(response.status).toBe(404);
      expect(response.body).toEqual({
        status: 404,
        errorCode: "RESOURCE_NOT_FOUND",
        errorMessage: "id에 해당하는 상품이 존재하지 않습니다.",
      });
    });
  });
});
