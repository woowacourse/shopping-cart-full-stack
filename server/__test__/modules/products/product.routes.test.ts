import express from 'express';
import request from 'supertest';
import { productRouter } from '../../../src/modules/products/product.routes.js';

const mockProduct = {
  productId: '1',
  productName: 'testName',
  productPrice: 1300,
  remainingQuantity: 25,
  imageUrl: 'src/assets/test.png',
};

const app = express();

app.use(express.json());
app.use(productRouter);

describe('상품 API', () => {
  it('상품 목록 요청', async () => {
    const response = await request(app).get('/products');

    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });
  it('상품 추가', async () => {
    const response = await request(app).post('/products').send({
      productName: mockProduct.productName,
      productPrice: mockProduct.productPrice,
      remainingQuantity: mockProduct.remainingQuantity,
      imageUrl: mockProduct.imageUrl,
    });

    expect(response.status).toBe(201);
    expect(response.body).toEqual({ productId: expect.any(String) });
  });
  it('상품 삭제', async () => {
    const response = await request(app).post('/products').send({
      productName: mockProduct.productName,
      productPrice: mockProduct.productPrice,
      remainingQuantity: mockProduct.remainingQuantity,
      imageUrl: mockProduct.imageUrl,
    });

    const deleteRes = await request(app).delete(
      `/products/${response.body.productId}`,
    );
    expect(deleteRes.status).toBe(204);
  });
});
