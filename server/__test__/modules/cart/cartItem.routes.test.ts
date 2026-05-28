import express from 'express';
import request from 'supertest';
import { cartItemRouter } from '../../../src/modules/cart/cartItem.routes.js';
import { cartItemsDB, productsDB } from '../../../src/db.js';
import { Product } from '../../../src/modules/products/product.model.js';

const mockCartItem = {
  productId: '1',
  purchaseQuantity: 1,
};

const mockProduct = new Product({
  productId: mockCartItem.productId,
  productName: '콜라',
  productPrice: 1300,
  remainingQuantity: 25,
  imageUrl: 'src/assets/coke.png',
});

const app = express();

app.use(express.json());
app.use(cartItemRouter);

describe('장바구니 API', () => {
  beforeEach(() => {
    cartItemsDB.clear();
    productsDB.clear();
    productsDB.set(mockProduct.productId, mockProduct);
  });

  it('장바구니 목록 요청', async () => {
    const response = await request(app).get('/cart/items');

    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });
  it('장바구니에 상품 추가', async () => {
    const response = await request(app).post('/cart/items').send({
      productId: mockCartItem.productId,
      purchaseQuantity: mockCartItem.purchaseQuantity,
    });

    expect(response.status).toBe(201);
    expect(response.body).toEqual({ cartItemId: expect.any(String) });
  });
  it('상품 삭제', async () => {
    // 장바구니에 상품 추가
    const response = await request(app).post('/cart/items').send({
      productId: mockCartItem.productId,
      purchaseQuantity: mockCartItem.purchaseQuantity,
    });

    // 상품 삭제
    const deleteRes = await request(app).delete(
      `/cart/items/${response.body.cartItemId}`,
    );
    expect(deleteRes.status).toBe(204);
  });
  it('상품 수량 업데이트', async () => {
    // 장바구니에 상품 추가
    const response = await request(app).post('/cart/items').send({
      productId: mockCartItem.productId,
      purchaseQuantity: mockCartItem.purchaseQuantity,
    });

    // 상품 수량 수정
    const patchRes = await request(app)
      .patch(`/cart/items/${response.body.cartItemId}`)
      .send({ purchaseQuantity: 2 });
    expect(patchRes.status).toBe(200);
  });
});
