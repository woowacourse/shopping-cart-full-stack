import request from "supertest";
import app from "../../src/app";
import { productRepository } from "../../src/repositories/ProductRepository";
import { cartRepository } from "../../src/repositories/CartRepository";

describe("product API 통합 테스트", () => {
  beforeEach(() => {
    productRepository.clear();
    cartRepository.clear(); 
  });

  it("관리자가 새로운 상품을 등록, 전체 목록을 조회, 해당 상품을 삭제", async () => {
    
    // =========================================================
    // 1. [등록] POST /products
    // =========================================================
    const newProductData = {
      name: "아이스 바닐라 라떼",
      price: 5500,
      thumbnailUrl: "https://example.com/latte.jpg",
      totalQuantity: 30
    };

    const postResponse = await request(app)
      .post("/products")
      .send(newProductData);
    
    expect(postResponse.status).toBe(201);
    expect(postResponse.body.name).toBe(newProductData.name);
    expect(postResponse.body.price).toBe(newProductData.price);
    expect(postResponse.body.thumbnailUrl).toBe(newProductData.thumbnailUrl);
    expect(postResponse.body.totalQuantity).toBe(newProductData.totalQuantity);

    const targetProductId = postResponse.body.productId;

    // =========================================================
    // 2. [조회] GET /products
    // =========================================================
    const getResponse = await request(app).get("/products");
    
    expect(getResponse.status).toBe(200);
    expect(getResponse.body).toHaveLength(1);
    expect(getResponse.body[0].productId).toBe(targetProductId);

    // =========================================================
    // 3. [삭제] DELETE /products/:productId
    // =========================================================
    const deleteResponse = await request(app).delete(`/products/${targetProductId}`);
    
    expect(deleteResponse.status).toBe(204);

    // =========================================================
    // 4. [최종 확인] 삭제가 잘 되었는지 다시 조회
    // =========================================================
    const finalCheckResponse = await request(app).get("/products");
    
    expect(finalCheckResponse.status).toBe(200);
    expect(finalCheckResponse.body).toHaveLength(0);
  });

  it("상품 삭제 시, 연관된 장바구니 아이템도 함께 연쇄 삭제(Cascading) 되어야 한다.", async () => {
    // Given
    const addedProduct = productRepository.addProduct({
      name: "에스프레소", price: 3000, thumbnailUrl: "url", totalQuantity: 50
    });
    const targetProductId = addedProduct.productId;
    
    cartRepository.addProductToCart(targetProductId, 3); // 장바구니에 담기

    expect(productRepository.getProducts()).toHaveLength(1);
    expect(cartRepository.getCartProducts()).toHaveLength(1);

    // When
    const deleteResponse = await request(app).delete(`/products/${targetProductId}`);
    expect(deleteResponse.status).toBe(204);

    // Then
    expect(cartRepository.getCartProducts()).toHaveLength(0);
  });
});