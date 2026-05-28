import request from "supertest";
import { createApp } from "../src/app.js";

const data_1 = {
  name: "상품이름A",
  img: "/src.com",
  price: 35000,
};
const data_2 = {
  name: "상품이름B",
  img: "/src.com",
  price: 25000,
};

describe("GET /products  : ", () => {
  it("Success-status:200 상품들의 정보를 정보를 모두 가져옴", async () => {
    const testDb = {
      PRODUCT_TABLE: new Map(),
      CART_TABLE: new Map(),
    };
    testDb.PRODUCT_TABLE.set(1, data_1);
    testDb.PRODUCT_TABLE.set(2, data_2);

    const app = createApp(testDb);
    const response = await request(app).get("/products").expect(200);
    expect(response.body).toEqual({
      result: "success",
      data: {
        products: [
          {
            id: 1,
            name: "상품이름A",
            img: "/src.com",
            price: 35000,
          },
          {
            id: 2,
            name: "상품이름B",
            img: "/src.com",
            price: 25000,
          },
        ],
      },
    });
  });
});

describe("GET 테스트 /products/:productId  ", () => {
  it("Success-status:200 상품 아이디로 정보를 가져올수있음", async () => {
    const testDb = {
      PRODUCT_TABLE: new Map(),
      CART_TABLE: new Map(),
    };
    testDb.PRODUCT_TABLE.set(1, data_1);
    testDb.PRODUCT_TABLE.set(2, data_2);

    const app = createApp(testDb);
    const response = await request(app).get("/products/1").expect(200);
    expect(response.body).toEqual({
      result: "success",
      data: {
        id: 1,
        name: "상품이름A",
        img: "/src.com",
        price: 35000,
      },
    });
  });

  it("Error-status:400 id를 숫자로 변경할 수 없을 때", async () => {
    const testDb = {
      PRODUCT_TABLE: new Map(),
      CART_TABLE: new Map(),
    };

    const app = createApp(testDb);

    const response = await request(app).get("/products/abc").expect(400);
    expect(response.body).toEqual({
      result: "error",
      message: "해당하는 상품의 id 형식이 유효하지 않습니다.",
    });
  });

  it("Error-status:404 상품 아이디가 존재하지않음", async () => {
    const testDb = {
      PRODUCT_TABLE: new Map(),
      CART_TABLE: new Map(),
    };

    const app = createApp(testDb);
    const response = await request(app).get("/products/3").expect(404);
    expect(response.body).toEqual({
      result: "error",
      message: "해당하는 상품이 없습니다.",
    });
  });
});

// 생성 테스트
describe("POST /products", () => {
  it("Success-status:201 상품 정보를 등록한다", async () => {
    const testDb = { PRODUCT_TABLE: new Map(), CART_TABLE: new Map() };
    const app = createApp(testDb);

    const response = await request(app)
      .post("/products")
      .type("json")
      .send({
        name: "상품이름A",
        img: "/src.com",
        price: 35000,
      })
      .expect(201);

    expect(response.body).toEqual({
      name: "상품이름A",
      img: "/src.com",
      price: 35000,
    });

    expect(testDb.PRODUCT_TABLE.size).toBe(1);
  });

  it("Error-status:400 필수 입력 유효성 검증 실패 시 필드 에러 메세지를 반환한다", async () => {
    const testDb = { PRODUCT_TABLE: new Map(), CART_TABLE: new Map() };
    const app = createApp(testDb);

    const response = await request(app)
      .post("/products")
      .type("json")
      .send({
        name: "",
        price: -100,
        img: "error",
      })
      .expect(400);

    expect(response.body).toEqual({
      result: "error",
      message: "요청 값이 올바르지 않습니다.",
      errors: [
        {
          field: "name",
          code: "INVALID_PRODUCT_NAME",
          message: "상품 이름이 유효하지 않습니다.",
        },
        {
          field: "price",
          code: "INVALID_PRODUCT_PRICE",
          message: "상품 가격이 유효하지 않습니다.",
        },
        {
          field: "imageUrl",
          code: "PRODUCT_IMAGE_URL_INVALID",
          message: "유효한 이미지 URL 형식이 아닙니다.",
        },
      ],
    });
  });
});

//삭제 테스트 임
describe("DELETE /products/:productId", () => {
  it("Success-status:204 특정 상품을 삭제한다 (No Content)", async () => {
    const testDb = {
      PRODUCT_TABLE: new Map(),
      CART_TABLE: new Map(),
    };
    testDb.PRODUCT_TABLE.set(1, data_1);
    const app = createApp(testDb);

    const response = await request(app).delete("/products/1").expect(204);
    expect(response.body).toEqual({});
    expect(testDb.PRODUCT_TABLE.has(1)).toBe(false);
  });

  it("Success-status:204 존재하지 않는 id에도 멱등성을 위해 204를 반환한다", async () => {
    const testDb = {
      PRODUCT_TABLE: new Map(),
      CART_TABLE: new Map(),
    };
    const app = createApp(testDb);

    const response = await request(app).delete("/products/999").expect(204);
    expect(response.body).toEqual({});
    expect(testDb.PRODUCT_TABLE.has(1)).toBe(false);
  });
});
