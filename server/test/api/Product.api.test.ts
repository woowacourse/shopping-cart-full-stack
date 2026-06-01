import request from "supertest";
import { runApp } from "../../src/app";
import InMemoryProductRepository from "../../src/repositories/InMemoryProductRepository";
import InMemoryCartRepository from "../../src/repositories/InMemoryCartRepository";

describe("product API 통합 테스트", () => {
  let app: any;
  let productRepo: InMemoryProductRepository;
  let cartRepo: InMemoryCartRepository;

  beforeEach(() => {
    productRepo = new InMemoryProductRepository();
    cartRepo = new InMemoryCartRepository();
    app = runApp({ productRepo, cartRepo });
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
    const addedProduct = productRepo.addProduct({
      name: "에스프레소", price: 3000, thumbnailUrl: "url", totalQuantity: 50
    });
    const targetProductId = addedProduct.productId;
    
    cartRepo.addProductToCart(targetProductId, 3);

    expect(productRepo.getProducts()).toHaveLength(1);
    expect(cartRepo.getCartProducts()).toHaveLength(1);

    // When
    const deleteResponse = await request(app).delete(`/products/${targetProductId}`);
    expect(deleteResponse.status).toBe(204);

    // Then
    expect(cartRepo.getCartProducts()).toHaveLength(0);
  });
});

describe("product API 예외 상황 통합 테스트", () => {
  let app: any;
  let productRepo: InMemoryProductRepository;
  let cartRepo: InMemoryCartRepository;

  beforeEach(() => {
    productRepo = new InMemoryProductRepository();
    cartRepo = new InMemoryCartRepository();
    app = runApp({ productRepo, cartRepo });
  });

  it("POST /products : 상품 등록 시 필수 데이터가 누락되거나 조건에 맞지 않으면 400 에러를 반환한다.", async () => {
    const missingFieldData = {
      price: 5500,
      thumbnailUrl: "https://example.com/latte.jpg",
      totalQuantity: 30,
    };

    const response1 = await request(app)
      .post("/products")
      .send(missingFieldData);

    expect(response1.status).toBe(400);

    const invalidPriceData = {
      name: "무료커피",
      price: -1000,
      thumbnailUrl: "https://example.com/free.jpg",
      totalQuantity: 30,
    };

    const response2 = await request(app)
      .post("/products")
      .send(invalidPriceData);

    expect(response2.status).toBe(400);
  });

  it("DELETE /products/:productId : 존재하지 않는 상품을 삭제하려 하면 404 에러를 반환한다.", async () => {
    const response = await request(app).delete("/products/9999");

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("해당 상품이 존재하지 않습니다.");
  });

  it("DELETE /products/:productId : 유효하지 않은 형태의 상품 ID를 삭제하려 하면 400 에러를 반환한다.", async () => {
    const response = await request(app).delete("/products/not-a-number");

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("유효하지 않은 ID입니다.");
  });
});
