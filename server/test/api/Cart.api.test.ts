import request from "supertest";
import { runApp } from "../../src/app";
import InMemoryProductRepository from "../../src/repositories/InMemoryProductRepository";
import InMemoryCartRepository from "../../src/repositories/InMemoryCartRepository";

describe("장바구니 API 통합 테스트", () => {
  let app: any;
  let productRepo: InMemoryProductRepository;
  let cartRepo: InMemoryCartRepository;

  beforeEach(() => {
    productRepo = new InMemoryProductRepository();
    cartRepo = new InMemoryCartRepository();
    app = runApp({ productRepo, cartRepo });

    productRepo.addProduct({ name: "아메리카노", price: 4500, thumbnailUrl: "url", totalQuantity: 50 });
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
    expect(getResponse.body[0].product.name).toBe("아메리카노");

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

describe("장바구니 API 예외 상황 통합 테스트", () => {
  let app: any;
  let productRepo: InMemoryProductRepository;
  let cartRepo: InMemoryCartRepository;
  let validProductId: number;

  beforeEach(() => {
    productRepo = new InMemoryProductRepository();
    cartRepo = new InMemoryCartRepository();
    app = runApp({ productRepo, cartRepo });

    const product = productRepo.addProduct({
      name: "아메리카노",
      price: 4500,
      thumbnailUrl: "url",
      totalQuantity: 50,
    });
    validProductId = product.productId;
  });

  it("POST /cart : 존재하지 않는 상품 ID를 장바구니에 담으려 하면 404 에러를 반환한다.", async () => {
    const invalidProductId = 9999;
    
    const response = await request(app)
      .post("/cart")
      .send({ productId: invalidProductId, quantity: 2 });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("해당 상품이 존재하지 않습니다.");
  });

  it("PATCH /cart/:cartItemId : 존재하지 않는 장바구니 ID의 수량을 수정하려 하면 404 에러를 반환한다.", async () => {
    const response = await request(app)
      .patch("/cart/9999")
      .send({ quantity: 5 });

    expect(response.status).toBe(404);
  });

  it("DELETE /cart/:cartItemId : 유효하지 않은 형태의 장바구니 ID를 삭제하려 하면 400 에러를 반환한다.", async () => {
    const response = await request(app).delete("/cart/invalid-id");

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("유효하지 않은 ID입니다.");
  });
});
