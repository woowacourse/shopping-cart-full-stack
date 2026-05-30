import request from "supertest";
import app from "../app.js";

describe("POST /products API 테스트", () => {
  test("정상적인 상품 정보로 요청 시 201과 생성된 id를 응답한다.", async () => {
    // given
    const newProduct = {
      name: "아디다스 양말",
      price: 13000,
      imgUrl: "https://image-url.com",
      quantity: 2,
    };

    // when
    const response = await request(app).post("/products").send(newProduct);

    // then
    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      message: "성공적으로 생성되었습니다.",
      result: { id: expect.any(Number) },
    });
  });
});

//   test("상품명이 100자를 초과하면 400과 PRODUCT_NAME_LENGTH_EXCEEDED 코드를 응답한다.", async () => {
//     // given
//     const invalidProduct = {
//       name: "a".repeat(101),
//       price: 13000,
//       imgUrl: "https://image-url.com",
//       quantity: 2,
//     };

//     // when
//     const response = await request(app).post("/products").send(invalidProduct);

//     // then
//     expect(response.status).toBe(400);
//     expect(response.body).toEqual({
//       code: "PRODUCT_NAME_LENGTH_EXCEEDED",
//       message: "상품명은 100자를 초과할 수 없습니다.",
//     });
//   });

//   test("가격이 0 이하이면 400과 INVALID_PRODUCT_PRICE_TYPE 코드를 응답한다.", async () => {
//     // given
//     const invalidProduct = {
//       name: "아디다스 양말",
//       price: 0,
//       imgUrl: "https://image-url.com",
//       quantity: 2,
//     };

//     // when
//     const response = await request(app).post("/products").send(invalidProduct);

//     // then
//     expect(response.status).toBe(400);
//     expect(response.body).toEqual({
//       code: "INVALID_PRODUCT_PRICE_TYPE",
//       message: "가격은 0보다 큰 숫자여야 합니다.",
//     });
//   });

//   test("재고 수량이 범위(1~99)를 벗어나면 400과 INVALID_PRODUCT_QUANTITY_RANGE 코드를 응답한다.", async () => {
//     // given
//     const invalidProduct = {
//       name: "아디다스 양말",
//       price: 13000,
//       imgUrl: "https://image-url.com",
//       quantity: 100,
//     };

//     // when
//     const response = await request(app).post("/products").send(invalidProduct);

//     // then
//     expect(response.status).toBe(400);
//     expect(response.body).toEqual({
//       code: "INVALID_PRODUCT_QUANTITY_RANGE",
//       message: "상품 재고는 1이상 99이하의 정수이어야 합니다.",
//     });
//   });

//   test("상품명 필드가 누락되면 400과 EMPTY_PRODUCT_NAME 코드를 응답한다.", async () => {
//     // given
//     const invalidProduct = {
//       price: 13000,
//       imgUrl: "https://image-url.com",
//       quantity: 2,
//     };

//     // when
//     const response = await request(app).post("/products").send(invalidProduct);

//     // then
//     expect(response.status).toBe(400);
//     expect(response.body).toEqual({
//       code: "EMPTY_PRODUCT_NAME",
//       message: "상품명 필드가 누락되었습니다.",
//     });
//   });
// });

// describe("DELETE /products API 테스트", () => {
//   beforeEach(() => {
//     productManager.reset();
//   });

//   test("정상적인 상품 삭제 시 204를 응답한다.", async () => {
//     // given
//     const newProduct = {
//       name: "아디다스 양말",
//       price: 13000,
//       imgUrl: "https://image-url.com",
//       quantity: 2,
//     };
//     await request(app).post("/products").send(newProduct);

//     const deleteId = 1;

//     // when
//     const response = await request(app).delete(`/products/${deleteId}`);

//     // then
//     expect(response.status).toBe(204);
//   });
// });

// describe("GET /products API 테스트", () => {
//   beforeEach(() => {
//     productManager.reset();
//   });

//   test("상품 조회 시 200과 상품 목록을 응답한다.", async () => {
//     // given
//     const newProduct = {
//       name: "아디다스 양말",
//       price: 13000,
//       imgUrl: "https://image-url.com",
//       quantity: 2,
//     };

//     // when
//     await request(app).post("/products").send(newProduct);
//     const response = await request(app).get(`/products`);

//     // then
//     expect(response.status).toBe(200);
//     expect(response.body).toEqual({
//       code: 200,
//       message: "요청에 성공했습니다.",
//       result: { products: [{ id: 1, ...newProduct }] },
//     });
//   });
// });

// describe("GET /carts API 테스트", () => {
//   test("장바구니 상품 조회 시 200과 상품 목록을 응답한다.", async () => {
//     // given
//     const newProduct = {
//       name: "아디다스 양말",
//       price: 13000,
//       imgUrl: "https://image-url.com",
//       quantity: 2,
//     };

//     // when
//     await request(app).post("/products").send(newProduct);

//     // 장바구니에 담는 API는 존재하지 않기때문에 App.ts에서 생성한 Cart 인스턴스를 직접 사용한다.
//     cart.addCartItem(1, 10);
//     const response = await request(app).get(`/carts`);

//     // then
//     expect(response.status).toBe(200);
//     expect(response.body).toEqual({
//       code: 200,
//       message: "요청에 성공했습니다.",
//       result: {
//         cartItems: [
//           {
//             id: 1,
//             name: "아디다스 양말",
//             price: 13000,
//             imgUrl: "https://image-url.com",
//             orderCount: 10,
//           },
//         ],
//       },
//     });
//   });
// });

// describe("DELETE /carts/:id API 테스트", () => {
//   beforeEach(() => {
//     productManager.reset();
//   });

//   test("장바구니 상품 삭제 시 204를 응답한다.", async () => {
//     // given

//     // 장바구니에 담는 API는 존재하지 않기때문에 App.ts에서 생성한 Cart 인스턴스를 직접 사용한다.
//     cart.addCartItem(1, 10);

//     const deleteId = 1;

//     // when
//     const response = await request(app).delete(`/carts/${deleteId}`);

//     // then
//     expect(response.status).toBe(204);
//   });
// });

// describe("PATCH /carts/:id API 테스트", () => {
//   beforeEach(() => {
//     productManager.reset();
//   });

//   test("장바구니 상품 수량 변경 성공 시 200과 id, orderCount를 응답한다.", async () => {
//     //given
//     const newProduct = {
//       name: "아디다스 양말",
//       price: 13000,
//       imgUrl: "https://image-url.com",
//       quantity: 50,
//     };
//     await request(app).post("/products").send(newProduct);

//     // 장바구니에 담는 API는 존재하지 않기때문에 App.ts에서 생성한 Cart 인스턴스를 직접 사용한다.
//     const updateId = 1;

//     cart.addCartItem(updateId, 10);
//     const updateOrderCount = 5;

//     // when
//     const response = await request(app).patch(`/carts/${updateId}`).send({
//       orderCount: updateOrderCount,
//     });

//     // then
//     expect(response.status).toBe(200);
//     expect(response.body).toEqual({
//       code: 200,
//       message: "성공적으로 수량이 변경되었습니다.",
//       result: {
//         id: updateId,
//         orderCount: updateOrderCount,
//       },
//     });
//   });
// });
