import express from 'express';
import request from 'supertest';
import { productRouter } from '../../../src/modules/products/product.routes.js';
import { errorHandler } from '../../../src/middlewares/errorHandlers.js';

const app = express();

app.use(express.json());
app.use(productRouter);
app.use(errorHandler);

describe('상품 에러 테스트', () => {
  describe('상품 추가 에러 테스트', () => {
    test('상품 추가 시, 상품의 이름이 유효하지 않은 경우 INVALID_PRODUCT_NAME 에러를 반환한다.', async () => {
      const addRes = await request(app).post('/products').send({
        productName: ' ',
        productPrice: 1300,
        remainingQuantity: 25,
        imageUrl: 'src/assets/coke.png',
      });

      expect(addRes.status).toBe(400);
      expect(addRes.body.code).toBe('INVALID_PRODUCT_NAME');
      expect(addRes.body.message).toEqual('유효하지 않은 상품 이름입니다.');
    });

    test('상품 추가 시, 상품의 가격이 유효하지 않은 경우 INVALID_PRODUCT_PRICE 에러를 반환한다.', async () => {
      const addRes = await request(app).post('/products').send({
        productName: '콜라',
        productPrice: ' ',
        remainingQuantity: 25,
        imageUrl: 'src/assets/coke.png',
      });

      expect(addRes.status).toBe(400);
      expect(addRes.body.code).toBe('INVALID_PRODUCT_PRICE');
      expect(addRes.body.message).toEqual('유효하지 않은 상품 가격입니다.');
    });

    test('상품 추가 시, 상품의 수량이 유효하지 않은 경우 INVALID_REMAINING_QUANTITY 에러를 반환한다.', async () => {
      const addRes = await request(app).post('/products').send({
        productName: '콜라',
        productPrice: 1300,
        imageUrl: 'src/assets/coke.png',
      });

      expect(addRes.status).toBe(400);
      expect(addRes.body.code).toBe('INVALID_REMAINING_QUANTITY');
      expect(addRes.body.message).toEqual('유효하지 않은 상품 수량입니다.');
    });

    test('상품 추가 시, 상품의 이름이 유효하지 않은 경우 INVALID_PRODUCT_NAME 에러를 반환한다.', async () => {
      const addRes = await request(app).post('/products').send({
        productName: '콜라',
        productPrice: 1300,
        remainingQuantity: 100,
        imageUrl: ' ',
      });

      expect(addRes.status).toBe(400);
      expect(addRes.body.code).toBe('INVALID_IMAGE_URL');
      expect(addRes.body.message).toEqual('유효하지 않은 이미지 경로입니다.');
    });
  });

  describe('상품 삭제 에러 테스트', () => {
    test('상품 삭제 시, 해당 상품이 존재하지 않는 경우 PRODUCT_NOT_FOUND 에러를 반환한다.', async () => {
      const deleteRes = await request(app).delete(`/products/123123`);
      expect(deleteRes.status).toBe(404);
      expect(deleteRes.body.code).toEqual('PRODUCT_NOT_FOUND');
      expect(deleteRes.body.message).toEqual('존재하지 않는 상품입니다.');
    });
  });
});
