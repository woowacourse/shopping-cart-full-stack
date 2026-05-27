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

  it("유저가 상품을 장바구니에 담고, 조회하고, 수량을 수정한 뒤, 최종적으로 삭제한다.", async () => {
    // =========================================================
    // 1. [담기] POST /cart
    // =========================================================
    const postResponse = await request(app)
      .post("/cart")
      .send({ productId: 1, quantity: 2 });
    
    expect(postResponse.status).toBe(201);
    expect(postResponse.body.productId).toBe(1);
    expect(postResponse.body.quantity).toBe(2);

    const targetCartId = postResponse.body.cartItemId;

    // =========================================================
    // 2. [조회] GET /cart
    // =========================================================
    const getResponse = await request(app).get("/cart");
    
    expect(getResponse.status).toBe(200);
    expect(getResponse.body).toHaveLength(1);
    expect(getResponse.body[0].cartItemId).toBe(targetCartId);

    // =========================================================
    // 3. [수량 변경] PATCH /cart/:cartItemId
    // =========================================================
    const patchResponse = await request(app)
      .patch(`/cart/${targetCartId}`)
      .send({ quantity: 5 }); // 수량을 5개로 변경
    
    expect(patchResponse.status).toBe(200);
    expect(patchResponse.body.quantity).toBe(5);

    // =========================================================
    // 4. [삭제] DELETE /cart/:cartItemId
    // =========================================================
    const deleteResponse = await request(app).delete(`/cart/${targetCartId}`);
    
    expect(deleteResponse.status).toBe(204);

    // =========================================================
    // 5. [최종 확인] 삭제가 잘 되었는지 다시 조회
    // =========================================================
    const finalCheckResponse = await request(app).get("/cart");
    
    expect(finalCheckResponse.status).toBe(200);
    expect(finalCheckResponse.body).toHaveLength(0);
  });
});