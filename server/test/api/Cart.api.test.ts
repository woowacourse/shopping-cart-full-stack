import request from "supertest";
import app from "../../src/app";
import { cartRepository } from "../../src/repositories/CartRepository";
import { productRepository } from "../../src/repositories/ProductRepository";

describe("장바구니 API 통합 테스트", () => {
  beforeEach(() => {
    cartRepository.clear();
    productRepository.clear();
    productRepository.addProduct({ name: "아메리카노", price: 4500, thumbnailUrl: "url", totalQuantity: 50 });
  });

  describe("POST /cart", () => {
    it("유효한 요청으로 장바구니에 상품을 담는다", async () => {
      const response = await request(app)
        .post("/cart")
        .send({ productId: 1, quantity: 2 });

      expect(response.status).toBe(201);
      expect(response.body.productId).toBe(1);
      expect(response.body.quantity).toBe(2);
    });

    it("존재하지 않는 productId로 요청 시 404를 반환한다", async () => {
      const response = await request(app)
        .post("/cart")
        .send({ productId: 999, quantity: 2 });

      expect(response.status).toBe(404);
    });

    it("수량이 0이면 400을 반환한다", async () => {
      const response = await request(app)
        .post("/cart")
        .send({ productId: 1, quantity: 0 });

      expect(response.status).toBe(400);
    });

    it("수량이 100 이상이면 400을 반환한다", async () => {
      const response = await request(app)
        .post("/cart")
        .send({ productId: 1, quantity: 100 });

      expect(response.status).toBe(400);
    });
  });

  describe("GET /cart", () => {
    it("장바구니 목록을 조회한다", async () => {
      cartRepository.addProductToCart(1, 3);

      const response = await request(app).get("/cart");

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
    });

    it("장바구니가 비어있으면 빈 배열을 반환한다", async () => {
      const response = await request(app).get("/cart");

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(0);
    });
  });

  describe("PATCH /cart/:cartItemId", () => {
    let cartItemId: number;

    beforeEach(() => {
      const cartItem = cartRepository.addProductToCart(1, 2);
      cartItemId = cartItem.cartItemId;
    });

    it("장바구니 수량을 변경한다", async () => {
      const response = await request(app)
        .patch(`/cart/${cartItemId}`)
        .send({ quantity: 5 });

      expect(response.status).toBe(200);
      expect(response.body.quantity).toBe(5);
    });

    it("존재하지 않는 cartItemId로 요청 시 404를 반환한다", async () => {
      const response = await request(app)
        .patch("/cart/999")
        .send({ quantity: 5 });

      expect(response.status).toBe(404);
    });

    it("수량이 0이면 400을 반환한다", async () => {
      const response = await request(app)
        .patch(`/cart/${cartItemId}`)
        .send({ quantity: 0 });

      expect(response.status).toBe(400);
    });

    it("수량이 100 이상이면 400을 반환한다", async () => {
      const response = await request(app)
        .patch(`/cart/${cartItemId}`)
        .send({ quantity: 100 });

      expect(response.status).toBe(400);
    });
  });

  describe("DELETE /cart/:cartItemId", () => {
    let cartItemId: number;

    beforeEach(() => {
      const cartItem = cartRepository.addProductToCart(1, 2);
      cartItemId = cartItem.cartItemId;
    });

    it("장바구니 아이템을 삭제한다", async () => {
      const response = await request(app).delete(`/cart/${cartItemId}`);

      expect(response.status).toBe(204);
      expect(cartRepository.getCartProducts()).toHaveLength(0);
    });

    it("존재하지 않는 cartItemId로 요청 시 404를 반환한다", async () => {
      const response = await request(app).delete("/cart/999");

      expect(response.status).toBe(404);
    });
  });
});
