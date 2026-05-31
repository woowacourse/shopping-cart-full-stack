import express from "express";
import request from "supertest";
import { BodyForTest, TestDB } from "./testDB";
import { createCartRouter } from "../src/routes/cart";

const app = express();
app.use(express.json());
app.use("/cart", createCartRouter(TestDB));

const initialCart = TestDB.Cart!.map((product) => ({ ...product }));

beforeEach(() => {
  TestDB.Cart = initialCart.map((p) => ({ ...p }));
});

describe("GET /cart", function () {
  it("응답 body의 json의 길이는 1이며, 응답 코드는 200 OK 이다.", async function () {
    const response = await request(app).get("/cart").set("Accept", "application/json");

    expect(response.status).toBe(200);
    expect(response.body.length).toBe(1);
  });

  it("CART 테이블에 존재하지 않으면 500 에러", async function () {
    TestDB.Cart = undefined;

    const response = await request(app).get("/cart").set("Accept", "application/json");

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ errorMessage: "서버에 일시적인 오류가 발생했습니다." });
  });
});

describe("POST /cart/:id", function () {
  it("새로운 상품이 등록되고, 응답 코드는 201 Created 이다.", async function () {
    const response = await request(app).post("/cart/1").set("Accept", "application/json");

    expect(response.status).toBe(201);
  });

  it("CART 테이블에 존재하지 않으면 500 에러", async function () {
    TestDB.Cart = undefined;

    const response = await request(app).post("/cart/1").set("Accept", "application/json");

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ errorMessage: "서버에 일시적인 오류가 발생했습니다." });
  });

  it("존재하지 않는 상품 id로 추가하면 404 에러이며, 장바구니에 추가되지 않는다.", async function () {
    const beforeLength = TestDB.Cart!.length;
    const response = await request(app).post("/cart/999").set("Accept", "application/json");

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ errorMessage: "상품을 찾을 수 없습니다." });
    expect(TestDB.Cart!.length).toBe(beforeLength);
  });
});

const productInCart: BodyForTest = {
  id: 1,
  imageUrl: "https://example.com/nike.jpg",
  name: "Nike Air Max",
  price: 1200000,
  quantity: 2,
};

const productToBeUpdated: BodyForTest = {
  id: productInCart.id,
  imageUrl: productInCart.imageUrl,
  name: productInCart.name,
  price: productInCart.price,
  quantity: 4,
};

describe("PUT /cart", function () {
  it("상품의 수량이 변경되고, 응답 코드는 204 OK 이다.", async function () {
    const response = await request(app).put("/cart").send(productToBeUpdated).set("Accept", "application/json");

    expect(response.status).toBe(204);
  });
  it("CART 테이블에 존재하지 않으면 500 에러", async function () {
    TestDB.Cart = undefined;

    const response = await request(app).put("/cart").send(productToBeUpdated).set("Accept", "application/json");

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ errorMessage: "서버에 일시적인 오류가 발생했습니다." });
  });
  it("해당 id가 DB에 존재하지 않는다면 404 에러", async function () {
    const idChangedProduct = { ...productToBeUpdated };
    idChangedProduct.id = 2;
    const response = await request(app).put("/cart").send(idChangedProduct).set("Accept", "application/json");

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ errorMessage: "상품을 찾을 수 없습니다." });
  });
  it("잘못된 요청이 들어오면 400 에러", async function () {
    const invalidProduct = { ...productToBeUpdated };
    invalidProduct.quantity = 0;
    const response = await request(app).put("/cart").send(invalidProduct).set("Accept", "application/json");
    expect(response.status).toBe(400);
    expect(response.body).toEqual({ errorMessage: "quantity는 1 이상 99 이하의 정수여야 합니다." });
  });
});

describe("DELETE /cart/:id", function () {
  it("상품이 삭제되면 장바구니에서 빠지고, 응답 코드는 204 OK 이다.", async function () {
    const beforeLength = TestDB.Cart!.length;
    const response = await request(app).delete("/cart/1").set("Accept", "application/json");

    expect(response.status).toBe(204);
    expect(TestDB.Cart!.length).toBe(beforeLength - 1);
    expect(TestDB.Cart!.find((product) => product.id === 1)).toBeUndefined();
  });
  it("해당 id가 DB에 존재하지 않는다면 404 에러", async function () {
    const response = await request(app).delete("/cart/2").set("Accept", "application/json");
    expect(response.status).toBe(404);
    expect(response.body).toEqual({ errorMessage: "상품을 찾을 수 없습니다." });
  });
});
