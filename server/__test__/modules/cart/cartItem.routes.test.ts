import express from 'express';
import request from 'supertest';
import { userDB } from '../../../src/db.js';
import { cartItemRouter } from '../../../src/modules/cart/cartItem.routes.js';

const mockCartItem = {
  productId: '1',
  purchaseQuantity: 1,
};

const app = express();

app.use(express.json());
app.use(cartItemRouter);

describe('장바구니 API', () => {
  beforeEach(() => {
    userDB[0].cartItemsDB.clear();
  });

  it('장바구니 목록 요청', async () => {
    const response = await request(app).get('/users/1/cart/items');

    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });
  it('장바구니에 상품 추가', async () => {
    const response = await request(app).post('/users/1/cart/items').send({
      productId: mockCartItem.productId,
    });

    expect(response.status).toBe(201);
    expect(response.body).toEqual({ cartItemId: expect.any(String) });
  });
  it('상품 삭제', async () => {
    // 장바구니에 상품 추가
    const response = await request(app).post('/users/1/cart/items').send({
      productId: mockCartItem.productId,
    });

    // 상품 삭제
    const deleteRes = await request(app).delete(
      `/users/1/cart/items/${response.body.cartItemId}`,
    );
    expect(deleteRes.status).toBe(204);
  });
  it('상품 수량 업데이트', async () => {
    // 장바구니에 상품 추가
    const response = await request(app).post('/users/1/cart/items').send({
      productId: mockCartItem.productId,
    });

    // 상품 수량 수정
    const patchRes = await request(app)
      .patch(`/users/1/cart/items/${response.body.cartItemId}`)
      .send({ purchaseQuantity: 2 });
    expect(patchRes.status).toBe(200);
  });
});
