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

const product_1 = { id: 1, name: "상품이름A", imgUrl: "/src.com", price: 35000 };
const product_2 = { id: 2, name: "상품이름B", imgUrl: "/src.com", price: 25000 };

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

describe("GET /cart", () => {
  it("Success[status:200] 장바구니안의 상품 정보들을 모두 가져온다.", async () => {
    const testDb: InMemoryDB = {
      PRODUCT_TABLE: [product_1, product_2],
      CART_TABLE: [
        { product_id: 1, quantity: 2 },
        { product_id: 2, quantity: 2 },
      ],
    };

    const app = createTestApp(testDb);
    const response = await request(app).get("/cart").type("json").expect(200);
    expect(response.body).toEqual({
      result: "success",
      data: {
        cartItems: [
          {
            productId: 1,
            productName: "상품이름A",
            productImg: "/src.com",
            productPrice: 35000,
            quantity: 2,
          },
          {
            productId: 2,
            productName: "상품이름B",
            productImg: "/src.com",
            productPrice: 25000,
            quantity: 2,
          },
        ],
      },
    });
  });
});

describe("PATCH /cart/:productId", () => {
  it("Success[status:200] 장바구니에서 해당 상품의 수량을 변경한다.", async () => {
    const testDb: InMemoryDB = {
      PRODUCT_TABLE: [product_1, product_2],
      CART_TABLE: [
        { product_id: 1, quantity: 2 },
        { product_id: 2, quantity: 2 },
      ],
    };

    const app = createTestApp(testDb);
    const response = await request(app)
      .patch("/cart/1")
      .type("json")
      .send({
        quantity: 3,
      })
      .expect(200);
    expect(response.body).toEqual({
      result: "success",
      data: {
        productId: 1,
        quantity: 3,
      },
    });
  });

  it("Error[Status:400] 변경 수량이 유효하지 않을 때", async () => {
    const testDb: InMemoryDB = {
      PRODUCT_TABLE: [product_1, product_2],
      CART_TABLE: [
        { product_id: 1, quantity: 2 },
        { product_id: 2, quantity: 2 },
      ],
    };

    const app = createTestApp(testDb);
    const response = await request(app)
      .patch("/cart/1")
      .type("json")
      .send({ quantity: -1 })
      .expect(400);

    expect(response.body).toEqual({
      result: "error",
      message: "수량이 유효하지 않습니다.",
    });
  });

  it("Error[Status:400] 변경 수량이 0일 때 에러 반환", async () => {
    const testDb: InMemoryDB = {
      PRODUCT_TABLE: [product_1, product_2],
      CART_TABLE: [
        { product_id: 1, quantity: 2 },
      ],
    };

    const app = createTestApp(testDb);
    const response = await request(app)
      .patch("/cart/1")
      .type("json")
      .send({ quantity: 0 })
      .expect(400);

    expect(response.body).toEqual({
      result: "error",
      message: "수량이 유효하지 않습니다.",
    });
  });

  it("Error[Status:400] 변경 수량이 100일 때 에러 반환", async () => {
    const testDb: InMemoryDB = {
      PRODUCT_TABLE: [product_1, product_2],
      CART_TABLE: [
        { product_id: 1, quantity: 2 },
      ],
    };

    const app = createTestApp(testDb);
    const response = await request(app)
      .patch("/cart/1")
      .type("json")
      .send({ quantity: 100 })
      .expect(400);

    expect(response.body).toEqual({
      result: "error",
      message: "수량이 유효하지 않습니다.",
    });
  });

  it("Error[Status:404] 장바구니에 해당 상품이 없을 때", async () => {
    const testDb: InMemoryDB = {
      PRODUCT_TABLE: [product_1, product_2],
      CART_TABLE: [
        { product_id: 1, quantity: 2 },
        { product_id: 2, quantity: 2 },
      ],
    };

    const app = createTestApp(testDb);
    const response = await request(app)
      .patch("/cart/999")
      .type("json")
      .send({ quantity: 3 })
      .expect(404);

    expect(response.body).toEqual({
      result: "error",
      message: "해당하는 장바구니 항목이 없습니다.",
    });
  });
});

describe("DELETE /cart/1", () => {
  it("Success[Status:204] 장바구니의 특정 상품을 삭제한다", async () => {
    const testDb: InMemoryDB = {
      PRODUCT_TABLE: [product_1],
      CART_TABLE: [{ product_id: 1, quantity: 2 }],
    };

    const app = createTestApp(testDb);

    const response = await request(app).delete("/cart/1").expect(204);

    expect(response.body).toEqual({});
  });
});
