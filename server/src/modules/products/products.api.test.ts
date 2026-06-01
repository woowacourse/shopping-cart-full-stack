import request from "supertest";
import app from "@/app";
import { CartDB, ProductDB } from "@db/inMemoryDB";

const resetDB = () => {
  ProductDB.clear();
  CartDB.clear();
};

const seedProduct = (overrides: Partial<{ name: string; price: number; image: string }> = {}) => {
  const body = {
    name: overrides.name ?? `상품-${Math.random().toString(36).slice(2, 8)}`,
    price: overrides.price ?? 1000,
    image: overrides.image ?? "https://example.com/img.png",
  };
  return request(app).post("/products").send(body);
};

beforeEach(() => {
  resetDB();
});

describe("GET /products", () => {
  it("빈 목록을 200으로 반환한다", async () => {
    const res = await request(app).get("/products");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      status: "success",
      message: "상품 목록을 정상적으로 조회하였습니다.",
      data: [],
    });
  });

  it("등록된 상품들을 200으로 반환한다", async () => {
    const created = await seedProduct({ name: "아메리카노", price: 4500 });

    const res = await request(app).get("/products");

    expect(res.status).toBe(200);
    expect(res.body.status).toBe("success");
    expect(res.body.data).toHaveLength(1);
    expect(res.body.data[0]).toEqual(created.body.data);
  });
});

describe("POST /products", () => {
  it("정상 요청 시 201과 등록된 상품을 반환한다", async () => {
    const res = await request(app)
      .post("/products")
      .send({ name: "라떼", price: 6000, image: "https://example.com/latte.png" });

    expect(res.status).toBe(201);
    expect(res.body.status).toBe("success");
    expect(res.body.message).toBe("상품을 정상적으로 등록하였습니다.");
    expect(res.body.data).toEqual({
      id: expect.any(Number),
      name: "라떼",
      price: 6000,
      image: "https://example.com/latte.png",
    });
  });

  it("body 형식이 잘못되면 400을 반환한다", async () => {
    const res = await request(app).post("/products").send({ name: "이름만 있음" });

    expect(res.status).toBe(400);
    expect(res.body).toEqual({
      status: "error",
      statusCode: 400,
      code: "INVALID_PRODUCT",
      message: "유효하지 않은 상품입니다.",
    });
  });

  it("name이 빈 문자열이면 400 NAME_REQUIRED를 반환한다", async () => {
    const res = await request(app)
      .post("/products")
      .send({ name: "", price: 1000, image: "https://example.com/x.png" });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("상품명은 필수입니다.");
  });

  it("name이 100자를 초과하면 400 NAME_TOO_LONG을 반환한다", async () => {
    const res = await request(app)
      .post("/products")
      .send({ name: "가".repeat(101), price: 1000, image: "https://example.com/x.png" });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("상품명은 100자 이하여야 합니다.");
  });

  it("price가 0 이하이면 400 PRICE_MUST_BE_POSITIVE를 반환한다", async () => {
    const res = await request(app)
      .post("/products")
      .send({ name: "음수가격", price: 0, image: "https://example.com/x.png" });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("상품 가격은 양수여야 합니다.");
  });

  it("이미 존재하는 상품명이면 409 DUPLICATE_PRODUCT_NAME을 반환한다", async () => {
    await seedProduct({ name: "중복상품" });

    const res = await request(app)
      .post("/products")
      .send({ name: "중복상품", price: 1000, image: "https://example.com/x.png" });

    expect(res.status).toBe(409);
    expect(res.body.message).toBe("이미 존재하는 상품명입니다.");
  });
});

describe("DELETE /products/:id", () => {
  it("정상 요청 시 200과 삭제된 상품 ID를 반환한다", async () => {
    const created = await seedProduct({ name: "삭제대상" });
    const id = created.body.data.id;

    const res = await request(app).delete(`/products/${id}`);

    expect(res.status).toBe(200);
    expect(res.body.status).toBe("success");
    expect(res.body.message).toBe("상품을 정상적으로 삭제하였습니다.");
    expect(res.body.data).toEqual({ id });

    const list = await request(app).get("/products");
    expect(list.body.data.find((p: { id: number }) => p.id === id)).toBeUndefined();
  });

  it("존재하지 않는 상품 ID이면 404 NOT_EXIST_PRODUCT를 반환한다", async () => {
    const res = await request(app).delete("/products/999999");

    expect(res.status).toBe(404);
    expect(res.body.message).toBe("존재하지 않는 상품입니다.");
  });
});
