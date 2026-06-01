import request from "supertest";
import { createApp } from "../src/app.js";
import { type InMemoryDB } from "../src/db/in-memory-db.js";
import InMemoryProductRepository from "../src/features/product/product.repository.js";
import ProductService from "../src/features/product/product.service.js";
import DeleteProductUseCase from "../src/features/product/delete-product.usecase.js";
import ProductController from "../src/features/product/product.controller.js";
import InMemoryCartRepository from "../src/features/cart/cart.repository.js";
import CartService from "../src/features/cart/cart.service.js";
import CartController from "../src/features/cart/cart.controller.js";

const testDB = (): InMemoryDB => ({
  PRODUCT_TABLE: [],
  CART_TABLE: [],
});

const data_1 = {
  id: 1,
  name: "상품이름A",
  imgUrl: "https://src.com/image.png",
  price: 35000,
};
const data_2 = {
  id: 2,
  name: "상품이름B",
  imgUrl: "https://src.com/image.png",
  price: 25000,
};

const createTestApp = (testDb: InMemoryDB) => {
  const productRepository = new InMemoryProductRepository(testDb);
  const productService = new ProductService(productRepository);

  const cartRepository = new InMemoryCartRepository(testDb);
  const cartService = new CartService(cartRepository);

  const deleteProductUseCase = new DeleteProductUseCase(productService, cartService);
  const productController = new ProductController(productService, deleteProductUseCase);

  const cartController = new CartController(cartService);

  return createApp({ productController, cartController });
};

describe("Products API", () => {
  let testDb: InMemoryDB;

  beforeEach(() => {
    testDb = testDB();
  });

  describe("GET /products", () => {
    it("Success-status:200 상품들의 정보를 모두 가져옴", async () => {
      testDb.PRODUCT_TABLE.push(data_1);
      testDb.PRODUCT_TABLE.push(data_2);

      const app = createTestApp(testDb);
      const response = await request(app).get("/products").expect(200);
      expect(response.body).toEqual({
        result: "success",
        data: {
          products: [
            {
              id: 1,
              name: "상품이름A",
              imgUrl: "https://src.com/image.png",
              price: 35000,
            },
            {
              id: 2,
              name: "상품이름B",
              imgUrl: "https://src.com/image.png",
              price: 25000,
            },
          ],
        },
      });
    });
  });

  describe("GET /products/:productId", () => {
    it("Success-status:200 상품 아이디로 정보를 가져올수있음", async () => {
      testDb.PRODUCT_TABLE.push(data_1);

      const app = createTestApp(testDb);
      const response = await request(app).get("/products/1").expect(200);
      expect(response.body).toEqual({
        result: "success",
        data: {
          ...data_1,
        },
      });
    });

    it("Error-status:400 id를 숫자로 변경할 수 없을 때", async () => {
      const app = createTestApp(testDb);
      await request(app).get("/products/abc").expect(400);
    });

    it("Error-status:404 상품 아이디가 존재하지않음", async () => {
      const app = createTestApp(testDb);
      await request(app).get("/products/3").expect(404);
    });
  });

  describe("POST /products", () => {
    it("Success-status:201 상품 정보를 등록한다", async () => {
      const app = createTestApp(testDb);
      await request(app)
        .post("/products")
        .type("json")
        .send({
          name: "상품이름A",
          imgUrl: "https://example.com/image.jpg",
          price: 35000,
        })
        .expect(201);

      expect(testDb.PRODUCT_TABLE.length).toBe(1);
    });

    it("Error-status:400 필수 입력 유효성 검증 실패 시 필드 에러 메세지를 반환한다", async () => {
      const app = createTestApp(testDb);
      const response = await request(app)
        .post("/products")
        .type("json")
        .send({ name: "", price: -100, imgUrl: "error" })
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
            field: "imgUrl",
            code: "INVALID_PRODUCT_IMAGE_URL",
            message: "유효한 이미지 URL 형식이 아닙니다.",
          },
        ],
      });
    });
  });

  describe("DELETE /products/:productId", () => {
    it("Success-status:204 특정 상품을 삭제한다 (No Content)", async () => {
      testDb.PRODUCT_TABLE.push(data_1);

      const app = createTestApp(testDb);
      const response = await request(app).delete("/products/1").expect(204);
      expect(response.body).toEqual({});
      expect(testDb.PRODUCT_TABLE.find((p) => p.id === 1)).toBeUndefined();
    });

    it("Success-status:204 특정 상품을 삭제 시 장바구니에서도 해당 상품을 삭제한다", async () => {
      testDb.PRODUCT_TABLE.push(data_1);
      testDb.CART_TABLE.push({ product_id: 1, quantity: 2 });

      const app = createTestApp(testDb);
      await request(app).delete("/products/1").expect(204);

      expect(testDb.PRODUCT_TABLE.find((p) => p.id === 1)).toBeUndefined();
      expect(testDb.CART_TABLE.find((c) => c.product_id === 1)).toBeUndefined();
    });

    it("Success-status:204 존재하지 않는 id에도 멱등성을 위해 204를 반환한다", async () => {
      const app = createTestApp(testDb);
      const response = await request(app).delete("/products/999").expect(204);
      expect(response.body).toEqual({});
    });
  });
});
