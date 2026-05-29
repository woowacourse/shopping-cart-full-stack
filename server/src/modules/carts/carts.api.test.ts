import request from "supertest";
import app from "@/app";
import { CartDB, ProductDB } from "@db/inMemoryDB";
import type { Product } from "@/type";

const resetDB = () => {
  ProductDB.clear();
  CartDB.clear();
};

const createProductViaApi = async (overrides: Partial<Omit<Product, "id">> = {}): Promise<Product> => {
  const res = await request(app)
    .post("/products")
    .send({
      name: overrides.name ?? `상품-${Math.random().toString(36).slice(2, 8)}`,
      price: overrides.price ?? 1000,
      image: overrides.image ?? "https://example.com/img.png",
    });
  return res.body.data;
};

const addToCart = (product: Product, quantity: number) => {
  CartDB.set(product.id, { product, quantity });
};

beforeEach(() => {
  resetDB();
});

describe("GET /carts", () => {
  it("장바구니가 비어있으면 200과 빈 목록을 반환한다", async () => {
    const res = await request(app).get("/carts");

    expect(res.status).toBe(200);
    expect(res.body.status).toBe("success");
    expect(res.body.message).toBe("장바구니를 정상적으로 조회하였습니다.");
    expect(res.body.data).toEqual([]);
  });

  it("장바구니에 담긴 항목을 200으로 반환한다", async () => {
    const product = await createProductViaApi({ name: "아메리카노", price: 4500 });
    addToCart(product, 2);

    const res = await request(app).get("/carts");

    expect(res.status).toBe(200);
    expect(res.body.data).toEqual(
      expect.arrayContaining([{ product, quantity: 2 }]),
    );
  });
});

describe("PATCH /carts/:id (장바구니 수량 변경)", () => {
  it("정상 요청 시 200과 변경된 수량을 반환한다", async () => {
    const product = await createProductViaApi({ name: "라떼", price: 6000 });
    addToCart(product, 1);

    const res = await request(app).patch(`/carts/${product.id}`).send({ quantity: 5 });

    expect(res.status).toBe(200);
    expect(res.body.status).toBe("success");
    expect(res.body.message).toBe("장바구니 상품 수량을 정상적으로 변경하였습니다.");
    expect(res.body.data).toEqual({ product, quantity: 5 });
  });

  it("quantity가 누락되면 400 INVALID_CARTS_QUANTITY를 반환한다", async () => {
    const product = await createProductViaApi();
    addToCart(product, 1);

    const res = await request(app).patch(`/carts/${product.id}`).send({});

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("유효하지 않은 장바구니 수량입니다.");
  });

  it("quantity가 범위(1~99)를 벗어나면 400 OUT_OF_RANGE_CARTS_QUANTITY를 반환한다", async () => {
    const product = await createProductViaApi();
    addToCart(product, 1);

    const res = await request(app).patch(`/carts/${product.id}`).send({ quantity: 100 });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("상품 수량은 1~99까지 가능합니다.");
  });

  it("장바구니에 없는 상품 ID이면 404를 반환한다", async () => {
    const res = await request(app).patch("/carts/999999").send({ quantity: 1 });

    expect(res.status).toBe(404);
    expect(res.body.status).toBe("error");
  });
});

describe("DELETE /carts/:id (장바구니 상품 제거)", () => {
  it("정상 요청 시 200과 제거된 ID를 반환한다", async () => {
    const product = await createProductViaApi({ name: "삭제할상품" });
    addToCart(product, 3);

    const res = await request(app).delete(`/carts/${product.id}`);

    expect(res.status).toBe(200);
    expect(res.body.status).toBe("success");
    expect(res.body.message).toBe("장바구니에서 상품을 정상적으로 제거하였습니다.");
    expect(res.body.data).toEqual({ id: product.id });

    const list = await request(app).get("/carts");
    expect(list.body.data).toEqual([]);
  });

  it("장바구니에 없는 상품 ID이면 404 NOT_EXIST_CARTS_PRODUCT를 반환한다", async () => {
    const res = await request(app).delete("/carts/999999");

    expect(res.status).toBe(404);
    expect(res.body.message).toBe("장바구니에 존재하지 않는 상품입니다.");
  });
});
