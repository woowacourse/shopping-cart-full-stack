import request from "supertest";
import app from "../../src/app";
import { productRepository } from "../../src/repositories/ProductRepository";
import { cartRepository } from "../../src/repositories/CartRepository";

const validProduct = {
  name: "아이스 바닐라 라떼",
  price: 5500,
  thumbnailUrl: "https://example.com/latte.jpg",
  totalQuantity: 30,
};

describe("product API 통합 테스트", () => {
  beforeEach(() => {
    productRepository.clear();
    cartRepository.clear();
  });

  describe("POST /products", () => {
    it("유효한 요청으로 상품을 등록한다", async () => {
      const response = await request(app).post("/products").send(validProduct);

      expect(response.status).toBe(201);
      expect(response.body.name).toBe(validProduct.name);
      expect(response.body.price).toBe(validProduct.price);
      expect(response.body.thumbnailUrl).toBe(validProduct.thumbnailUrl);
      expect(response.body.totalQuantity).toBe(validProduct.totalQuantity);
    });

    it("name이 없으면 400을 반환한다", async () => {
      const response = await request(app)
        .post("/products")
        .send({ ...validProduct, name: "" });

      expect(response.status).toBe(400);
    });

    it("name이 100자를 초과하면 400을 반환한다", async () => {
      const response = await request(app)
        .post("/products")
        .send({ ...validProduct, name: "가".repeat(101) });

      expect(response.status).toBe(400);
    });

    it("price가 0 이하이면 400을 반환한다", async () => {
      const response = await request(app)
        .post("/products")
        .send({ ...validProduct, price: 0 });

      expect(response.status).toBe(400);
    });

    it("thumbnailUrl이 없으면 400을 반환한다", async () => {
      const response = await request(app)
        .post("/products")
        .send({ ...validProduct, thumbnailUrl: "" });

      expect(response.status).toBe(400);
    });

    it("totalQuantity가 범위를 벗어나면 400을 반환한다", async () => {
      const response = await request(app)
        .post("/products")
        .send({ ...validProduct, totalQuantity: 0 });

      expect(response.status).toBe(400);
    });
  });

  describe("GET /products", () => {
    it("상품 목록을 조회한다", async () => {
      productRepository.addProduct(validProduct);

      const response = await request(app).get("/products");

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
    });

    it("상품이 없으면 빈 배열을 반환한다", async () => {
      const response = await request(app).get("/products");

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(0);
    });
  });

  describe("DELETE /products/:productId", () => {
    let productId: number;

    beforeEach(() => {
      const product = productRepository.addProduct(validProduct);
      productId = product.productId;
    });

    it("상품을 삭제한다", async () => {
      const response = await request(app).delete(`/products/${productId}`);

      expect(response.status).toBe(204);
      expect(productRepository.getProducts()).toHaveLength(0);
    });

    it("존재하지 않는 productId로 요청 시 404를 반환한다", async () => {
      const response = await request(app).delete("/products/999");

      expect(response.status).toBe(404);
    });

    it("상품 삭제 시 연관된 장바구니 아이템도 함께 삭제된다", async () => {
      cartRepository.addProductToCart(productId, 3);
      expect(cartRepository.getCartProducts()).toHaveLength(1);

      await request(app).delete(`/products/${productId}`);

      expect(cartRepository.getCartProducts()).toHaveLength(0);
    });
  });
});
